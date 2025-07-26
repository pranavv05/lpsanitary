'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProductsPage() {
  // The complete list of your products.
  const products = [
    {
      id: 1,
      name: 'Premium Wall Hung Toilet',
      brand: 'Jaquar',
      category: 'Bathroom Fixtures',
      image: 'https://readdy.ai/api/search-image?query=Modern%20white%20ceramic%20wall%20hung%20toilet%20with%20sleek%20design%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20minimal%20design%2C%20premium%20sanitaryware%2C%20elegant%20bathroom%20fixture%2C%20high-end%20modern%20toilet%2C%20pristine%20white%20surfaces&width=300&height=300&seq=wall-hung-toilet&orientation=squarish'
    },
    {
      id: 2,
      name: 'Stainless Steel Kitchen Sink',
      brand: 'Roff',
      category: 'Kitchen Sinks',
      image: 'https://readdy.ai/api/search-image?query=Premium%20stainless%20steel%20kitchen%20sink%20with%20modern%20design%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20minimal%20design%2C%20high-end%20kitchen%20fixture%2C%20elegant%20metallic%20finish%2C%20pristine%20white%20surfaces&width=300&height=300&seq=kitchen-sink-steel&orientation=squarish'
    },
    {
      id: 3,
      name: 'Designer Basin Mixer',
      brand: 'Blues',
      category: 'Faucets & Taps',
      image: 'https://readdy.ai/api/search-image?query=Modern%20chrome%20basin%20mixer%20faucet%20with%20elegant%20design%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20minimal%20design%2C%20premium%20sanitaryware%2C%20elegant%20metallic%20finish%2C%20high-end%20bathroom%20fixture%2C%20pristine%20white%20surfaces&width=300&height=300&seq=basin-mixer&orientation=squarish'
    },
    {
      id: 4,
      name: 'Rainfall Shower Head',
      brand: 'Hindware',
      category: 'Shower Systems',
      image: 'https://readdy.ai/api/search-image?query=Modern%20rainfall%20shower%20head%20with%20chrome%20finish%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20minimal%20design%2C%20premium%20shower%20system%2C%20elegant%20fixtures%2C%20high-end%20bathroom%20interior%2C%20pristine%20white%20surfaces&width=300&height=300&seq=rainfall-shower&orientation=squarish'
    },
    {
      id: 5,
      name: 'Ceramic Pedestal Basin',
      brand: 'Kohler',
      category: 'Bathroom Fixtures',
      image: 'https://readdy.ai/api/search-image?query=White%20ceramic%20pedestal%20basin%20with%20modern%20design%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20minimal%20design%2C%20premium%20sanitaryware%2C%20elegant%20bathroom%20fixture%2C%20high-end%20modern%20basin%2C%20pristine%20white%20surfaces&width=300&height=300&seq=pedestal-basin&orientation=squarish'
    },
    {
      id: 6,
      name: 'Towel Bar Set',
      brand: 'Parryware',
      category: 'Bathroom Accessories',
      image: 'https://readdy.ai/api/search-image?query=Premium%20chrome%20towel%20bar%20set%20with%20modern%20design%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20minimal%20design%2C%20elegant%20bathroom%20accessories%2C%20high-end%20fixtures%2C%20pristine%20white%20surfaces&width=300&height=300&seq=towel-bar-set&orientation=squarish'
    },
    {
      id: 7,
      name: 'Marble Pattern Tiles',
      brand: 'Cera',
      category: 'Tiles & Flooring',
      image: 'https://readdy.ai/api/search-image?query=Premium%20marble%20pattern%20bathroom%20tiles%20with%20white%20and%20gray%20veining%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20minimal%20design%2C%20elegant%20flooring%2C%20high-end%20bathroom%20interior%2C%20pristine%20white%20surfaces&width=300&height=300&seq=marble-tiles&orientation=squarish'
    },
    {
      id: 8,
      name: 'Single Lever Kitchen Tap',
      brand: 'Roff',
      category: 'Faucets & Taps',
      image: 'https://readdy.ai/api/search-image?query=Modern%20single%20lever%20kitchen%20tap%20with%20chrome%20finish%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20minimal%20design%2C%20premium%20kitchen%20fixture%2C%20elegant%20metallic%20finish%2C%20pristine%20white%20surfaces&width=300&height=300&seq=kitchen-tap&orientation=squarish'
    },
    {
      id: 9,
      name: 'Corner Basin',
      brand: 'Jaquar',
      category: 'Bathroom Fixtures',
      image: 'https://readdy.ai/api/search-image?query=White%20ceramic%20corner%20basin%20with%20modern%20design%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20minimal%20design%2C%20premium%20sanitaryware%2C%20elegant%20bathroom%20fixture%2C%20high-end%20modern%20basin%2C%20pristine%20white%20surfaces&width=300&height=300&seq=corner-basin&orientation=squarish'
    },
    {
      id: 10,
      name: 'Shower Panel System',
      brand: 'Blues',
      category: 'Shower Systems',
      image: 'https://readdy.ai/api/search-image?query=Modern%20shower%20panel%20system%20with%20multiple%20jets%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20minimal%20design%2C%20premium%20shower%20system%2C%20elegant%20fixtures%2C%20high-end%20bathroom%20interior%2C%20pristine%20white%20surfaces&width=300&height=300&seq=shower-panel&orientation=squarish'
    },
    {
      id: 11,
      name: 'Soap Dispenser Set',
      brand: 'Hindware',
      category: 'Bathroom Accessories',
      image: 'https://readdy.ai/api/search-image?query=Premium%20soap%20dispenser%20set%20with%20chrome%20finish%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20minimal%20design%2C%20elegant%20bathroom%20accessories%2C%20high-end%20fixtures%2C%20pristine%20white%20surfaces&width=300&height=300&seq=soap-dispenser&orientation=squarish'
    },
    {
      id: 12,
      name: 'Double Bowl Kitchen Sink',
      brand: 'Kohler',
      category: 'Kitchen Sinks',
      image: 'https://readdy.ai/api/search-image?query=Premium%20double%20bowl%20kitchen%20sink%20with%20stainless%20steel%20finish%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20minimal%20design%2C%20high-end%20kitchen%20fixture%2C%20elegant%20metallic%20finish%2C%20pristine%20white%20surfaces&width=300&height=300&seq=double-bowl-sink&orientation=squarish'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Products</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Discover our extensive range of premium sanitaryware from the world's leading brands
            </p>
          </div>
        </div>
      </section>

      {/* --- FILTER SECTION REMOVED --- */}

      {/* Products Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Product Gallery
            </h2>
            <p className="text-lg text-gray-600">
              Explore some of our curated selection of high-quality sanitaryware
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* --- Mapped directly over the 'products' array --- */}
            {products.map((product, index) => (
              <div key={product.id} className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer overflow-hidden border border-purple-100 group animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
                <div className="h-64 bg-gradient-to-br from-purple-100 to-pink-100 relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 transition-all duration-300"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">{product.brand}</span>
                    <span className="text-sm text-gray-500">{product.category}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">{product.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl font-bold text-white mb-4">Need Help Choosing?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Our experts are here to help you find the perfect sanitaryware solutions for your project
            </p>
            <Link href="/contact" className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer whitespace-nowrap">
              Contact Our Experts
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}