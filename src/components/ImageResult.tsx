import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Eye, EyeOff } from 'lucide-react';
import { useAppStore } from '@/store/store';

export default function ImageResult() {
  const { generatedImage, similarImage } = useAppStore();
  const [isHoveringGenerated, setIsHoveringGenerated] = useState(false);
  const [isHoveringSimilar, setIsHoveringSimilar] = useState(false);

  const downloadImage = (imageUrl: string | null, fileName: string) => {
    if (!imageUrl) return;
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Generated Image */}
      <AnimatePresence>
        {generatedImage && (
          <motion.div
            className="relative aspect-[16/9] rounded-lg overflow-hidden shadow-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            onMouseEnter={() => setIsHoveringGenerated(true)}
            onMouseLeave={() => setIsHoveringGenerated(false)}
          >
            <img 
              src={generatedImage} 
              alt="Generated" 
              className="w-full h-full object-cover"
            />
            <AnimatePresence>
              {isHoveringGenerated && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"
                >
                  <motion.button
                    className="rounded-full bg-white p-3 shadow-lg text-blue-600"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => downloadImage(generatedImage, 'imagemax-generated.jpg')}
                  >
                    <Download size={24} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="absolute top-2 left-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Generated
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Similar Image */}
      <AnimatePresence>
        {similarImage && (
          <motion.div
            className="relative aspect-[16/9] rounded-lg overflow-hidden shadow-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', bounce: 0.3, delay: 0.1 }}
            onMouseEnter={() => setIsHoveringSimilar(true)}
            onMouseLeave={() => setIsHoveringSimilar(false)}
          >
            <img 
              src={similarImage} 
              alt="Similar" 
              className="w-full h-full object-cover"
            />
            <AnimatePresence>
              {isHoveringSimilar && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"
                >
                  <motion.button
                    className="rounded-full bg-white p-3 shadow-lg text-green-600"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => downloadImage(similarImage, 'imagemax-similar.jpg')}
                  >
                    <Download size={24} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Similar
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Compare Button - shows when both images are present */}
      {generatedImage && similarImage && (
        <motion.div
          className="absolute z-10 bottom-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <motion.button
            className="rounded-full bg-white shadow-lg text-gray-800 px-4 py-2 flex items-center gap-2 border border-gray-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye size={18} />
            <span>Compare</span>
          </motion.button>
        </motion.div>
      )}
      
      {/* Empty state - show when no images are generated yet */}
      {!generatedImage && !similarImage && (
        <div className="col-span-1 md:col-span-2 h-48 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
          <p className="text-gray-500">Your generated images will appear here</p>
        </div>
      )}
    </div>
  );
} 