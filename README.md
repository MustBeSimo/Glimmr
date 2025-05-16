# Glimmr

A browser-native, installable progressive web application that lets anyone snap or upload a picture, see visually similar images instantly, and then remix that same photo with AI—all without leaving the page or installing a traditional app.

## Tech Stack

- Frontend: React (Vite) + TypeScript
- Styling: Tailwind CSS
- Backend: Vercel Edge Functions
- Image Recognition: Google Cloud Vision / SerpAPI
- Image Editing: OpenAI DALL-E
- PWA: Service Worker, Manifest

## Running Locally

1. Clone the repo.
2. Install dependencies: `pnpm install`
3. Create a `.env.local` file in the root directory with the following content:
   ```
   OPENAI_API_KEY=your_openai_api_key
   GCP_PROJECT_ID=your_gcp_project_id
   GCP_VISION_KEY=your_gcp_vision_key_base64_encoded_service_account_json
   SERPAPI_KEY=your_serpapi_key
   ```
   *Note: For `GCP_VISION_KEY`, you typically provide the base64 encoded content of your service account JSON key file.*
4. Start the development server: `pnpm dev`

## Building for Production

```bash
pnpm build
pnpm preview
```

## Deployment

Pushing to GitHub can trigger Vercel's automatic build and deployment if configured.
Environment variables need to be set in the Vercel project settings.

## Features

- 📸 Take photos or upload images directly in the browser
- 🔍 Find visually similar images using Google Cloud Vision or SerpAPI
- ✨ Edit images with OpenAI's GPT-Image-1
- 📱 Install as a PWA on any device
- 🔄 Works offline with service worker caching

## Technical Details

- Built with Next.js 14 and React 18
- Styled with Tailwind CSS
- State management with Zustand
- PWA features with service worker
- API integrations:
  - Google Cloud Vision for image similarity
  - SerpAPI as a fallback for Google Lens
  - OpenAI's GPT-Image-1 for image editing

git add .
git commit -m "Update x"
git push