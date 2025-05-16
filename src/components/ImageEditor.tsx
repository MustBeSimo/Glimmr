'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/store';

export default function ImageEditor() {
  const { mainImage, editedImage, setEditedImage } = useAppStore();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = async () => {
    if (!mainImage || !prompt) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/edit-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: mainImage,
          prompt,
        }),
      });

      if (!response.ok) throw new Error('Failed to edit image');

      const data = await response.json();
      setEditedImage(data.editedImage);
    } catch (error) {
      console.error('Error editing image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mainImage) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Edit with AI</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
            Describe your changes
          </label>
          <input
            id="prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Make the background blue"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleEdit}
          disabled={isLoading || !prompt}
          className={`w-full px-4 py-2 rounded-md text-white transition-colors ${
            isLoading || !prompt
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isLoading ? 'Generating...' : 'Generate Edit'}
        </button>

        {editedImage && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Result</h3>
            <div className="aspect-[16/9] relative">
              <img
                src={editedImage}
                alt="Edited"
                className="w-full h-full object-contain rounded-lg"
              />
              <a
                href={editedImage}
                download="edited-image.jpg"
                className="absolute top-2 right-2 bg-white bg-opacity-90 p-2 rounded-full shadow-lg hover:bg-opacity-100 transition-opacity"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 