'use client';

import { Suspense } from 'react';
import MainImageUpload from '@/components/MainImageUpload';
import GPTImageEdit from '@/components/GPTImageEdit';
import GoogleLensResults from '@/components/GoogleLensResults';

export default function Home() {
  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-black">glimmr</h1>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Card - Main Image Upload/Camera */}
          <div className="lg:col-span-8 border border-gray-200 rounded-md overflow-hidden bg-white">
            <div className="p-4 h-[calc(100vh-10rem)]">
              <Suspense fallback={<div className="animate-pulse h-full bg-gray-100 rounded" />}>
                <MainImageUpload />
              </Suspense>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 flex flex-col gap-4 h-[calc(100vh-10rem)]">
            {/* Top Right - GPT Image Edit */}
            <div className="flex-1 border border-gray-200 rounded-md overflow-hidden bg-white">
              <div className="p-4 h-full">
                <Suspense fallback={<div className="animate-pulse h-full bg-gray-100 rounded" />}>
                  <GPTImageEdit />
                </Suspense>
              </div>
            </div>

            {/* Bottom Right - Google Lens Results */}
            <div className="flex-1 border border-gray-200 rounded-md overflow-hidden bg-white">
              <div className="p-4 h-full">
                <Suspense fallback={<div className="animate-pulse h-full bg-gray-100 rounded" />}>
                  <GoogleLensResults />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
