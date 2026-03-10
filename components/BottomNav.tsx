import React from 'react';
import { Home, MessageSquare, User, Map, Plus } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface BottomNavProps {
  onOpenCreate: () => void;
  unreadCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenCreate, unreadCount = 0 }) => {
  const navClass = (isActive: boolean) => 
    `flex items-center justify-center w-[50px] h-[50px] rounded-full transition-all duration-300 ${isActive ? 'bg-white text-slate-900' : 'text-white/60 hover:text-white hover:bg-white/10'}`;

  return (
    <div className="fixed bottom-[21px] left-1/2 -translate-x-1/2 bg-[#0F172A] rounded-full shadow-2xl px-2 sm:hidden z-50 flex items-center gap-2 backdrop-blur-md border border-white/10 h-[62px]">
      <NavLink to="/" className={({isActive}) => navClass(isActive)}>
        {({isActive}) => <Home size={22} strokeWidth={isActive ? 2.5 : 2} />}
      </NavLink>
      <NavLink to="/map" className={({isActive}) => navClass(isActive)}>
        {({isActive}) => <Map size={22} strokeWidth={isActive ? 2.5 : 2} />}
      </NavLink>
      
      {/* Central Add Button */}
      <button 
        onClick={onOpenCreate}
        className="w-[50px] h-[50px] bg-[#FFD60A] rounded-full flex items-center justify-center text-slate-900 shadow-lg active:scale-95 transition-transform mx-1"
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>

      <NavLink to="/chat" className={({isActive}) => navClass(isActive) + " relative"}>
        {({isActive}) => (
          <>
            <MessageSquare size={22} strokeWidth={isActive ? 2.5 : 2} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-[#0F172A]">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </>
        )}
      </NavLink>
      <NavLink to="/profile" className={({isActive}) => navClass(isActive)}>
        {({isActive}) => <User size={22} strokeWidth={isActive ? 2.5 : 2} />}
      </NavLink>
    </div>
  );
};