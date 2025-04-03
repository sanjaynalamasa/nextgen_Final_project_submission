import React from 'react';
import { useState } from 'react';
import { Menu, X, Database } from 'lucide-react';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AuctionList from './pages/AuctionList';
import DatabaseViewer from './components/DatabaseViewer';

function App() {
  const [currentPage, setCurrentPage] = useState<'signin' | 'signup' | 'auctions' | 'database'>('signin');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">AuctionHub</h1>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage('signin')}
                className={`${currentPage === 'signin' ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600`}
              >
                Sign In
              </button>
              <button
                onClick={() => setCurrentPage('signup')}
                className={`${currentPage === 'signup' ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600`}
              >
                Sign Up
              </button>
              <button
                onClick={() => setCurrentPage('auctions')}
                className={`${currentPage === 'auctions' ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600`}
              >
                Auctions
              </button>
              <button
                onClick={() => setCurrentPage('database')}
                className={`${currentPage === 'database' ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 flex items-center gap-1`}
              >
                <Database className="h-4 w-4" />
                Database
              </button>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => {
                  setCurrentPage('signin');
                  setIsMobileMenuOpen(false);
                }}
                className={`${
                  currentPage === 'signin' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                } block px-3 py-2 rounded-md text-base font-medium w-full text-left`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setCurrentPage('signup');
                  setIsMobileMenuOpen(false);
                }}
                className={`${
                  currentPage === 'signup' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                } block px-3 py-2 rounded-md text-base font-medium w-full text-left`}
              >
                Sign Up
              </button>
              <button
                onClick={() => {
                  setCurrentPage('auctions');
                  setIsMobileMenuOpen(false);
                }}
                className={`${
                  currentPage === 'auctions' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                } block px-3 py-2 rounded-md text-base font-medium w-full text-left`}
              >
                Auctions
              </button>
              <button
                onClick={() => {
                  setCurrentPage('database');
                  setIsMobileMenuOpen(false);
                }}
                className={`${
                  currentPage === 'database' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                } block px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center gap-1`}
              >
                <Database className="h-4 w-4" />
                Database
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'signin' && <SignIn onSignIn={() => setCurrentPage('auctions')} />}
        {currentPage === 'signup' && <SignUp onSignUp={() => setCurrentPage('signin')} />}
        {currentPage === 'auctions' && <AuctionList />}
        {currentPage === 'database' && <DatabaseViewer />}
      </main>

      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About AuctionHub</h3>
              <p className="text-gray-600">
                Your trusted platform for online auctions. Discover unique items and bid with confidence.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setCurrentPage('auctions')} className="text-gray-600 hover:text-blue-600">
                    Browse Auctions
                  </button>
                </li>
                <li>
                  <button className="text-gray-600 hover:text-blue-600">How It Works</button>
                </li>
                <li>
                  <button className="text-gray-600 hover:text-blue-600">FAQs</button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
              <p className="text-gray-600">
                Email: sanjay4nalamasa@gmail.com<br />
                Phone: +91 123 456 7890<br />
                Address: Warangal, India
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} AuctionHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;