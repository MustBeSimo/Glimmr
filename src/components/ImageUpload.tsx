import React from 'react';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageUpload(event.target.files[0]);
    }
  };

  return (
    <div className="absolute top-4 right-4">
      <label
        htmlFor="image-upload-input"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-full cursor-pointer shadow-lg flex items-center justify-center w-12 h-12"
        title="Upload image or take camera shoot"
      >
        {/* You can use an icon here, e.g., a camera icon */}
        📸
        <input
          id="image-upload-input"
          type="file"
          accept="image/*"
          capture="environment" // Prioritizes back camera for mobile
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

export default ImageUpload; 