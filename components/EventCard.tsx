import React from 'react';
import { MapPin, Users, ArrowRight, X, Bookmark, ArrowUpRight } from 'lucide-react';
import { DiningEvent } from '../types';

interface EventCardProps {
  event: DiningEvent;
  onClick: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const isFull = event.spotsFilled >= event.spotsTotal;

  return (
    <div 
      onClick={onClick}
      className="w-full bg-white rounded-[2.5rem] p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
    >
      {/* Image Container */}
      <div className="relative w-full h-64 rounded-[2rem] overflow-hidden mb-4">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        
        {/* Top Right Badge (Rating/Status) */}
        <div className="absolute top-4 right-4 bg-[#FFD60A] px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
          <span className="text-slate-900 text-sm font-bold">★</span>
          <span className="text-slate-900 font-bold text-sm">4.9</span>
        </div>
      </div>

      {/* Bottom Content */}
      <div className="px-2 pb-2">
        {/* Title */}
        <h3 className="font-serif text-2xl text-slate-900 font-bold leading-tight mb-2">
          {event.title}
        </h3>

        {/* Info Row */}
        <div className="flex items-center text-slate-500 text-sm font-medium gap-2">
          <span>{new Intl.DateTimeFormat('en-US', { weekday: 'short', hour: 'numeric', minute: 'numeric' }).format(event.date)}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span>{event.price || '80€'}</span>
        </div>
      </div>
    </div>
  );
};