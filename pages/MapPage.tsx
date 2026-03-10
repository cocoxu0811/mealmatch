import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, Map as MapIcon, List, Star, Plus, Coffee, Utensils, Beer, Flame, Heart, Bookmark } from 'lucide-react';
import { AddSpotModal } from '../components/AddSpotModal';

interface Dish {
  name: string;
  image: string;
}

interface FoodSpot {
  id: number;
  name: string;
  type: string;
  rating: number;
  x: number;
  y: number;
  icon: React.ElementType;
  color: string;
  description: string;
  image?: string;
  price?: string;
  isOpen?: boolean;
  dishes?: Dish[];
}

const INITIAL_SPOTS: FoodSpot[] = [
  { 
    id: 1, name: "Pasta Bella", type: "Italian", rating: 4.8, x: 45, y: 40, 
    icon: Utensils, color: "bg-[#3B82F6]", description: "Authentic homemade pasta.",
    image: "https://picsum.photos/id/292/600/400",
    price: "$$",
    isOpen: true,
    dishes: [
      { name: "Carbonara", image: "https://picsum.photos/id/292/200/200" },
      { name: "Tiramisu", image: "https://picsum.photos/id/1060/200/200" },
      { name: "Lasagna", image: "https://picsum.photos/id/493/200/200" }
    ]
  },
  { 
    id: 2, name: "Kaffeine", type: "Cafe", rating: 4.5, x: 65, y: 30, 
    icon: Coffee, color: "bg-[#FFD60A]", description: "Award-winning espresso.",
    image: "https://picsum.photos/id/1060/600/400",
    price: "$",
    isOpen: true,
    dishes: [
      { name: "Latte", image: "https://picsum.photos/id/1060/200/200" },
      { name: "Croissant", image: "https://picsum.photos/id/292/200/200" }
    ]
  },
  { 
    id: 3, name: "Sushi Zen", type: "Sushi", rating: 4.9, x: 25, y: 60, 
    icon: Utensils, color: "bg-[#3B82F6]", description: "Fresh omakase.",
    image: "https://picsum.photos/id/674/600/400",
    price: "$$$",
    isOpen: true,
    dishes: [
      { name: "Salmon", image: "https://picsum.photos/id/674/200/200" },
      { name: "Tuna Roll", image: "https://picsum.photos/id/493/200/200" },
      { name: "Tempura", image: "https://picsum.photos/id/292/200/200" },
      { name: "Miso", image: "https://picsum.photos/id/1060/200/200" }
    ]
  },
  { 
    id: 4, name: "Spicy House", type: "Sichuan", rating: 4.7, x: 55, y: 75, 
    icon: Flame, color: "bg-[#EF4444]", description: "Numbing spice experience.",
    image: "https://picsum.photos/id/493/600/400",
    price: "$$",
    isOpen: false,
    dishes: [
      { name: "Mapo Tofu", image: "https://picsum.photos/id/493/200/200" },
      { name: "Dumplings", image: "https://picsum.photos/id/292/200/200" }
    ]
  },
];

