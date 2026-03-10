import React, { useState } from 'react';
import { EventCard } from '../components/EventCard';
import { CreateEventModal } from '../components/CreateEventModal';
import { EventDetailsModal } from '../components/EventDetailsModal';
import { DiningEvent, CUISINES, User } from '../types';
import { Search, Bell, Flame, Coffee, Utensils, Beer, Pizza, Menu } from 'lucide-react';

interface HomeProps {
  events: DiningEvent[];
  currentUser: User;
  onEventCreate: (data: any) => void;
  onJoinRequest: (eventId: string) => void;
  onProcessRequest: (eventId: string, requestId: string, approved: boolean) => void;
  onOpenCreate: () => void;
  followedUserIds: string[];
  onToggleFollow: (userId: string) => void;
}

const CUISINE_ICONS: Record<string, React.ReactNode> = {
  'Hot Pot': <Flame size={16} />,
  'BBQ': <Utensils size={16} />,
  'Cafe': <Coffee size={16} />,
  'Sushi': <Utensils size={16} />,
  'Italian': <Pizza size={16} />,
  'Chinese': <Utensils size={16} />,
  'Mexican': <Utensils size={16} />,
  'Indian': <Utensils size={16} />,
  'Thai': <Utensils size={16} />,
  'Burgers': <Utensils size={16} />,
  'Korean': <Utensils size={16} />,
  'Vietnamese': <Utensils size={16} />,
  'Vegetarian': <Utensils size={16} />,
  'Dessert': <Utensils size={16} />,
  'Bar': <Beer size={16} />,
  'Breakfast': <Coffee size={16} />,
  'Other': <Utensils size={16} />
};

export const Home: React.FC<HomeProps> = ({ 
  events, 
  currentUser,
  onEventCreate, 
  onJoinRequest,
  onProcessRequest,
  onOpenCreate,
  followedUserIds,
  onToggleFollow
}) => {
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<DiningEvent | null>(null);
  const [showMyEvents, setShowMyEvents] = useState(false);

  const filteredEvents = events.filter(event => {
    if (showMyEvents) {
      return event.host.id === currentUser.id || 
             event.participants.some(p => p.id === currentUser.id) ||
             event.requests.some(r => r.user.id === currentUser.id);
    }
    const matchesCuisine = selectedCuisine === 'All' || event.cuisine === selectedCuisine;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCuisine && matchesSearch;
  });

  return (
    <div className="space-y-4 animate-fade-in pb-24 min-h-screen">
      {/* Custom Header */}
      <div className="pt-[62px] h-[116px] px-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-[34px] h-[34px] bg-[#FFD60A] rounded-xl flex items-center justify-center text-slate-900 font-bold text-lg shadow-sm">
            M
          </div>
          <span className="font-serif font-bold text-xl text-slate-900">MealMatch</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-[34px] h-[34px] bg-white rounded-full flex items-center justify-center text-slate-900 hover:bg-slate-50 transition-colors shadow-sm">
            <Search size={18} />
          </button>
          <button 
            onClick={() => setShowMyEvents(!showMyEvents)}
            className={`w-[34px] h-[34px] rounded-full flex items-center justify-center transition-colors shadow-sm ${showMyEvents ? 'bg-[#FFD60A] text-slate-900' : 'bg-white text-slate-900 hover:bg-slate-50'}`}
          >
            <Utensils size={18} />
          </button>
          <div className="w-[34px] h-[34px] rounded-full overflow-hidden border-2 border-[#FFD60A] shadow-sm bg-[#FFD60A]">
             <img 
               src={currentUser.avatar} 
               alt="User" 
               className="w-full h-full object-cover"
             />
          </div>
        </div>
      </div>

      {/* Greeting */}
      <div className="px-5 pt-2">
        <h1 className="text-4xl font-serif font-bold text-slate-900 flex items-center gap-2">
          {showMyEvents ? 'My Events' : (
            <>Hi, {currentUser.name.split(' ')[0]} <span className="text-3xl">👋</span></>
          )}
        </h1>
      </div>

      {/* Cuisine Categories */}
      <div className={`flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-5 ${showMyEvents ? 'hidden' : ''}`}>
        <button 
          onClick={() => setSelectedCuisine('All')}
          className={`
            flex items-center gap-2 whitespace-nowrap px-6 py-3 rounded-full font-medium transition-all text-sm shadow-sm
            ${selectedCuisine === 'All' 
              ? 'bg-[#FFD60A] text-slate-900' 
              : 'bg-white text-slate-900 hover:bg-slate-50'}
          `}
        >
          All
        </button>
        {CUISINES.map(cuisine => (
          <button 
            key={cuisine}
            onClick={() => setSelectedCuisine(cuisine)}
            className={`
              flex items-center gap-2 whitespace-nowrap px-6 py-3 rounded-full font-medium transition-all text-sm shadow-sm
              ${selectedCuisine === cuisine 
                ? 'bg-[#FFD60A] text-slate-900' 
                : 'bg-white text-slate-900 hover:bg-slate-50'}
            `}
          >
            {CUISINE_ICONS[cuisine] || <Utensils size={16} />}
            {cuisine}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="px-5 space-y-4">
        {filteredEvents.map(event => (
          <EventCard 
            key={event.id} 
            event={event} 
            onClick={() => setSelectedEvent(event)}
          />
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12 px-5">
          <div className="inline-block p-4 rounded-full bg-white shadow-sm mb-4">
            <Search size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-serif font-bold text-slate-900">No meals found</h3>
          <p className="text-slate-700 mt-1 text-sm">Try changing your filters or start your own event!</p>
          <button 
            onClick={onOpenCreate}
            className="mt-6 px-6 py-3 bg-[#FFD60A] text-slate-900 rounded-full font-bold hover:bg-[#e5c009] transition-colors shadow-lg text-sm"
          >
            Host a Meal
          </button>
        </div>
      )}

      <EventDetailsModal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
        currentUser={currentUser}
        onJoinRequest={onJoinRequest}
        onProcessRequest={onProcessRequest}
        isFollowing={selectedEvent ? followedUserIds.includes(selectedEvent.host.id) : false}
        onToggleFollow={onToggleFollow}
      />
    </div>
  );
};