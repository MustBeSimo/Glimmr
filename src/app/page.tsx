'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';
import PromptInput from '@/components/PromptInput';
import ImageResult from '@/components/ImageResult';
import { useAppStore } from '@/store/store';
import { useEffect, useState, Suspense } from 'react';
import ImageCapture from '@/components/ImageCapture';
import SimilarImages from '@/components/SimilarImages';
import ImageEditor from '@/components/ImageEditor';

export default function Home() {
  const { mainImage, generatedImage } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">glimmr</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Suspense fallback={<div>Loading camera...</div>}>
              <ImageCapture />
            </Suspense>
            
            <Suspense fallback={<div>Loading editor...</div>}>
              <ImageEditor />
            </Suspense>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <Suspense fallback={<div>Loading similar images...</div>}>
              <SimilarImages />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
