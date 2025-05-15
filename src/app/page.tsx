'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';
import PromptInput from '@/components/PromptInput';
import ImageResult from '@/components/ImageResult';
import { useAppStore } from '@/store/store';
import { useEffect, useState } from 'react';

export default function Home() {
  const { mainImage, generatedImage, similarImage } = useAppStore();
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Transform Your Images with AI
          </h1>
          <p className="text-xl text-gray-600">
            Upload an image, describe what you want to change,
            and let our AI do the magic.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Your Image</h2>
              <ImageUpload />
            </div>

            {mainImage && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">What do you want to change?</h2>
                <PromptInput />
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Results</h2>
              <ImageResult />
              
              {/* Credits info */}
              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-800 font-medium">
                  Each generation uses 1 credit
                </p>
                <div className="mt-2">
                  <button className="w-full bg-blue-600 text-white rounded-full py-2 text-sm font-medium hover:bg-blue-700 transition-colors">
                    Get More Credits
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Google Lens Integration */}
        {mainImage && (
          <motion.div 
            className="max-w-6xl mx-auto mt-12 bg-white rounded-xl shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-4">Find Similar Objects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-[16/9] bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Object detection preview</p>
              </div>
              <div className="flex flex-col">
                <p className="text-gray-600 mb-4">
                  Our Google Lens integration can help you find similar objects in your original image.
                </p>
                <button className="self-start bg-green-600 text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-green-700 transition-colors">
                  Identify Objects
                </button>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2023 ImageMax. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
