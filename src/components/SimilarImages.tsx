'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/store';

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
      <div className="text-center p-6">
        <p className="text-gray-500">Upload or capture an image to see similar results</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Similar Images</h2>
      
      {similarImages.length === 0 ? (
        <div className="text-center p-6">
          <p className="text-gray-500">Searching for similar images...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {similarImages.map((image, index) => (
            <a
              key={index}
              href={image.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="aspect-square relative overflow-hidden rounded-lg">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm truncate">
                  {image.title}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
} 