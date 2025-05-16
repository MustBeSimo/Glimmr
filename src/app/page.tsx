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
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Image Section */}
          <div className="flex-grow lg:w-2/3">
            <div className="bg-white rounded-lg shadow-lg p-6 aspect-video">
              <Suspense fallback={<div>Loading camera...</div>}>
                <ImageCapture />
              </Suspense>
              
              <Suspense fallback={<div>Loading editor...</div>}>
                <ImageEditor />
              </Suspense>
            </div>
          </div>

          {/* Right Side Sections */}
          <div className="lg:w-1/3 space-y-8">
            {/* GPT Image Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">GPT Image</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Describe what you want to change..."
                  className="w-full p-2 border rounded-lg"
                />
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  Generate Image
                </button>
              </div>
            </div>

            {/* Google Lens Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Suspense fallback={<div>Loading similar images...</div>}>
                <SimilarImages />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
