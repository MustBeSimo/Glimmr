# Glimmr

Glimmr is a browser-native, installable progressive web application that lets anyone snap or upload a picture, see visually similar images instantly, and then remix that same photo with AI—all without leaving the page or installing a traditional app.

## Features

- 📸 Take photos or upload images directly in the browser
- 🔍 Find visually similar images using Google Cloud Vision or SerpAPI
- ✨ Edit images with OpenAI's GPT-Image-1
- 📱 Install as a PWA on any device
- 🔄 Works offline with service worker caching

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or pnpm
- API keys for:
  - OpenAI
  - Google Cloud Vision (or SerpAPI as fallback)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
OPENAI_API_KEY=your_openai_key
GCP_PROJECT_ID=your_gcp_project_id
GCP_CLIENT_EMAIL=your_gcp_client_email
GCP_PRIVATE_KEY=your_gcp_private_key
SERPAPI_KEY=your_serpapi_key
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/glimmr.git
cd glimmr
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
pnpm build
pnpm start
```

## Deployment

The app is designed to be deployed on Vercel:

1. Import your GitHub repository in the Vercel dashboard
2. Add your environment variables in Project Settings
3. Deploy!

## Technical Details

- Built with Next.js 14 and React 18
- Styled with Tailwind CSS
- State management with Zustand
- PWA features with service worker
- API integrations:
  - Google Cloud Vision for image similarity
  - SerpAPI as a fallback for Google Lens
  - OpenAI's GPT-Image-1 for image editing

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
