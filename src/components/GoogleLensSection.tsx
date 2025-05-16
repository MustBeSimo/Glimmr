import React from 'react';

interface SimilarImage {
  thumbnailUrl: string;
  sourceUrl: string;
  title: string;
}

interface GoogleLensSectionProps {
  similarImages: SimilarImage[];
  isLoading: boolean;
}

const GoogleLensSection: React.FC<GoogleLensSectionProps> = ({ similarImages, isLoading }) => {
  return (
    <div className="bg-gray-700 p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-3">Google Lens Section</h2>
      {isLoading && <p className="text-gray-400">Loading similar images...</p>}
      {!isLoading && similarImages.length === 0 && <p className="text-gray-400">No similar images found yet.</p>}
      {similarImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {similarImages.map((image, index) => (
            <a
              key={index}
              href={image.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-gray-600 rounded-md overflow-hidden hover:border-blue-500 transition-all"
              title={image.title}
            >
              <img src={image.thumbnailUrl} alt={image.title || 'Similar image'} className="w-full h-24 object-cover" />
              {image.title && <p className="text-xs p-1 bg-black bg-opacity-50 truncate text-white">{image.title}</p>}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoogleLensSection; 