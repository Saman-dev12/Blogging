import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PenTool, User, LogOut, Home } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-gray-900">Medium</div>
          </Link>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <input
              type="text"
              placeholder="Search stories..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white"
            />
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/create"
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <PenTool size={20} />
                  <span className="hidden sm:inline">Write</span>
                </Link>
                
                <Link 
                  to="/profile"
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <User size={20} />
                  <span className="hidden sm:inline">{user?.username || 'Profile'}</span>
                </Link>

                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <LogOut size={20} />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 px-4 py-2"
                >
                  Sign in
                </Link>
                <Link 
                  to="/register"
                  className="bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
