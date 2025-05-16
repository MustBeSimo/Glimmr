import React, { useState } from 'react';

interface GptEditSectionProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

const GptEditSection: React.FC<GptEditSectionProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
    }
  };

  return (
    <div className="bg-gray-700 p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">GPT Image Edit</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to change..."
          className="w-full p-2 rounded bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generating...' : 'Generate Image'}
        </button>
      </form>
    </div>
  );
};

export default GptEditSection; 