import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

// This is your Stripe webhook secret for testing your endpoint locally.
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Initialize Supabase client with service role for admin access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Route segment config for Vercel and Stripe webhooks
export const runtime = 'nodejs'; // Stripe's webhook needs Node.js runtime
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Giving enough time for webhook processing
export const preferredRegion = 'auto';

export async function POST(req: NextRequest) {
  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase configuration');
    return NextResponse.json(
      { error: 'Database configuration not found' },
      { status: 500 }
    );
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  const stripe = getStripe();
  
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
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

      } catch (error: any) {
        console.error('Error updating user credits:', error);
        return NextResponse.json(
          { error: error.message || 'Failed to update user credits' },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ received: true });
} 