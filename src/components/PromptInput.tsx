import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/store';

export default function PromptInput() {
  const { prompt, setPrompt, mainImage, user, setGeneratedImage, setSimilarImage } = useAppStore();
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset focus state when mainImage changes
  useEffect(() => {
    setIsFocused(false);
  }, [mainImage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !mainImage) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // In a real implementation with auth, we'd use the actual user ID
      const userId = user?.id || 'demo-user';
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          prompt,
          imageBase64: mainImage,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }
      
      const data = await response.json();
      
      // Update the store with the generated images
      setGeneratedImage(data.generatedImage);
      setSimilarImage(data.similarImage);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error generating image:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <motion.form 
        onSubmit={handleSubmit}
        className="w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: mainImage ? 1 : 0, y: mainImage ? 0 : 20 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative">
          <motion.input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to change..."
            className={`w-full p-3 pr-12 rounded-lg border ${
              isFocused ? 'border-blue-500 flash-border' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={!mainImage || isSubmitting}
          />
          <motion.button
            type="submit"
            disabled={!prompt.trim() || !mainImage || isSubmitting}
            className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 ${
              prompt.trim() && mainImage && !isSubmitting
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            } transition-colors`}
            whileHover={prompt.trim() && mainImage && !isSubmitting ? { scale: 1.05 } : {}}
            whileTap={prompt.trim() && mainImage && !isSubmitting ? { scale: 0.95 } : {}}
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              >
                <Sparkles size={20} />
              </motion.div>
            ) : (
              <Sparkles size={20} />
            )}
          </motion.button>
        </div>
      </motion.form>
      
      {error && (
        <motion.div 
          className="mt-2 text-red-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.div>
      )}
    </>
  );
} 