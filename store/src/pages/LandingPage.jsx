import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '@google/model-viewer';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    { icon: 'bi-battery-full', title: 'Long Range', desc: 'Up to 400 miles per charge' },
    { icon: 'bi-lightning-charge', title: 'Instant Power', desc: '0-60 mph in 2.5 seconds' },
    { icon: 'bi-wifi', title: 'Over-the-Air', desc: 'Continuous improvements' },
    { icon: 'bi-shield-check', title: 'Safety First', desc: '5-star rating' },
  ];

  const specs = [
    { label: 'Top Speed', value: '200 mph' },
    { label: 'Acceleration', value: '0-60 in 2.5s' },
    { label: 'Range', value: '400+ miles' },
    { label: 'Charging', value: '15 min / 200 mi' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black">
      {/* Main Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Glass Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center min-h-screen py-12 lg:py-0">
            
            {/* Left Side - Text Content */}
            <div className={`flex-1 lg:pr-12 text-center lg:text-left transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {/* Logo / Brand */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
                <i className="bi bi-cpu text-white text-sm"></i>
                <span className="text-xs font-medium text-white tracking-wide">RFIFISA</span>
              </div>
              
              {/* Main Title */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
                Future of
                <span className="block text-gray-300">Electric Driving</span>
              </h1>
              
              {/* Description */}
              <p className="text-gray-400 text-lg max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
                Experience the perfect blend of luxury, performance, and sustainability. 
                Redefining what an electric vehicle can be.
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
                  className="px-8 py-3 bg-white text-zinc-900 rounded-full font-medium hover:bg-gray-100 transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-lg"
                >
                  <i className="bi bi-arrow-right"></i>
                  Explore Collection
                </Link>
                <button
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-medium hover:bg-white/20 transition-all duration-200 inline-flex items-center justify-center gap-2"
                >
                  <i className="bi bi-chevron-down"></i>
                  Learn More
                </button>
              </div>
            </div>
            
            {/* Right Side - 3D Model with Glass Effect */}
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
                
                {/* Model Hint - Glass */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-zinc-900/70 backdrop-blur-md rounded-full px-3 py-1 text-xs text-gray-300 flex items-center gap-1 border border-white/10">
                  <i className="bi bi-hand-index-thumb"></i>
                  <span>Drag to rotate • Scroll to zoom</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Glass Cards */}
      <section id="features" className="py-20 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1 mb-4 border border-white/20">
              <i className="bi bi-stars text-gray-300 text-xs"></i>
              <span className="text-xs font-medium text-gray-300 tracking-wide">Why Choose RFIFISA</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Engineered for Excellence
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Every detail crafted to deliver an unparalleled driving experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 border border-white/10"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 border border-white/20">
                  <i className={`${feature.icon} text-white text-xl`}></i>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Models Section */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1 mb-4 border border-white/20">
              <i className="bi bi-grid-3x3-gap-fill text-gray-300 text-xs"></i>
              <span className="text-xs font-medium text-gray-300 tracking-wide">The Collection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Choose Your Drive
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Three exceptional models, one extraordinary experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'RFIFISA S', price: '$89,990', range: '405 mi', speed: '200 mph', icon: 'bi-car-front' },
              { name: 'RFIFISA X', price: '$99,990', range: '348 mi', speed: '155 mph', icon: 'bi-car-front' },
              { name: 'RFIFISA 3', price: '$54,990', range: '358 mi', speed: '162 mph', icon: 'bi-car-front' },
            ].map((model, index) => (
              <div key={index} className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10 text-center">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-colors duration-300 border border-white/20">
                  <i className={`${model.icon} text-3xl text-gray-300 group-hover:text-white transition-colors duration-300`}></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{model.name}</h3>
                <p className="text-2xl font-bold text-gray-200 mb-3">{model.price}</p>
                <div className="flex justify-center gap-4 text-sm text-gray-400 mb-4">
                  <span className="flex items-center gap-1"><i className="bi bi-battery-full"></i> {model.range}</span>
                  <span className="flex items-center gap-1"><i className="bi bi-speedometer2"></i> {model.speed}</span>
                </div>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-gray-300 font-medium text-sm hover:text-white hover:gap-3 transition-all duration-200"
                >
                  Configure <i className="bi bi-arrow-right text-xs"></i>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Test Drive CTA - Glass Effect */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-12 text-center border border-white/10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1 mb-6">
              <i className="bi bi-cup-straw text-gray-300 text-xs"></i>
              <span className="text-xs font-medium text-gray-300 tracking-wide">Zero Emissions • Pure Thrill</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Experience the Future Today
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              Book a test drive and feel the power of electric driving
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="px-8 py-3 bg-white text-zinc-900 rounded-full font-medium hover:bg-gray-100 transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-lg"
              >
                <i className="bi bi-calendar-check"></i>
                Schedule Test Drive
              </Link>
              <Link
                to="/register"
                className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-medium hover:bg-white/20 transition-all duration-200 inline-flex items-center justify-center gap-2"
              >
                <i className="bi bi-download"></i>
                Download Brochure
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <i className="bi bi-cpu text-gray-400"></i>
              <span className="text-sm font-medium text-gray-400">RFIFISA</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Support</a>
            </div>
            <p className="text-xs text-gray-500">© 2025 RFIFISA. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        model-viewer {
          --poster-color: transparent;
        }
        
        @keyframes ping-ring {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        .animate-ping-ring {
          animation: ping-ring 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;