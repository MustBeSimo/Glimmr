'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/store';
import Image from 'next/image';
import { Search, ExternalLink } from 'lucide-react';

export default function SimilarImages() {
  const { mainImage, similarImages, setSimilarImages } = useAppStore();

  useEffect(() => {
    const fetchSimilarImages = async () => {
      if (!mainImage) return;

      try {
        const response = await fetch('/api/similar-images', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: mainImage }),
        });

        if (!response.ok) throw new Error('Failed to fetch similar images');

        const data = await response.json();
        setSimilarImages(data.images);
      } catch (error) {
        console.error('Error fetching similar images:', error);
      }
    };

    fetchSimilarImages();
  }, [mainImage, setSimilarImages]);

  if (!mainImage) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500 text-sm">Upload or capture an image to identify objects</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Search className="mr-2 text-blue-500" size={20} />
        Google Lens
      </h2>
      
      {similarImages.length === 0 ? (
        <div className="text-center p-4">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Identifying objects in your image...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-3">Similar objects found in your image:</p>
          {similarImages.slice(0, 3).map((image, index) => (
            <a
              key={index}
              href={image.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                <div className="w-16 h-16 relative flex-shrink-0">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="rounded-lg object-cover w-full h-full"
                  />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {image.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate flex items-center mt-1">
                    <ExternalLink size={12} className="mr-1" />
                    {new URL(image.sourceUrl).hostname}
                  </p>
                </div>
              </div>
            </a>
          ))}
          
          {similarImages.length > 3 && (
            <a 
              href="#" 
              className="text-center block text-sm text-blue-600 hover:text-blue-800 mt-2 transition-colors"
            >
              View all {similarImages.length} results
            </a>
          )}
        </div>
      )}
    </div>
  );
} 