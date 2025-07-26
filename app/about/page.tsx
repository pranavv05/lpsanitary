
'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20sanitaryware%20showroom%20interior%20with%20elegant%20displays%2C%20premium%20bathroom%20fixtures%2C%20professional%20lighting%2C%20clean%20minimalist%20design%2C%20sophisticated%20retail%20environment%2C%20white%20and%20gray%20color%20palette%2C%20architectural%20photography%20style%2C%20high-end%20showroom%20atmosphere&width=1920&height=800&seq=about-hero&orientation=landscape')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/85 via-purple-600/85 to-pink-600/85"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About L P Sanitary</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Over 25 years of excellence in providing premium sanitaryware solutions to homes and businesses across India
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6">
                Founded in 1999, L P Sanitary has been a trusted name in the sanitaryware industry for over two decades. What started as a small family business has grown into one of India's leading retailers and wholesalers of premium bathroom and kitchen fixtures.
              </p>
              <p className="text-gray-600 mb-6">
                Our journey began with a simple vision: to make high-quality sanitaryware accessible to everyone. Today, we are proud to be the authorized dealers for some of the world's most prestigious brands including Roff, Jaquar, Blues, Hindware, and Kohler.
              </p>
              <p className="text-gray-600">
                We believe that every space deserves the finest fixtures, and we work tirelessly to ensure our customers have access to the latest designs and innovations in sanitaryware technology.
              </p>
            </div>
            <div className="h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl animate-slide-in-right overflow-hidden">
              <img 
                src="/durgesh.jpg"
                alt="Our Story"
                className="w-full h-full object-cover object-top rounded-xl transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-to-r from-cyan-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center animate-fade-in-up">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full mx-auto mb-6 transition-all duration-300 transform hover:scale-110 hover:rotate-12">
                <i className="ri-eye-line text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To be India's most trusted and preferred destination for premium sanitaryware solutions, setting new standards in quality, service, and customer satisfaction.
              </p>
            </div>
            <div className="text-center animate-fade-in-up delay-300">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full mx-auto mb-6 transition-all duration-300 transform hover:scale-110 hover:rotate-12">
                <i className="ri-target-line text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To provide our customers with the finest sanitaryware products and exceptional service, while building long-lasting relationships based on trust, quality, and reliability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: 'ri-award-line',
                title: 'Quality Excellence',
                description: 'We never compromise on quality and only offer products that meet the highest standards.',
                color: 'from-yellow-400 to-orange-500'
              },
              {
                icon: 'ri-customer-service-line',
                title: 'Customer First',
                description: 'Our customers are at the heart of everything we do, and their satisfaction is our priority.',
                color: 'from-blue-400 to-cyan-500'
              },
              {
                icon: 'ri-handshake-line',
                title: 'Integrity',
                description: 'We conduct business with honesty, transparency, and ethical practices.',
                color: 'from-purple-400 to-pink-500'
              },
              {
                icon: 'ri-lightbulb-line',
                title: 'Innovation',
                description: 'We embrace new technologies and trends to bring the latest solutions to our customers.',
                color: 'from-green-400 to-teal-500'
              },
              {
                icon: 'ri-team-line',
                title: 'Teamwork',
                description: 'We work together as a team to achieve common goals and deliver exceptional results.',
                color: 'from-red-400 to-rose-500'
              },
              {
                icon: 'ri-leaf-line',
                title: 'Sustainability',
                description: 'We are committed to environmental responsibility and sustainable business practices.',
                color: 'from-indigo-400 to-purple-500'
              }
            ].map((value, index) => (
              <div key={index} className="text-center animate-fade-in-up group" style={{animationDelay: `${index * 100}ms`}}>
                <div className={`w-16 h-16 flex items-center justify-center bg-gradient-to-r ${value.color} text-white rounded-full mx-auto mb-4 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12`}>
                  <i className={`${value.icon} text-2xl`}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Achievements */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-4">Our Achievements</h2>
            <p className="text-xl text-gray-600">Milestones that mark our journey of excellence</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                number: '25+',
                label: 'Years of Experience',
                description: 'Serving customers since 1999',
                color: 'from-yellow-400 to-orange-500'
              },
              {
                number: '50,000+',
                label: 'Happy Customers',
                description: 'Satisfied customers across India',
                color: 'from-blue-400 to-cyan-500'
              },
              {
                number: '15+',
                label: 'Premium Brands',
                description: 'Authorized dealer partnerships',
                color: 'from-purple-400 to-pink-500'
              },
              {
                number: '99.5%',
                label: 'Customer Satisfaction',
                description: 'Based on customer feedback',
                color: 'from-green-400 to-teal-500'
              }
            ].map((achievement, index) => (
              <div key={index} className="text-center animate-fade-in-up group" style={{animationDelay: `${index * 100}ms`}}>
                <div className={`text-4xl font-bold bg-gradient-to-r ${achievement.color} bg-clip-text text-transparent mb-2 transition-all duration-300 transform group-hover:scale-110`}>{achievement.number}</div>
                <div className="text-lg font-semibold text-gray-700 mb-1">{achievement.label}</div>
                <div className="text-gray-600 text-sm">{achievement.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl font-bold mb-4">Ready to Work with Us?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Experience the L P Sanitary difference. Let us help you transform your space with premium sanitaryware solutions.
            </p>
            <Link href="/contact" className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer whitespace-nowrap">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}