// PublicLayout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-black">
      <Navbar />
      
      {/* Hero Background Decoration - Luxury Gold Accents */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#D4AF37]/30 rounded-full blur-3xl opacity-10"></div>
        </div>
        
        <main className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          <div className="animate-fade-in-up">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Footer - Luxury Dark */}
      <footer className="bg-black/60 backdrop-blur-md border-t border-[#D4AF37]/20 mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-400 text-sm tracking-wide">
            © 2024 <span className="text-[#D4AF37] font-semibold">RFIFISA</span>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;