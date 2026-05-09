import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navbar />
      
      {/* Hero Background Decoration */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gray-200 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-300 rounded-full blur-3xl"></div>
        </div>
        
        <main className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="animate-fade-in-up">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-100 mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 Your Store. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;