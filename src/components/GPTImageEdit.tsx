'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/store';

export default function GPTImageEdit() {
  const { mainImage, setGeneratedImage } = useAppStore();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !mainImage || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/edit-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: mainImage,
          prompt: prompt.trim(),
        }),
      });

      if (!response.ok) throw new Error('Failed to generate image');
      
      const data = await response.json();
      setGeneratedImage(data.editedImage);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">GPT Image</h2>
      
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="relative flex-1">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to change..."
            className="w-full h-full p-2 text-sm border border-gray-300 resize-none"
            disabled={!mainImage || isLoading}
          />
          <button
            type="submit"
            disabled={!prompt.trim() || !mainImage || isLoading}
            className={`absolute right-2 bottom-2 ${
              prompt.trim() && mainImage && !isLoading
                ? 'text-blue-500'
                : 'text-gray-300 cursor-not-allowed'
            }`}
            aria-label="Submit"
          >
            <Sparkles size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </form>
    </div>
  );
} 