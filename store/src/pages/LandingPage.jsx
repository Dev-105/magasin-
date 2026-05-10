import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '@google/model-viewer';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    { icon: 'bi-battery-full', title: 'Extended Range', desc: 'Up to 400 miles on a single charge' },
    { icon: 'bi-lightning-charge', title: 'Performance', desc: '0-60 mph in just 2.5 seconds' },
    { icon: 'bi-shield-check', title: 'Premium Safety', desc: '5-star Euro NCAP rating' },
    { icon: 'bi-headset', title: '24/7 Support', desc: 'Dedicated customer service' },
  ];

  const specs = [
    { label: 'Top Speed', value: '200 mph' },
    { label: 'Acceleration', value: '0-60 in 2.5s' },
    { label: 'Range', value: '400+ miles' },
    { label: 'Warranty', value: '8 years / 100k mi' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Main Hero Section - Zinc Gradient */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800">
        {/* Glass Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center min-h-screen py-12 lg:py-0">
            
            {/* Left Side - Text Content */}
            <div className={`flex-1 lg:pr-12 text-center lg:text-left transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {/* Logo / Brand */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
                <i className="bi bi-car-front text-white text-sm"></i>
                <span className="text-xs font-medium text-white tracking-wide">RFIFISA MOTORS</span>
              </div>
              
              {/* Main Title */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
                Find Your
                <span className="block text-gray-300">Perfect Ride</span>
              </h1>
              
              {/* Description */}
              <p className="text-gray-300 text-lg max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
                Discover luxury electric vehicles that redefine performance and style. 
                Experience the future of automotive excellence today.
              </p>
              
              {/* Specs Grid - Glass Effect */}
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0 mb-8">
                {specs.map((spec, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all duration-200">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">{spec.label}</p>
                    <p className="text-base font-semibold text-white">{spec.value}</p>
                  </div>
                ))}
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/products"
                  className="px-8 py-3 bg-red-700 text-white rounded-full font-medium hover:bg-red-800 transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-lg"
                >
                  <i className="bi bi-cart"></i>
                  Shop Now
                </Link>
                <button
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-medium hover:bg-white/20 transition-all duration-200 inline-flex items-center justify-center gap-2"
                >
                  <i className="bi bi-info-circle"></i>
                  Explore Models
                </button>
              </div>
              
              {/* Trust Badge */}
              <div className="mt-8 flex items-center gap-4 justify-center lg:justify-start text-xs text-gray-400">
                <span className="flex items-center gap-1"><i className="bi bi-truck"></i> Free Delivery</span>
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                <span className="flex items-center gap-1"><i className="bi bi-shield-check"></i> 2 Year Warranty</span>
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                <span className="flex items-center gap-1"><i className="bi bi-credit-card"></i> 0% Financing</span>
              </div>
            </div>
            
            {/* Right Side - 3D Model */}
            <div className={`flex-1 mt-12 lg:mt-0 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px]">
                {/* Glass Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-transparent rounded-full blur-3xl"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/20 rounded-full blur-2xl"></div>
                
                {/* 3D Model Viewer */}
                <model-viewer
                  src="/car.glb"
                  alt="RFIFISA Electric Car"
                  camera-controls
                  disable-zoom
                  min-field-of-view="45deg"
                  max-field-of-view="45deg"
                  exposure="1.2"
                  shadow-intensity="0.8"
                  skybox-intensity="0.3"
                  interaction-prompt="auto"
                  camera-orbit="0deg 75deg auto"
                  rotation-per-second="10deg"
                  style={{ width: '100%', height: '100%' }}
                  className="w-full h-full"
                ></model-viewer>
                
                {/* Model Hint */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-zinc-900/70 backdrop-blur-md rounded-full px-3 py-1 text-xs text-gray-300 flex items-center gap-1 border border-white/10">
                  <i className="bi bi-hand-index-thumb"></i>
                  <span>Rotate • Zoom • Inspect</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - White Cards */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 rounded-full px-4 py-1 mb-4">
              <i className="bi bi-star-fill text-red-600 text-xs"></i>
              <span className="text-xs font-medium text-red-700 tracking-wide">Why Buy From RFIFISA</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Premium Electric Vehicles
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Experience unmatched luxury, performance, and innovation
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="w-12 h-12 rounded-full bg-red-700 flex items-center justify-center mx-auto mb-4">
                  <i className={`${feature.icon} text-white text-xl`}></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Models Section - Available Cars */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 rounded-full px-4 py-1 mb-4">
              <i className="bi bi-grid-3x3-gap-fill text-red-600 text-xs"></i>
              <span className="text-xs font-medium text-red-700 tracking-wide">Available Models</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Choose Your Dream Car
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Three exceptional models designed for every lifestyle
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                name: 'RFIFISA S', 
                price: 'MAD 89,990', 
                range: '405 mi', 
                speed: '200 mph', 
                icon: 'bi-car-front',
                badge: 'Luxury Sedan',
                financing: 'MAD 1,299/mo'
              },
              { 
                name: 'RFIFISA X', 
                price: 'MAD 99,990', 
                range: '348 mi', 
                speed: '155 mph', 
                icon: 'bi-car-front',
                badge: 'Premium SUV',
                financing: 'MAD 1,449/mo'
              },
              { 
                name: 'RFIFISA 3', 
                price: 'MAD 54,990', 
                range: '358 mi', 
                speed: '162 mph', 
                icon: 'bi-car-front',
                badge: 'Sport Edition',
                financing: 'MAD 799/mo'
              },
            ].map((model, index) => (
              <div key={index} className="group bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 text-center">
                <div className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium mb-3">
                  {model.badge}
                </div>
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-red-700 transition-colors duration-300">
                  <i className={`${model.icon} text-3xl text-gray-600 group-hover:text-white transition-colors duration-300`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{model.name}</h3>
                <p className="text-2xl font-bold text-gray-800 mb-2">{model.price}</p>
                <p className="text-xs text-gray-500 mb-3">or {model.financing}</p>
                <div className="flex justify-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><i className="bi bi-battery-full"></i> {model.range}</span>
                  <span className="flex items-center gap-1"><i className="bi bi-speedometer2"></i> {model.speed}</span>
                </div>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded-xl font-medium text-sm transition-all duration-200"
                >
                  <i className="bi bi-eye"></i>
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financing Offer Section - White with Red Accents */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-3xl p-12 text-center border border-red-200">
            <div className="inline-flex items-center gap-2 bg-red-200 rounded-full px-4 py-1 mb-6">
              <i className="bi bi-percent text-red-700 text-xs"></i>
              <span className="text-xs font-medium text-red-800 tracking-wide">Limited Time Offer</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Drive Your Dream Car Today
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              0% APR financing for 60 months + MAD 2,000 bonus trade-in credit
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="px-8 py-3 bg-red-700 text-white rounded-full font-medium hover:bg-red-800 transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-lg"
              >
                <i className="bi bi-calculator"></i>
                Calculate Payment
              </Link>
              <Link
                to="/register"
                className="px-8 py-3 bg-white text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-all duration-200 inline-flex items-center justify-center gap-2 border border-gray-300"
              >
                <i className="bi bi-chat-dots"></i>
                Chat With Specialist
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <i className="bi bi-car-front text-gray-400"></i>
              <span className="text-sm font-medium text-gray-400">RFIFISA MOTORS</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Contact Sales</a>
              <a href="#" className="hover:text-white transition-colors">Find a Dealer</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
              <a href="#" className="hover:text-white transition-colors">Financing</a>
            </div>
            <p className="text-xs text-gray-500">© 2025 RFIFISA MOTORS. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        model-viewer {
          --poster-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;