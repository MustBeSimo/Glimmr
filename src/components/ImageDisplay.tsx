import React from 'react';

interface ImageDisplayProps {
  imageUrl: string | null;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl }) => {
  return (
    <div className="aspect-[16/9] bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
      {imageUrl ? (
        <img src={imageUrl} alt="Main display" className="w-full h-full object-contain" />
      ) : (
        <p className="text-gray-400">Main image 16:9</p>
      )}
    </div>
  );
};

export default ImageDisplay; 