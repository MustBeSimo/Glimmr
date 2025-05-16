'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/store/store';

interface SimilarImage {
  url: string;
  title: string;
  sourceUrl: string;
}

interface ApiResponse {
  images: SimilarImage[];
  source?: string;
  error?: string;
}

export default function GoogleLensResults() {
  const { mainImage } = useAppStore();
  const [similarImages, setSimilarImages] = useState<SimilarImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSimilarImages = async () => {
      if (!mainImage) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/similar-images', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: mainImage }),
        });

        const data: ApiResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch similar images');
        }

        if (data.error) {
          setError(data.error);
          setSimilarImages([]);
        } else {
          setSimilarImages(data.images);
          setError(null);
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch similar images');
        setSimilarImages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimilarImages();
  }, [mainImage]);

  if (!mainImage) {
    return (
      <div className="h-full flex flex-col">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Google Lens</h2>
        <p className="text-sm text-gray-500">
          Upload or capture an image to identify objects
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Google Lens</h2>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-2">
                <div className="w-14 h-14 bg-gray-200 rounded" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 bg-gray-200 w-3/4 rounded" />
                  <div className="h-2 bg-gray-200 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-red-500 p-3 bg-red-50 rounded-md">
            <AlertCircle size={16} />
            <p className="text-sm">{error}</p>
          </div>
        ) : similarImages.length === 0 ? (
          <div className="text-sm text-gray-500">
            No similar images found
          </div>
        ) : (
          <div className="space-y-2">
            {similarImages.map((image, index) => (
              <a
                key={index}
                href={image.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-md transition-colors"
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-14 h-14 object-cover rounded-md"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {image.title}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <ExternalLink size={10} />
                    {new URL(image.sourceUrl).hostname}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 