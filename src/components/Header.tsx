import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '@/store/store';

export default function Header() {
  const { user, isAuthenticated } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-md fixed top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <motion.div 
            className="font-bold text-2xl text-blue-600 flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <span className="bg-blue-600 text-white px-2 py-1 rounded mr-1">Image</span>
            <span>Max</span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
            Pricing
          </Link>
          <Link href="/gallery" className="text-gray-700 hover:text-blue-600 transition-colors">
            Gallery
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
            Contact
          </Link>
          
          {isAuthenticated && user ? (
            <motion.div 
              className="flex items-center bg-gray-100 rounded-full px-3 py-1.5 text-sm text-gray-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <User size={16} className="mr-2" />
              <span className="mr-2">{user.email}</span>
              <span className="bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                {user.credits} credits
              </span>
            </motion.div>
          ) : (
            <motion.button
              className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-full font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </motion.button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div 
        className="md:hidden"
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: mobileMenuOpen ? 'auto' : 0,
          opacity: mobileMenuOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        {mobileMenuOpen && (
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-4 border-t border-gray-100">
            <Link 
              href="/pricing" 
              className="text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/gallery" 
              className="text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            
            {isAuthenticated && user ? (
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5 text-sm text-gray-700">
                <User size={16} className="mr-2" />
                <span className="mr-2">{user.email}</span>
                <span className="bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                  {user.credits} credits
                </span>
              </div>
            ) : (
              <button className="w-full flex items-center justify-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-full font-medium">
                <LogIn size={16} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        )}
      </motion.div>
    </header>
  );
} 