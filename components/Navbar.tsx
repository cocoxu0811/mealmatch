import React from 'react';
import { UtensilsCrossed, LogOut } from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenCreate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isHome = location.pathname === '/';

  const navClass = (isActive: boolean) => 
    `font-semibold text-sm transition-all px-4 py-2 rounded-full ${isActive ? 'bg-[#FFD60A] text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100 ${isHome ? 'hidden sm:block' : 'hidden sm:block'}`}>
      <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo - Only visible on Home */}
        <div className={`flex items-center gap-3 cursor-pointer group ${!isHome ? 'invisible' : ''}`} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="w-10 h-10 bg-[#FFD60A] rounded-2xl flex items-center justify-center text-slate-900 shadow-lg shadow-[#FFD60A]/20 group-hover:rotate-12 transition-transform">
            <UtensilsCrossed size={20} />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-800">FanDa</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-2 bg-white/50 p-1 rounded-full border border-slate-100 shadow-sm">
          <NavLink to="/" className={({isActive}) => navClass(isActive)}>Home</NavLink>
          <NavLink to="/map" className={({isActive}) => navClass(isActive)}>Food Map</NavLink>
          <NavLink to="/chat" className={({isActive}) => navClass(isActive)}>Messages</NavLink>
          <NavLink to="/profile" className={({isActive}) => navClass(isActive)}>Profile</NavLink>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {user && (
            <>
              {isHome && (
                <button 
                  onClick={onOpenCreate}
                  className="hidden sm:flex items-center gap-2 bg-[#FFD60A] hover:bg-[#e5c009] text-slate-900 px-6 py-3 rounded-full font-bold transition-all active:scale-95 text-sm shadow-lg shadow-[#FFD60A]/20"
                >
                  <span>Start a Meal</span>
                </button>
              )}
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden ring-2 ring-white shadow-md">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};