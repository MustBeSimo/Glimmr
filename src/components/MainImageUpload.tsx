'use client';

import { useState, useRef } from 'react';
import { Camera } from 'lucide-react';
import { useAppStore } from '@/store/store';

export default function MainImageUpload() {
  const { setMainImage } = useAppStore();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processImageFile(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setMainImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Handle camera stream
      // You can implement the camera UI here
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Upload or Capture Image</h2>
      
      <div 
        className={`flex-1 flex flex-col items-center justify-center border border-dashed ${
          isDragging ? 'border-blue-400' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p className="text-sm text-gray-600 mb-4">Drag & drop an image here or use the buttons below</p>
        
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-sm px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            Upload
          </button>
          
          <button
            onClick={openCamera}
            className="text-sm flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            <Camera size={16} />
            Camera
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <p className="text-xs text-gray-400 mt-4">
          Choose File <span className="text-gray-300 mx-1">|</span> no file selected
        </p>
      </div>
    </div>
  );
} 