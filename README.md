# ImageMax

A Progressive Web App (PWA) for enhancing and transforming images using AI. The app integrates with Supabase for authentication and user management, and Stripe for handling payments.

## Features

- Image upload via drag-and-drop, file selection, or camera
- AI-powered image transformation based on text prompts
- Google Lens-like object recognition
- User authentication with Supabase
- Credit-based payment system with Stripe
- Responsive design with elegant animations

## Technologies Used

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Supabase for authentication and database
- Stripe for payment processing
- Deployed on Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Stripe account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/imagemax.git
   cd imagemax
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Setup

Create the following tables in your Supabase database:

### Users Table

```sql
CREATE TABLE users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE,
  credits INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### Generations Table

```sql
CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  prompt TEXT,
  original_image_url TEXT,
  generated_image_url TEXT,
  similar_image_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### Payments Table

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  amount INTEGER,
  credits INTEGER,
  stripe_session_id TEXT,
  status TEXT,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

## Deployment

The app can be easily deployed on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up the environment variables in the Vercel dashboard
4. Deploy!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons from [Lucide Icons](https://lucide.dev/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
