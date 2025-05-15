import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

// This is your Stripe webhook secret for testing your endpoint locally.
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Initialize Supabase client with service role for admin access
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret as string
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Retrieve the subscription details or metadata
    const userId = session.metadata?.userId;
    const creditAmount = parseInt(session.metadata?.credits || '0', 10);

    if (userId && creditAmount > 0) {
      try {
        // Update the user's credits in Supabase
        const { data, error } = await supabaseAdmin
          .from('users')
          .select('credits')
          .eq('id', userId)
          .single();

        if (error) throw error;

        const currentCredits = data?.credits || 0;
        const newCredits = currentCredits + creditAmount;

        const { error: updateError } = await supabaseAdmin
          .from('users')
          .update({ credits: newCredits })
          .eq('id', userId);

        if (updateError) throw updateError;

        // Also log the transaction in a payments table
        await supabaseAdmin.from('payments').insert({
          user_id: userId,
          amount: session.amount_total || 0,
          credits: creditAmount,
          stripe_session_id: session.id,
          status: 'completed',
          payment_method: 'stripe',
        });

      } catch (error) {
        console.error('Error updating user credits:', error);
        return NextResponse.json(
          { error: 'Failed to update user credits' },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}

// Need to disable the default body parser to handle the webhook properly
export const config = {
  api: {
    bodyParser: false,
  },
}; 