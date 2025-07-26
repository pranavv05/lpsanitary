
'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-purple-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center group">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-pacifico group-hover:from-purple-700 group-hover:to-pink-700 transition-all duration-300">L P Sanitary</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-purple-600 font-medium transition-all duration-300 transform hover:scale-105 whitespace-nowrap relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-purple-600 font-medium transition-all duration-300 transform hover:scale-105 whitespace-nowrap relative group">
              Products
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-purple-600 font-medium transition-all duration-300 transform hover:scale-105 whitespace-nowrap relative group">
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-purple-600 font-medium transition-all duration-300 transform hover:scale-105 whitespace-nowrap relative group">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-purple-600 p-2 cursor-pointer transition-all duration-300 transform hover:scale-110"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <i className={`${isMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-xl transition-all duration-300`}></i>
              </div>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-purple-100 py-4 animate-fade-in-up">
            <div className="flex flex-col space-y-2">
              <Link href="/" className="text-gray-700 hover:text-purple-600 px-4 py-2 font-medium transition-all duration-300 transform hover:scale-105 rounded-lg hover:bg-purple-50">
                Home
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-purple-600 px-4 py-2 font-medium transition-all duration-300 transform hover:scale-105 rounded-lg hover:bg-purple-50">
                Products
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-purple-600 px-4 py-2 font-medium transition-all duration-300 transform hover:scale-105 rounded-lg hover:bg-purple-50">
                About Us
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-purple-600 px-4 py-2 font-medium transition-all duration-300 transform hover:scale-105 rounded-lg hover:bg-purple-50">
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}