export const MapPage: React.FC = () => {
  const [isAddSpotOpen, setIsAddSpotOpen] = useState(false);
  const [spots, setSpots] = useState<FoodSpot[]>(INITIAL_SPOTS);
  const [selectedSpot, setSelectedSpot] = useState<FoodSpot | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([1, 2]);
  const [wantToTryIds, setWantToTryIds] = useState<number[]>([3, 4]);

  const toggleFavorite = (id: number) => {
    setFavoriteIds(prev => 
      prev.includes(id) ? prev.filter(spotId => spotId !== id) : [...prev, id]
    );
  };

  const toggleWantToTry = (id: number) => {
    setWantToTryIds(prev => 
      prev.includes(id) ? prev.filter(spotId => spotId !== id) : [...prev, id]
    );
  };

  const handleCreateSpot = (data: any) => {
    const newSpot: FoodSpot = {
      id: Date.now(),
      name: data.name,
      type: data.type,
      rating: Number(data.rating),
      x: 40 + Math.random() * 20,
      y: 40 + Math.random() * 20,
      icon: Utensils,
      color: "bg-blue-500",
      description: data.description,
      image: `https://picsum.photos/seed/${Date.now()}/200/200`,
      price: "$$",
      isOpen: true,
      dishes: []
    };
    setSpots([...spots, newSpot]);
  };

  return (
    <div className="min-h-screen bg-transparent pb-24 animate-fade-in">
      {/* Header */}
      <div className="px-5 pt-[62px] h-[116px] flex items-center justify-end sticky top-0 bg-transparent z-30">
        <button className="w-[34px] h-[34px] bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors shadow-sm">
          <Bell size={20} className="text-white" />
        </button>
      </div>

      {/* Content Section */}
      <div className="px-5 mb-4">
        <div className="relative h-[380px] w-full rounded-[2.5rem] overflow-hidden shadow-sm border border-white/20 bg-[#E6F2FF]">
           {/* Map Background */}
           <div className="absolute inset-0">
             <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <path d="M -50 100 Q 150 50 350 150 T 800 100" fill="none" stroke="white" strokeWidth="12" strokeLinecap="round" />
                <path d="M 100 -50 Q 150 200 50 400" fill="none" stroke="white" strokeWidth="12" strokeLinecap="round" />
                <path d="M 250 -50 Q 200 200 300 400" fill="none" stroke="white" strokeWidth="12" strokeLinecap="round" />
             </svg>
           </div>

           {/* Search Bar */}
           <div className="absolute top-5 left-5 right-5 bg-white rounded-2xl shadow-sm px-5 py-4 flex items-center gap-3 z-20">
             <Search size={20} className="text-slate-400" />
             <input 
               placeholder="Search food..." 
               className="flex-1 bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 font-medium"
             />
             <button className="text-slate-400 hover:text-blue-600">
               <List size={20} className="rotate-90" />
             </button>
           </div>

           {/* Markers */}
           {spots.map(spot => (
             <div
               key={spot.id}
               onClick={() => setSelectedSpot(spot)}
               className="absolute transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform cursor-pointer z-10"
               style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
             >
               <div className={`w-12 h-12 rounded-full shadow-md flex items-center justify-center border-[3px] border-white ${spot.color} text-white`}>
                 <spot.icon size={20} />
               </div>
             </div>
           ))}

           {/* Add Spot Button (Corner) */}
           <button 
             onClick={() => setIsAddSpotOpen(true)}
             className="absolute bottom-5 right-5 w-14 h-14 bg-[#FFD60A] text-slate-900 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform z-20"
           >
             <Plus size={28} />
           </button>
        </div>
      </div>

      {/* Wishlist Section */}
      <div className="mb-4">
        <div className="px-5 flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900">My Favorite List</h2>
        </div>
        
        <div className="flex gap-3 overflow-x-auto px-5 pb-4 scrollbar-hide">
          {spots.filter(spot => favoriteIds.includes(spot.id)).map(spot => (
            <div key={spot.id} className="flex flex-col items-center gap-3 shrink-0 cursor-pointer" onClick={() => setSelectedSpot(spot)}>
              <div className="w-[100px] h-[100px] rounded-full p-1 border-2 border-white shadow-sm bg-white">
                <img src={spot.image} alt={spot.name} className="w-full h-full rounded-full object-cover" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-slate-900 text-sm mb-1">{spot.name}</h3>
                <div className="inline-flex items-center gap-1 bg-[#FFD60A] px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-900 shadow-sm">
                  <Star size={10} fill="currentColor" />
                  <span>{spot.rating}</span>
                </div>
              </div>
            </div>
          ))}
          <Link to="/favorites" className="flex flex-col items-center gap-3 shrink-0 cursor-pointer">
            <div className="w-[100px] h-[100px] rounded-full border-2 border-white shadow-sm bg-[#A5E1FF] flex items-center justify-center">
              <div className="text-blue-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-slate-700 text-sm mb-1 mt-1">More</h3>
            </div>
          </Link>
        </div>
      </div>

      {/* Want to Try Section */}
      <div className="mb-4">
        <div className="px-5 flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900">Want to Try List</h2>
        </div>
        
        <div className="flex gap-3 overflow-x-auto px-5 pb-4 scrollbar-hide">
          {spots.filter(spot => wantToTryIds.includes(spot.id)).map(spot => (
            <div key={`want-${spot.id}`} className="flex flex-col items-center gap-3 shrink-0 cursor-pointer" onClick={() => setSelectedSpot(spot)}>
              <div className="w-[100px] h-[100px] rounded-full p-1 border-2 border-white shadow-sm bg-white">
                <img src={spot.image} alt={spot.name} className="w-full h-full rounded-full object-cover" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-slate-900 text-sm mb-1">{spot.name}</h3>
                <div className="inline-flex items-center gap-1 bg-[#FFD60A] px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-900 shadow-sm">
                  <Star size={10} fill="currentColor" />
                  <span>{spot.rating}</span>
                </div>
              </div>
            </div>
          ))}
          <Link to="/want-to-try" className="flex flex-col items-center gap-3 shrink-0 cursor-pointer">
            <div className="w-[100px] h-[100px] rounded-full border-2 border-white shadow-sm bg-[#A5E1FF] flex items-center justify-center">
              <div className="text-blue-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-slate-700 text-sm mb-1 mt-1">More</h3>
            </div>
          </Link>
        </div>
      </div>

      {/* Spot Details Sheet */}
      {selectedSpot && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setSelectedSpot(null)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] shadow-2xl z-50 animate-slide-up max-h-[85vh] overflow-y-auto pb-8">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-2" />
            
            {/* Hero Image */}
            <div className="relative h-64 mx-4 mt-2 rounded-[2rem] overflow-hidden">
               <img src={selectedSpot.image} className="w-full h-full object-cover" alt={selectedSpot.name} />
               <div className="absolute top-4 right-4 flex gap-2">
                 <button 
                   onClick={() => toggleFavorite(selectedSpot.id)}
                   className={`w-10 h-10 bg-white rounded-full flex items-center justify-center transition-colors shadow-md ${
                     favoriteIds.includes(selectedSpot.id) ? 'text-red-500' : 'text-slate-400 hover:text-red-500'
                   }`}
                 >
                   <Heart size={20} fill={favoriteIds.includes(selectedSpot.id) ? 'currentColor' : 'none'} />
                 </button>
                 <button 
                   onClick={() => toggleWantToTry(selectedSpot.id)}
                   className={`w-10 h-10 bg-white rounded-full flex items-center justify-center transition-colors shadow-md ${
                     wantToTryIds.includes(selectedSpot.id) ? 'text-blue-500' : 'text-slate-400 hover:text-blue-500'
                   }`}
                 >
                   <Bookmark size={20} fill={wantToTryIds.includes(selectedSpot.id) ? 'currentColor' : 'none'} />
                 </button>
               </div>
            </div>

            {/* Content */}
            <div className="px-8 pt-6">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-3xl font-black text-slate-900">{selectedSpot.name}</h2>
                <div className="flex items-center gap-1 bg-[#FFD60A] px-3 py-1.5 rounded-full text-slate-900 font-bold shadow-sm">
                  <Star size={14} fill="currentColor" />
                  <span>{selectedSpot.rating}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-500 font-medium mb-8">
                <span>{selectedSpot.type}</span>
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                <span>{selectedSpot.price || '$$'}</span>
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                <span className={selectedSpot.isOpen !== false ? "text-green-600" : "text-red-500"}>
                  {selectedSpot.isOpen !== false ? "Open Now" : "Closed"}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-4">Featured Dishes</h3>
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-8 px-8">
                {selectedSpot.dishes?.map((dish, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                    <div className="w-20 h-20 rounded-full border-2 border-slate-100 p-0.5 shadow-sm">
                      <img src={dish.image} className="w-full h-full rounded-full object-cover" alt={dish.name} />
                    </div>
                    <span className="text-xs font-bold text-slate-600">{dish.name}</span>
                  </div>
                ))}
                {(!selectedSpot.dishes || selectedSpot.dishes.length === 0) && (
                   <p className="text-slate-400 italic">No featured dishes yet.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <AddSpotModal 
        isOpen={isAddSpotOpen} 
        onClose={() => setIsAddSpotOpen(false)} 
        onSubmit={handleCreateSpot} 
      />
    </div>
  );
};
