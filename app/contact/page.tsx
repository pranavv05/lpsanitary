"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Get in touch with our experts for personalized sanitaryware
              solutions and competitive quotes
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="text-center animate-fade-in-up group">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full mx-auto mb-4 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12">
                <i className="ri-map-pin-line text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                Visit Our Showroom
              </h3>
              <p className="text-gray-600">
                shop no. 5,6 jc tower, chhatrapati shivaji raje chowk amli vapi,
                Silvassa - Vapi Rd, Silvassa, Dadra and Nagar Haveli and Daman
                and Diu 396230
              </p>
            </div>

            <div className="text-center animate-fade-in-up group delay-300">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full mx-auto mb-4 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12">
                <i className="ri-phone-line text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                Call Us
              </h3>
              <p className="text-gray-600">
                Phone: +91 9016430575
                <br />
                WhatsApp: +91 9426877975
              </p>
            </div>

            <div className="text-center animate-fade-in-up group delay-500">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full mx-auto mb-4 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12">
                <i className="ri-mail-line text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                Email Us
              </h3>
              <p className="text-gray-600">lpsanitary111@gmail.com</p>
            </div>
          </div>
        </div>
      </section>

            {/* Map */}
            <div className="animate-slide-in-right">
              <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-6">
  Find Us
</h2>
              <div className="h-96 bg-white/70 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3450.0620017632946!2d72.99620847486736!3d20.282041181186916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0cbc05abfc45b%3A0xce1020ccdbec346!2sL-P%20SANITARY%20-%20SOMANY%20TILES%20-%20Best%20Designs%20for%20Sanitaryware%2C%20Faucets%2C%20Wash%20Basin%2C%20Shower%20in%20Silvassa!5e1!3m2!1sen!2sin!4v1753459712466!5m2!1sen!2sin"
                  width="750"
                  height="500"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>



      {/* Business Hours */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Business Hours
            </h2>
            <p className="text-xl text-gray-600">
              Visit us during these hours for the best service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-cyan-50 to-blue-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Showroom Hours
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Saturday</span>
                  <span className="text-gray-900 font-medium">
                    9:00 AM - 8:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="text-gray-900 font-medium">
                    10:00 AM - 6:00 PM
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up delay-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Customer Support
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone Support</span>
                  <span className="text-gray-900 font-medium">
                    24/7 Available
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email Support</span>
                  <span className="text-gray-900 font-medium">
                    Within 24 hours
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
