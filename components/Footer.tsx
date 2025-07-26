
'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center mb-4 group">
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-pacifico group-hover:from-cyan-300 group-hover:to-purple-300 transition-all duration-300">L P Sanitary</span>
            </Link>
            <p className="text-gray-300 mb-4">
              Your trusted partner for premium sanitaryware solutions. We provide high-quality products from leading brands.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-all duration-300 transform hover:scale-110 cursor-pointer">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-facebook-fill"></i>
                </div>
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-all duration-300 transform hover:scale-110 cursor-pointer">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-instagram-fill"></i>
                </div>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-all duration-300 transform hover:scale-110 cursor-pointer">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-linkedin-fill"></i>
                </div>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-cyan-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-all duration-300 transform hover:translate-x-1">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-all duration-300 transform hover:translate-x-1">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-all duration-300 transform hover:translate-x-1">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-all duration-300 transform hover:translate-x-1">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-400">Our Brands</h3>
            <ul className="space-y-2">
              <li><span className="text-gray-300 hover:text-white transition-colors cursor-pointer">Roff</span></li>
              <li><span className="text-gray-300 hover:text-white transition-colors cursor-pointer">Jaquar</span></li>
              <li><span className="text-gray-300 hover:text-white transition-colors cursor-pointer">Blues</span></li>
              <li><span className="text-gray-300 hover:text-white transition-colors cursor-pointer">Hindware</span></li>
              <li><span className="text-gray-300 hover:text-white transition-colors cursor-pointer">Kohler</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-pink-400">Contact Info</h3>
            <div className="space-y-2">
              <div className="flex items-center group">
                <div className="w-5 h-5 flex items-center justify-center mr-3 text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  <i className="ri-map-pin-line"></i>
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors">shop no. 5,6 jc tower, chhatrapati shivaji raje chowk amli vapi, Silvassa - Vapi Rd, Silvassa, Dadra and Nagar Haveli and Daman and Diu 396230</span>
              </div>
              <div className="flex items-center group">
                <div className="w-5 h-5 flex items-center justify-center mr-3 text-purple-400 group-hover:text-purple-300 transition-colors">
                  <i className="ri-phone-line"></i>
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors">+91 9016430575 <br /> +91 9426877975 </span>
              </div>
              <div className="flex items-center group">
                <div className="w-5 h-5 flex items-center justify-center mr-3 text-pink-400 group-hover:text-pink-300 transition-colors">
                  <i className="ri-mail-line"></i>
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors">lpsanitary111@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 L P Sanitary. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}