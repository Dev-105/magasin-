import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '@google/model-viewer';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const modelViewerRef = useRef(null);
  const [orbitIndex, setOrbitIndex] = useState(0);

  const cameraOrbits = [
    "90deg 90deg 15m",
    "90deg 100deg 15m",
    "90deg 90deg 15m"
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    // Start rotating the model every 3 seconds
    const interval = setInterval(() => {
      if (modelViewerRef.current) {
        const nextIndex = (orbitIndex + 1) % cameraOrbits.length;
        setOrbitIndex(nextIndex);
        modelViewerRef.current.cameraOrbit = cameraOrbits[nextIndex];
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orbitIndex]);

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
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-black">
      {/* Main Hero Section - Royal Dark Gold */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-[#0a0a0a] to-black">
        {/* Gold Glow Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 via-transparent to-black/40"></div>
        <div className="absolute top-20 -right-20 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-[#D4AF37]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center min-h-screen py-8 sm:py-12 lg:py-0">
            
            {/* Left Side - Text Content */}
            <div className={`flex-1 lg:pr-8 xl:pr-12 text-center lg:text-left transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {/* Logo / Brand - Gold */}
              <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full px-4 sm:px-5 py-1.5 sm:py-2 mb-5 sm:mb-6 md:mb-8 border border-[#D4AF37]/30 shadow-lg">
                <i className="bi bi-crown-fill text-[#D4AF37] text-xs sm:text-sm"></i>
                <span className="text-[10px] sm:text-xs font-bold text-[#D4AF37] tracking-wider">RFIFISA MOTORS</span>
              </div>
              
              {/* Main Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 tracking-tight">
                <span className="text-white">Find Your</span>
                <span className="block bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">Perfect Ride</span>
              </h1>
              
              {/* Description */}
              <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-lg mx-auto lg:mx-0 mb-6 sm:mb-8 leading-relaxed px-4 sm:px-0">
                Discover luxury electric vehicles that redefine performance and style. 
                Experience the future of automotive excellence today.
              </p>
              
              {/* Specs Grid - Gold Glass Effect */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto lg:mx-0 mb-6 sm:mb-8">
                {specs.map((spec, index) => (
                  <div key={index} className="bg-black/40 backdrop-blur-md border border-[#D4AF37]/20 rounded-xl p-2 sm:p-3 hover:border-[#D4AF37]/50 hover:bg-black/60 transition-all duration-300">
                    <p className="text-[10px] sm:text-xs text-[#D4AF37]/70 uppercase tracking-wide">{spec.label}</p>
                    <p className="text-sm sm:text-base font-bold text-white">{spec.value}</p>
                  </div>
                ))}
              </div>
              
              {/* CTA Buttons - Gold Royal */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link
                  to="/products"
                  className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black rounded-full font-bold hover:shadow-2xl hover:shadow-[#D4AF37]/50 transition-all duration-300 inline-flex items-center justify-center gap-2 transform hover:scale-105 min-h-[44px] text-sm sm:text-base"
                >
                  <i className="bi bi-crown-fill"></i>
                  Shop Now
                </Link>
                <button
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 bg-black/40 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] rounded-full font-medium hover:bg-black/60 hover:border-[#D4AF37] transition-all duration-300 inline-flex items-center justify-center gap-2 min-h-[44px] text-sm sm:text-base"
                >
                  <i className="bi bi-info-circle"></i>
                  Explore Models
                </button>
              </div>
              
              {/* Trust Badge - Gold */}
              <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4 justify-center lg:justify-start text-[10px] sm:text-xs text-[#D4AF37]/60">
                <span className="flex items-center gap-1"><i className="bi bi-truck text-xs sm:text-sm"></i> Free Delivery</span>
                <span className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#D4AF37]/30 rounded-full hidden xs:block"></span>
                <span className="flex items-center gap-1"><i className="bi bi-shield-check text-xs sm:text-sm"></i> 2 Year Warranty</span>
                <span className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#D4AF37]/30 rounded-full hidden sm:block"></span>
                <span className="flex items-center gap-1"><i className="bi bi-credit-card text-xs sm:text-sm"></i> 0% Financing</span>
              </div>
            </div>
            
            {/* Right Side - 3D Model - Visible on ALL devices with responsive sizing */}
            <div className={`flex-1 w-full mt-8 sm:mt-10 md:mt-12 lg:mt-0 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="relative w-full">
                {/* 3D Model Container - Fully Responsive Heights */}
                <div className="relative w-full h-[280px] xs:h-[320px] sm:h-[400px] md:h-[450px] lg:h-[500px] xl:h-[600px]">
                  {/* Gold Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 via-transparent to-transparent rounded-full blur-2xl sm:blur-3xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-black/40 rounded-full blur-xl sm:blur-2xl"></div>
                  
                  {/* 3D Model Viewer - Touch friendly for mobile */}
                  <model-viewer
                    ref={modelViewerRef}
                    src="/car.glb"
                    alt="RFIFISA Electric Car"
                    camera-controls
                    touch-action="pan-y"
                    interaction-prompt="auto"
                    interaction-prompt-threshold="0"
                    exposure="1.2"
                    shadow-intensity="0.8"
                    skybox-intensity="0.3"
                    disable-zoom
                    camera-orbit="90deg 90deg 15m"
                    rotation-per-second="0deg"
                    style={{ width: '100%', height: '100%' }}
                    className="w-full h-full"
                  ></model-viewer>
                  
                  {/* Auto-Rotate Indicator - Gold */}
                  <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 bg-black/60 backdrop-blur-md rounded-full px-2 sm:px-3 py-1 text-[8px] sm:text-[10px] text-[#D4AF37] flex items-center gap-1 border border-[#D4AF37]/30">
                    <i className="bi bi-arrow-repeat text-[8px] sm:text-[10px] animate-spin-slow"></i>
                    <span className="hidden xs:inline">Auto-rotate</span>
                  </div>
                  
                  {/* Model Hint - Gold - Responsive positioning */}
                  <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-md rounded-full px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-[8px] sm:text-xs md:text-xs text-[#D4AF37] flex items-center gap-1 sm:gap-2 border border-[#D4AF37]/30 whitespace-nowrap">
                    <i className="bi bi-hand-index-thumb text-[10px] sm:text-xs"></i>
                    <span className="hidden xs:inline">Drag to rotate • Auto-rotating</span>
                    <span className="xs:hidden">Touch • Rotate</span>
                  </div>
                  
                  {/* 3D Badge */}
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black/50 backdrop-blur-sm rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 text-[6px] sm:text-[8px] text-[#D4AF37]/60 border border-[#D4AF37]/20">
                    3D
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Dark Cards Gold */}
      <section id="features" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 backdrop-blur-md rounded-full px-4 sm:px-5 py-1.5 sm:py-2 mb-3 sm:mb-4 border border-[#D4AF37]/30">
              <i className="bi bi-star-fill text-[#D4AF37] text-[10px] sm:text-xs"></i>
              <span className="text-[10px] sm:text-xs font-bold text-[#D4AF37] tracking-wide">Why Buy From RFIFISA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">Premium Electric Vehicles</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto px-4">
              Experience unmatched luxury, performance, and innovation
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-black to-[#0a0a0a] rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center hover:shadow-2xl hover:shadow-[#D4AF37]/10 transition-all duration-500 hover:-translate-y-2 border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 group"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#FFD700]/20 flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <i className={`${feature.icon} text-[#D4AF37] text-xl sm:text-2xl`}></i>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-xs sm:text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Models Section - Luxury Car Cards */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-[#0a0a0a] to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 backdrop-blur-md rounded-full px-4 sm:px-5 py-1.5 sm:py-2 mb-3 sm:mb-4 border border-[#D4AF37]/30">
              <i className="bi bi-grid-3x3-gap-fill text-[#D4AF37] text-[10px] sm:text-xs"></i>
              <span className="text-[10px] sm:text-xs font-bold text-[#D4AF37] tracking-wide">Available Models</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">Choose Your Dream Car</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto px-4">
              Three exceptional models designed for every lifestyle
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { 
                name: 'RFIFISA S', 
                price: 'MAD 89,990', 
                range: '405 mi', 
                speed: '200 mph', 
                icon: 'bi-crown-fill',
                badge: 'Luxury Sedan',
                financing: 'MAD 1,299/mo'
              },
              { 
                name: 'RFIFISA X', 
                price: 'MAD 99,990', 
                range: '348 mi', 
                speed: '155 mph', 
                icon: 'bi-crown-fill',
                badge: 'Premium SUV',
                financing: 'MAD 1,449/mo'
              },
              { 
                name: 'RFIFISA 3', 
                price: 'MAD 54,990', 
                range: '358 mi', 
                speed: '162 mph', 
                icon: 'bi-crown-fill',
                badge: 'Sport Edition',
                financing: 'MAD 799/mo'
              },
            ].map((model, index) => (
              <div key={index} className="group bg-gradient-to-br from-black to-[#0a0a0a] rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-2xl hover:shadow-[#D4AF37]/20 transition-all duration-500 hover:-translate-y-2 border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 text-center">
                <div className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37]/20 to-[#FFD700]/20 text-[#D4AF37] text-[10px] sm:text-xs font-bold mb-2 sm:mb-3">
                  {model.badge}
                </div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#D4AF37]/10 to-[#FFD700]/10 flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:from-[#D4AF37]/20 group-hover:to-[#FFD700]/20 transition-all duration-300">
                  <i className={`${model.icon} text-2xl sm:text-3xl text-[#D4AF37] group-hover:scale-110 transition-transform duration-300`}></i>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{model.name}</h3>
                <p className="text-xl sm:text-2xl font-bold text-[#D4AF37] mb-1 sm:mb-2">{model.price}</p>
                <p className="text-[10px] sm:text-xs text-gray-400 mb-2 sm:mb-3">or {model.financing}</p>
                <div className="flex justify-center gap-3 sm:gap-4 text-[10px] sm:text-sm text-gray-400 mb-3 sm:mb-4">
                  <span className="flex items-center gap-1"><i className="bi bi-battery-full text-[#D4AF37] text-xs sm:text-sm"></i> {model.range}</span>
                  <span className="flex items-center gap-1"><i className="bi bi-speedometer2 text-[#D4AF37] text-xs sm:text-sm"></i> {model.speed}</span>
                </div>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/30 transform hover:scale-105 min-h-[40px] sm:min-h-[44px]"
                >
                  <i className="bi bi-eye"></i>
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financing Offer Section - Gold Glow */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#D4AF37]/10 via-[#D4AF37]/5 to-[#D4AF37]/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center border border-[#D4AF37]/30 shadow-2xl shadow-[#D4AF37]/10">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 backdrop-blur-md rounded-full px-4 sm:px-5 py-1.5 sm:py-2 mb-4 sm:mb-6 border border-[#D4AF37]/40">
              <i className="bi bi-percent text-[#D4AF37] text-[10px] sm:text-xs"></i>
              <span className="text-[10px] sm:text-xs font-bold text-[#D4AF37] tracking-wide">Limited Time Offer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">Drive Your Dream Car Today</span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto mb-4 sm:mb-6 px-4">
              0% APR financing for 60 months + MAD 2,000 bonus trade-in credit
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                to="/products"
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black rounded-full font-bold hover:shadow-2xl hover:shadow-[#D4AF37]/50 transition-all duration-300 inline-flex items-center justify-center gap-2 transform hover:scale-105 min-h-[44px] text-sm sm:text-base"
              >
                <i className="bi bi-calculator"></i>
                Calculate Payment
              </Link>
              <Link
                to="/register"
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-black/60 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] rounded-full font-medium hover:bg-black/80 hover:border-[#D4AF37] transition-all duration-300 inline-flex items-center justify-center gap-2 min-h-[44px] text-sm sm:text-base"
              >
                <i className="bi bi-chat-dots"></i>
                Chat With Specialist
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Royal Dark */}
      <footer className="py-6 sm:py-8 bg-black border-t border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <i className="bi bi-crown-fill text-[#D4AF37] text-sm sm:text-base"></i>
              <span className="text-xs sm:text-sm font-bold text-[#D4AF37] tracking-wide">RFIFISA MOTORS</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
              <a href="#" className="hover:text-[#D4AF37] transition-colors">Contact Sales</a>
              <a href="#" className="hover:text-[#D4AF37] transition-colors">Find a Dealer</a>
              <a href="#" className="hover:text-[#D4AF37] transition-colors">Support</a>
              <a href="#" className="hover:text-[#D4AF37] transition-colors">Financing</a>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500">© 2025 RFIFISA MOTORS. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        model-viewer {
          --poster-color: transparent;
        }
        
        /* Improve touch interaction on mobile */
        @media (max-width: 640px) {
          model-viewer {
            touch-action: pan-y pinch-zoom;
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;