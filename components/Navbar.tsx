import React, { useState } from 'react';
import { Menu, X, Droplet, User, Activity, LogOut, Shield } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  const NavItem = ({ to, icon: Icon, label, onClick }: { to: string; icon: any; label: string; onClick?: () => void }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => {
            setIsOpen(false);
            if(onClick) onClick();
        }}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
          isActive ? 'bg-brand-red text-white' : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-brand-red p-1.5 rounded-full">
              <Droplet className="text-white" size={20} fill="currentColor" />
            </div>
            <span className="text-xl font-bold text-brand-dark">BloodReach</span>
          </Link>

          {/* Hamburger */}
          <button 
            onClick={toggleMenu} 
            className="p-2 rounded-md text-slate-600 hover:bg-slate-100 focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-lg border-b border-slate-100 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col p-4 space-y-2">
            <NavItem to="/" icon={Droplet} label="নীড়পাতা (Home)" />
            
            {user && !isAdmin && (
               <NavItem to="/dashboard" icon={User} label="প্রোফাইল (Profile)" />
            )}
            
            {isAdmin && (
                <NavItem to="/admin" icon={Shield} label="অ্যাডমিন প্যানেল (Admin)" />
            )}

            <NavItem to="/health-tips" icon={Activity} label="স্বাস্থ্য পরামর্শ (Health Tips)" />
            
            <div className="pt-4 border-t border-slate-100 space-y-3">
              {user ? (
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                    <LogOut size={20} />
                    <span className="font-medium">লগআউট</span>
                </button>
              ) : (
                <div className="space-y-2">
                    <Link 
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="block w-full text-center border border-brand-red text-brand-red font-bold py-3 rounded-lg hover:bg-red-50 transition"
                    >
                        লগইন
                    </Link>
                    <Link 
                        to="/register" 
                        onClick={() => setIsOpen(false)}
                        className="block w-full text-center bg-brand-red text-white font-bold py-3 rounded-lg shadow-md hover:bg-red-700 transition"
                    >
                        রক্তদাতা হোন
                    </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};