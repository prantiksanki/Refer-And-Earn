// src/components/Navbar.jsx
import React, { useState } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { clearAuth } from '../utils/auth';

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isReferral = location.pathname === '/' || location.pathname.startsWith('/referral');
  const isProfile = location.pathname.startsWith('/profile');

  const handleLogout = async () => {
    try {
      // Call logout endpoint to clear the cookie on the server
      await fetch('http://localhost:5000/api/users/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear client-side auth data
      clearAuth();
      navigate("/");
    }
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">

        {/* Logo + Links */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg shadow-lg bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/50"></div>
            <span className="text-xl font-bold text-white">EarnHub</span>
          </div>

          <nav className="items-center hidden gap-8 md:flex">
            <Link to="/referral" className={isReferral ? 'font-semibold border-b-2 text-emerald-400 border-emerald-400' : 'font-medium transition text-slate-300 hover:text-emerald-400'}>
              Refer & Earn
            </Link>
            <Link to="/profile" className={isProfile ? 'font-semibold border-b-2 text-emerald-400 border-emerald-400' : 'font-medium transition text-slate-300 hover:text-emerald-400'}>
              Profile
            </Link>
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 md:hidden text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Logout + Avatar */}
        <div className="items-center hidden gap-3 md:flex">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-2 font-semibold transition rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700"
          >
            <LogOut className="w-4 h-4" />
            LOG OUT
          </button>

          <div className="w-10 h-10 rounded-full shadow-lg bg-gradient-to-br from-emerald-400 to-cyan-500"></div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="border-t md:hidden border-slate-800 bg-slate-900/95 backdrop-blur-sm">
          <nav className="flex flex-col gap-4 px-6 py-4">
            <Link
              to="/referral"
              onClick={closeMenu}
              className={isReferral ? 'font-semibold text-emerald-400 border-l-2 border-emerald-400 pl-3' : 'font-medium transition text-slate-300 hover:text-emerald-400 pl-3'}
            >
              Refer & Earn
            </Link>
            <Link
              to="/profile"
              onClick={closeMenu}
              className={isProfile ? 'font-semibold text-emerald-400 border-l-2 border-emerald-400 pl-3' : 'font-medium transition text-slate-300 hover:text-emerald-400 pl-3'}
            >
              Profile
            </Link>
            <button
              onClick={() => {
                handleLogout();
                closeMenu();
              }}
              className="flex items-center justify-start w-full gap-2 px-4 py-2 font-semibold transition rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700"
            >
              <LogOut className="w-4 h-4" />
              LOG OUT
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
