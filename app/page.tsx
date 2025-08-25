'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- MODIFIED SECTION START ---
  // Updated the 'catalog' paths to point to your local files
  // in the public/resources/ directory.
  // Add file size information for user awareness
  const brandSizes = {
    'Blues': { size: '76 MB', warning: true },
    'Jaquar': { size: '60 MB', warning: true },
    'Steellera': { size: '32 MB', warning: true },
    'Karoma': { size: '21 MB', warning: false },
    'Nirali': { size: '8 MB', warning: false },
    'Cera': { size: '6 MB', warning: false },
    'Roff': { size: '2 MB', warning: false }
  } as const;

  const brands = [
    { name: 'Roff', catalog: '/resources/Roff-Product-Catalogue.pdf' },
    { name: 'Jaquar', catalog: '/resources/JAQUAR_CATLOUGE.pdf' },
    { name: 'Blues', catalog: '/resources/Blues_Catalougeupdated.pdf' },
    { name: 'Nirali', catalog: '/resources/Nirali.pdf' },
    { name: 'Karoma', catalog: '/resources/karoma_product_brochure_01.pdf' },
    { name: 'Cera', catalog: '/resources/cera.pdf' },
    { name: 'Steellera', catalog: '/resources/brochure_steelera_2023-24.pdf' },
    // { name: 'American Standard', catalog: '/resources/American-Standard.pdf' }
  ];
  // --- MODIFIED SECTION END ---

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(brands.length / 4));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(brands.length / 4)) % Math.ceil(brands.length / 4));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  const downloadCatalog = async (brand: { name: string; catalog: string }) => {
    console.log(`📥 Downloading ${brand.name} catalog`);
    console.log(`📁 PDF URL: ${brand.catalog}`);
    console.log(`🌐 Full URL: ${window.location.origin}${brand.catalog}`);
    
    try {
      // First, test if the PDF is accessible
      console.log(`🔍 Testing PDF accessibility for ${brand.name}...`);
      
      const response = await fetch(brand.catalog, { 
        method: 'HEAD',
        headers: {
          'Accept': 'application/pdf,*/*',
          'Cache-Control': 'no-cache'
        }
      });
      
      console.log(`📊 PDF Response Status: ${response.status}`);
      console.log(`📋 Content-Type: ${response.headers.get('content-type')}`);
      console.log(`💾 Content-Length: ${response.headers.get('content-length')}`);
      
      if (!response.ok) {
        throw new Error(`PDF not accessible (Status: ${response.status})`);
      }
      
      // Method 1: Try blob-based download for better integrity
      console.log(`📦 Downloading PDF as blob for ${brand.name}...`);
      
      const pdfResponse = await fetch(brand.catalog, {
        headers: {
          'Accept': 'application/pdf,*/*',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!pdfResponse.ok) {
        throw new Error(`Failed to download PDF (Status: ${pdfResponse.status})`);
      }
      
      const blob = await pdfResponse.blob();
      console.log(`✅ PDF blob created, size: ${blob.size} bytes`);
      
      // Verify blob is actually a PDF
      if (blob.type && !blob.type.includes('pdf')) {
        console.warn(`⚠️ Unexpected blob type: ${blob.type}`);
      }
      
      // Create blob URL and download
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${brand.name}-Catalog.pdf`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Add to page, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL after a delay
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
        console.log(`🗑️ Blob URL cleaned up for ${brand.name}`);
      }, 30000);
      
      console.log(`✅ Blob download initiated for ${brand.name}`);
      
      // Show user feedback with more information
      alert(`${brand.name} catalog download started!\n\nFile size: ${brandSizes[brand.name as keyof typeof brandSizes]?.size || 'Unknown'}\nDownloaded as: ${brand.name}-Catalog.pdf\n\nThe PDF will be saved to your Downloads folder.\n\nThis method should prevent file corruption.`);
      
    } catch (error) {
      console.error(`❌ Blob download failed for ${brand.name}:`, error);
      
      // Method 2: Fallback to direct download
      try {
        console.log(`🔄 Trying direct download fallback for ${brand.name}...`);
        
        const link = document.createElement('a');
        link.href = brand.catalog;
        link.download = `${brand.name}-Catalog.pdf`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log(`✅ Direct download attempted for ${brand.name}`);
        alert(`${brand.name} catalog download started (direct method).\n\nIf you get a "file damaged" error, try the "Test PDF URL" button below to open it in your browser first.`);
        
      } catch (directError) {
        console.error(`❌ Direct download also failed:`, directError);
        
        // Method 3: Try opening in new tab as fallback
        try {
          console.log(`🔄 Trying new tab fallback for ${brand.name}...`);
          const newWindow = window.open(brand.catalog, '_blank', 'noopener,noreferrer');
          
          if (newWindow && !newWindow.closed) {
            console.log(`✅ Opened ${brand.name} catalog in new tab`);
            alert(`Download failed, but ${brand.name} catalog opened in new tab.\n\nTo save: Right-click in the PDF and select "Save as" or use Ctrl+S (Cmd+S on Mac).`);
          } else {
            throw new Error('New tab blocked or failed');
          }
          
        } catch (fallbackError) {
          console.error(`❌ All methods failed:`, fallbackError);
          
          // Method 4: Provide direct URL as last resort
          const fullUrl = `${window.location.origin}${brand.catalog}`;
          console.log(`📄 Providing direct URL: ${fullUrl}`);
          
          alert(`Unable to download ${brand.name} catalog automatically.\n\nPlease try these solutions:\n\n1. Copy this direct link: ${fullUrl}\n2. Right-click the "Download Catalog" button and select "Save link as"\n3. Try the "Test PDF URL" button to open in browser\n4. Contact support if the issue persists\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`);
          
          // Copy URL to clipboard if possible
          try {
            await navigator.clipboard.writeText(fullUrl);
            console.log(`✅ URL copied to clipboard`);
          } catch (clipboardError) {
            console.log(`❌ Failed to copy to clipboard:`, clipboardError);
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20luxury%20bathroom%20interior%20with%20black%20marble%20surfaces%2C%20dark%20sophisticated%20design%2C%20premium%20sanitaryware%20fixtures%2C%20dramatic%20lighting%2C%20elegant%20black%20and%20gray%20color%20palette%2C%20professional%20photography%2C%20high-end%20residential%20bathroom%2C%20black%20stone%20textures%2C%20architectural%20photography%20style%2C%20dark%20minimalist%20aesthetic&width=1920&height=1080&seq=hero-bathroom-black&orientation=landscape')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-bounce-in">
              Premium
              <span className="block text-white animate-pulse">Sanitaryware</span>
              <span className="block text-white">Solutions</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto animate-fade-in-up delay-300">
              Discover luxury bathroom fixtures and accessories from the world's leading brands. Transform your space with our premium sanitaryware collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-500">
              <Link href="/products" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-full font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer whitespace-nowrap">
                Explore Products
              </Link>
              <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300 transform hover:scale-105 cursor-pointer whitespace-nowrap">
                Get Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="py-20 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">Trusted Partner Brands</h2>
            <p className="text-xl text-gray-600">We work with industry leaders to bring you the finest sanitaryware</p>
          </div>

          <div className="relative">
            {/* Slider Container */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: Math.ceil(brands.length / 4) }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      {brands.slice(slideIndex * 4, slideIndex * 4 + 4).map((brand, index) => (
                        <div 
                          key={index}
                          className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 animate-fade-in-up group"
                          style={{animationDelay: `${index * 100}ms`}}
                        >
                          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                            {brand.name}
                          </div>
                          <div className="text-gray-600 mb-1">Premium Quality</div>
                          
                          {/* File Size Indicator */}
                          <div className="text-xs text-gray-500 mb-4">
                            {brandSizes[brand.name as keyof typeof brandSizes]?.size || 'Loading...'}
                            {brandSizes[brand.name as keyof typeof brandSizes]?.warning && (
                              <span className="text-amber-600 ml-1" title="Large file">
                                <i className="ri-information-line"></i>
                              </span>
                            )}
                          </div>
                          
                          {/* Simple Download Button */}
                          <div className="space-y-2">
                            <button 
                              className="w-full flex items-center justify-center text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-300 py-3 px-4 rounded-lg font-medium shadow-lg hover:shadow-xl"
                              onClick={() => downloadCatalog(brand)}
                            >
                              <div className="w-5 h-5 flex items-center justify-center mr-2">
                                <i className="ri-download-cloud-line"></i>
                              </div>
                              <span>Download Catalog</span>
                            </button>
                            
                            {/* Test URL Button - Small */}
                            <button 
                              className="w-full text-xs text-gray-600 hover:text-blue-600 transition-colors py-1"
                              onClick={() => {
                                const fullUrl = `${window.location.origin}${brand.catalog}`;
                                console.log(`🔍 Testing ${brand.name} PDF URL: ${fullUrl}`);
                                window.open(fullUrl, '_blank');
                              }}
                              title="Test PDF URL in new tab"
                            >
                              <i className="ri-external-link-line mr-1"></i>
                              Test PDF URL
                            </button>
                          </div>
                          
                          <p className="text-xs text-gray-500 mt-2">
                            Click to download PDF to your device
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer z-10"
              >
                <div className="w-6 h-6 flex items-center justify-center text-purple-600">
                  <i className="ri-arrow-left-line text-xl"></i>
                </div>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer z-10"
              >
                <div className="w-6 h-6 flex items-center justify-center text-purple-600">
                  <i className="ri-arrow-right-line text-xl"></i>
                </div>
              </button>

              {/* Slide Indicators */}
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: Math.ceil(brands.length / 4) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                      index === currentSlide
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 scale-125'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20 bg-gradient-to-br from-cyan-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-4">Product Categories</h2>
            <p className="text-xl text-gray-600">Complete range of bathroom and kitchen solutions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Bathroom Fixtures',
                description: 'Premium toilets, basins, and bidets from leading manufacturers',
                image: 'https://readdy.ai/api/search-image?query=Modern%20white%20ceramic%20toilet%20and%20basin%20set%20in%20luxury%20bathroom%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20minimal%20design%2C%20premium%20sanitaryware%2C%20elegant%20fixtures%2C%20high-end%20bathroom%20interior%2C%20pristine%20white%20surfaces&width=400&height=300&seq=bathroom-fixtures&orientation=landscape',
                gradient: 'from-pink-500 to-rose-500'
              },
              {
                title: 'Kitchen Sinks',
                description: 'Durable and stylish kitchen sinks in various materials and designs',
                image: 'https://readdy.ai/api/search-image?query=Premium%20stainless%20steel%20kitchen%20sink%20with%20modern%20faucet%2C%20clean%20white%20kitchen%20background%2C%20professional%20product%20photography%2C%20minimal%20design%2C%20high-end%20kitchen%20fixture%2C%20elegant%20metallic%20finish%2C%20pristine%20white%20surfaces&width=400&height=300&seq=kitchen-sinks&orientation=landscape',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                title: 'Faucets & Taps',
                description: 'Designer faucets and taps with superior functionality and style',
                image: 'https://readdy.ai/api/search-image?query=Modern%20chrome%20bathroom%20faucet%20with%20sleek%20design%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20minimal%20design%2C%20premium%20sanitaryware%2C%20elegant%20metallic%20finish%2C%20high-end%20bathroom%20fixture%2C%20pristine%20white%20surfaces&width=400&height=300&seq=faucets-taps&orientation=landscape',
                gradient: 'from-purple-500 to-indigo-500'
              },
              {
                title: 'Shower Systems',
                description: 'Complete shower solutions including panels, heads, and accessories',
                image: 'https://readdy.ai/api/search-image?query=Modern%20rainfall%20shower%20head%20with%20chrome%20finish%2C%20clean%20white%20bathroom%20background%2C%20professional%20product%20photography%2C%20minimal%20design%2C%20premium%20shower%20system%2C%20elegant%20fixtures%2C%20high-end%20bathroom%20interior%2C%20pristine%20white%20surfaces&width=400&height=300&seq=shower-systems&orientation=landscape',
                gradient: 'from-green-500 to-teal-500'
              },
              {
                title: 'Bathroom Accessories',
                description: 'Complete your bathroom with our range of premium accessories',
                image: 'https://readdy.ai/api/search-image?query=Premium%20bathroom%20accessories%20set%20including%20towel%20bars%2C%20soap%20dispensers%2C%20and%20holders%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20minimal%20design%2C%20elegant%20chrome%20finish%2C%20high-end%20bathroom%20fixtures%2C%20pristine%20white%20surfaces&width=400&height=300&seq=bathroom-accessories&orientation=landscape',
                gradient: 'from-yellow-500 to-orange-500'
              },
              {
                title: 'Tiles & Flooring',
                description: 'Beautiful tiles and flooring solutions for modern bathrooms',
                image: 'https://readdy.ai/api/search-image?query=Modern%20bathroom%20tiles%20with%20marble%20pattern%2C%20clean%20white%20and%20gray%20design%2C%20professional%20product%20photography%2C%20minimal%20design%2C%20premium%20flooring%2C%20elegant%20surfaces%2C%20high-end%20bathroom%20interior%2C%20pristine%20white%20background&width=400&height=300&seq=tiles-flooring&orientation=landscape',
                gradient: 'from-red-500 to-pink-500'
              }
            ].map((category, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer overflow-hidden animate-fade-in-up group" style={{animationDelay: `${index * 150}ms`}}>
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">{category.title}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <Link href="/products" className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700 transition-colors">
                    View Products
                    <div className="w-4 h-4 flex items-center justify-center ml-2 transition-transform group-hover:translate-x-1">
                      <i className="ri-arrow-right-line"></i>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">Why Choose L P Sanitary</h2>
            <p className="text-xl text-gray-600">Your trusted partner for premium sanitaryware solutions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: 'ri-star-line',
                title: 'Premium Quality',
                description: 'We only deal with the finest brands and highest quality products in the industry',
                color: 'from-yellow-400 to-orange-500'
              },
              {
                icon: 'ri-truck-line',
                title: 'Fast Delivery',
                description: 'Quick and reliable delivery across India with careful packaging and handling',
                color: 'from-blue-400 to-cyan-500'
              },
              {
                icon: 'ri-customer-service-line',
                title: 'Expert Support',
                description: 'Our experienced team provides professional guidance and after-sales support',
                color: 'from-purple-400 to-pink-500'
              },
              {
                icon: 'ri-price-tag-line',
                title: 'Competitive Pricing',
                description: 'Best wholesale and retail prices with transparent quotations',
                color: 'from-green-400 to-teal-500'
              },
              {
                icon: 'ri-shield-check-line',
                title: 'Genuine Products',
                description: 'All products are 100% genuine with manufacturer warranties',
                color: 'from-red-400 to-rose-500'
              },
              {
                icon: 'ri-time-line',
                title: '25+ Years Experience',
                description: 'Over two decades of experience in the sanitaryware industry',
                color: 'from-indigo-400 to-purple-500'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center animate-fade-in-up group" style={{animationDelay: `${index * 100}ms`}}>
                <div className={`w-16 h-16 flex items-center justify-center bg-gradient-to-r ${feature.color} text-white rounded-full mx-auto mb-4 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12`}>
                  <i className={`${feature.icon} text-2xl`}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Space?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Get in touch with our experts for personalized recommendations and competitive quotes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer whitespace-nowrap">
                Get Quote Now
              </Link>
              <Link href="/products" className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300 transform hover:scale-105 cursor-pointer whitespace-nowrap">
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}