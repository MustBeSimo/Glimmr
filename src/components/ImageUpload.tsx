import { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/store';

export default function ImageUpload() {
  const { setMainImage } = useAppStore();
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.match('image.*')) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      setMainImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraClick = () => {
    // In a real implementation, this would open the device camera
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const clearImage = () => {
    setPreview(null);
    setMainImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      
      {!preview ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`relative aspect-[16/9] rounded-lg border-2 border-dashed ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          } flex items-center justify-center p-6 transition-all`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex flex-col items-center gap-4">
            <p className="text-lg font-medium text-gray-700">
              Drag & drop an image here
            </p>
            <div className="flex gap-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="soft-squeeze flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-white shadow-md hover:bg-blue-600"
                onClick={handleUploadClick}
              >
                <Upload size={18} />
                <span>Upload</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="soft-squeeze flex items-center gap-2 rounded-full bg-purple-500 px-4 py-2 text-white shadow-md hover:bg-purple-600"
                onClick={handleCameraClick}
              >
                <Camera size={18} />
                <span>Camera</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
          <motion.img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
          <motion.button
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1"
            onClick={clearImage}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={20} />
          </motion.button>
        </div>
      )}
    </div>
  );
} 