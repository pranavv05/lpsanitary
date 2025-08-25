'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PDFViewerModal from '@/components/PDFViewerModal';
import { cloudCatalogs, CloudCatalog, getConfigStatus } from '@/config/cloudConfig';
import { runCloudinaryTest } from '@/utils/cloudinaryTest';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- CLOUD STORAGE SECTION ---
  // Now using cloud storage configuration for unlimited catalogs
  // Catalogs are loaded from cloud storage and viewed in modal
  const [selectedPDF, setSelectedPDF] = useState<CloudCatalog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get cloud storage configuration status
  const configStatus = getConfigStatus();
  
  // For backward compatibility, also support local files as fallback
  const localBrands = [
    { name: 'Roff', catalog: '/resources/Roff-Product-Catalogue.pdf', size: '2 MB' },
    { name: 'Jaquar', catalog: '/resources/JAQUAR_CATLOUGE.pdf', size: '60 MB', warning: true },
    { name: 'Blues', catalog: '/resources/Blues_Catalougeupdated.pdf', size: '76 MB', warning: true },
    { name: 'Nirali', catalog: '/resources/Nirali.pdf', size: '8 MB' },
    { name: 'Karoma', catalog: '/resources/karoma_product_brochure_01.pdf', size: '21 MB' },
    { name: 'Cera', catalog: '/resources/cera.pdf', size: '6 MB' },
    { name: 'Steellera', catalog: '/resources/brochure_steelera_2023-24.pdf', size: '32 MB', warning: true },
  ];
  
  // Use cloud catalogs if configured, otherwise fall back to local
  const brands = configStatus.status === 'configured' ? cloudCatalogs : localBrands;
  // --- END CLOUD STORAGE SECTION ---

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

  const viewCatalog = (brand: CloudCatalog | typeof localBrands[0]) => {
    console.log(`👁️ Viewing ${brand.name} catalog`);
    
    // Convert local brand format to CloudCatalog format if needed
    const catalogData: CloudCatalog = 'cloudUrl' in brand ? brand : {
      name: brand.name,
      filename: brand.catalog?.split('/').pop() || '',
      size: brand.size,
      cloudUrl: brand.catalog || '' // Use local path as fallback
    };
    
    setSelectedPDF(catalogData);
    setIsModalOpen(true);
    
    console.log(`✅ Opening ${catalogData.name} catalog in modal viewer`);
    console.log(`📁 PDF URL: ${catalogData.cloudUrl}`);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPDF(null);
  };
  
  const testCloudinarySetup = async () => {
    console.log('🔬 Testing Cloudinary configuration...');
    try {
      const results = await runCloudinaryTest();
      
      if (results && results.successfulTests === results.totalCatalogs) {
        alert(`🎉 Cloudinary Test Successful!\n\nAll ${results.totalCatalogs} catalogs are accessible from Cloudinary.\n\nYour setup is working perfectly!`);
      } else if (results) {
        alert(`⚠️ Cloudinary Test Results:\n\nSuccessful: ${results.successfulTests}/${results.totalCatalogs}\nFailed: ${results.failedTests.length}\n\nCheck the browser console for detailed error information.`);
      }
    } catch (error) {
      console.error('Test failed:', error);
      alert(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}\n\nCheck the browser console for more details.`);
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
                          
                          {/* Storage Provider Indicator */}
                          <div className="text-xs mb-2 flex items-center justify-center">
                            {'storage' in brand ? (
                              brand.storage === 'cloudinary' ? (
                                <div className="text-blue-600 flex items-center">
                                  <i className="ri-cloud-line mr-1"></i>
                                  Cloudinary
                                </div>
                              ) : brand.storage === 's3' ? (
                                <div className="text-orange-600 flex items-center">
                                  <i className="ri-database-line mr-1"></i>
                                  AWS S3
                                </div>
                              ) : brand.storage === 'github' ? (
                                <div className="text-purple-600 flex items-center">
                                  <i className="ri-github-line mr-1"></i>
                                  GitHub
                                </div>
                              ) : brand.storage === 'gdrive' ? (
                                <div className="text-green-600 flex items-center">
                                  <i className="ri-google-line mr-1"></i>
                                  Google Drive
                                </div>
                              ) : (
                                <div className="text-gray-600 flex items-center">
                                  <i className="ri-hard-drive-line mr-1"></i>
                                  Local
                                </div>
                              )
                            ) : (
                              configStatus.status === 'configured' ? (
                                <div className="text-green-600 flex items-center">
                                  <i className="ri-cloud-line mr-1"></i>
                                  Cloud Storage
                                </div>
                              ) : (
                                <div className="text-amber-600 flex items-center">
                                  <i className="ri-hard-drive-line mr-1"></i>
                                  Local Files
                                </div>
                              )
                            )}
                          </div>
                          
                          {/* File Size Indicator */}
                          <div className="text-xs text-gray-500 mb-4">
                            {'size' in brand ? brand.size : 'Loading...'}
                            {('warning' in brand && brand.warning) && (
                              <span className="text-amber-600 ml-1" title="Large file">
                                <i className="ri-information-line"></i>
                              </span>
                            )}
                          </div>
                          
                          {/* View Catalog Button */}
                          <div className="space-y-2">
                            <button 
                              className="w-full flex items-center justify-center text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 py-3 px-4 rounded-lg font-medium shadow-lg hover:shadow-xl"
                              onClick={() => viewCatalog(brand)}
                            >
                              <div className="w-5 h-5 flex items-center justify-center mr-2">
                                <i className="ri-eye-line"></i>
                              </div>
                              <span>View Catalog</span>
                            </button>
                            
                            {/* Quick Preview Button - Small */}
                            <button 
                              className="w-full text-xs text-gray-600 hover:text-purple-600 transition-colors py-1"
                              onClick={() => {
                                const url = 'cloudUrl' in brand ? brand.cloudUrl : brand.catalog;
                                const fullUrl = url?.startsWith('http') ? url : `${window.location.origin}${url}`;
                                console.log(`🔍 Opening ${brand.name} in new tab: ${fullUrl}`);
                                window.open(fullUrl, '_blank');
                              }}
                              title="Open PDF in new tab"
                            >
                              <i className="ri-external-link-line mr-1"></i>
                              Open in New Tab
                            </button>
                            
                            {/* Debug button - only show for first brand to avoid clutter */}
                            {index === 0 && configStatus.status !== 'configured' && (
                              <button 
                                className="w-full text-xs text-amber-600 hover:text-amber-700 transition-colors py-1 mt-1"
                                onClick={() => {
                                  const debugUrl = '/api/debug';
                                  console.log(`🔍 Opening debug info: ${window.location.origin}${debugUrl}`);
                                  window.open(debugUrl, '_blank');
                                }}
                                title="Debug file paths in production"
                              >
                                <i className="ri-bug-line mr-1"></i>
                                Debug Info
                              </button>
                            )}
                          </div>
                          
                          <p className="text-xs text-gray-500 mt-2">
                            {configStatus.status === 'configured' 
                              ? 'Click to view PDF instantly in modal viewer' 
                              : 'Click to view PDF (local files)'
                            }
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
      
      {/* PDF Viewer Modal */}
      {selectedPDF && (
        <PDFViewerModal
          isOpen={isModalOpen}
          onClose={closeModal}
          pdfUrl={selectedPDF.cloudUrl}
          brandName={selectedPDF.name}
          fileSize={selectedPDF.size}
          filename={selectedPDF.filename}
        />
      )}
      
      {/* Hybrid Storage Configuration Notification */}
      {configStatus.status === 'needs-setup' && (
        <div className="fixed bottom-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg max-w-sm z-40">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <i className="ri-cloud-line text-blue-600 text-xl"></i>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-800 mb-1">
                Setup Hybrid Storage
              </h4>
              <p className="text-xs text-blue-700 mb-2">
                {configStatus.message}
              </p>
              <p className="text-xs text-blue-600 mb-3">
                Small files → Cloudinary (free) • Large files → AWS S3
              </p>
              <div className="space-y-2">
                <button 
                  onClick={() => {
                    window.open('/HYBRID_STORAGE_SETUP.md', '_blank');
                  }}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors w-full"
                >
                  📝 Setup Guide
                </button>
                <div className="grid grid-cols-2 gap-1">
                  <button 
                    onClick={() => {
                      window.open('https://cloudinary.com/users/register/free', '_blank');
                    }}
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                  >
                    ☁️ Cloudinary
                  </button>
                  <button 
                    onClick={() => {
                      window.open('https://aws.amazon.com/s3/', '_blank');
                    }}
                    className="text-xs bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600 transition-colors"
                  >
                    🌍 AWS S3
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Hybrid Storage Active Notification */}
      {configStatus.status === 'configured' && (
        <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg max-w-sm z-40">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <i className="ri-cloud-check-line text-green-600 text-xl"></i>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-green-800 mb-1">
                Hybrid Storage Active
              </h4>
              <p className="text-xs text-green-700 mb-2">
                Small files: Cloudinary • Large files: S3
              </p>
              <button 
                onClick={testCloudinarySetup}
                className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors w-full"
              >
                🗺 Test All URLs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}