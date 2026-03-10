import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, Plus } from 'lucide-react';

interface FoodSpot {
  id: number;
  name: string;
  type: string;
  rating: number;
  description: string;
  image?: string;
  price?: string;
  isOpen?: boolean;
}

const WANT_TO_TRY_SPOTS: FoodSpot[] = [
  { 
    id: 3, name: "Sushi Zen", type: "Sushi", rating: 4.9, 
    description: "Fresh omakase.",
    image: "https://picsum.photos/id/674/600/400",
    price: "$$$",
    isOpen: true,
  },
  { 
    id: 4, name: "Spicy House", type: "Sichuan", rating: 4.7, 
    description: "Numbing spice experience.",
    image: "https://picsum.photos/id/493/600/400",
    price: "$$",
    isOpen: false,
  },
];

export const WantToTryPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-transparent pb-24 animate-fade-in">
      {/* Header */}
      <div className="px-5 pt-[62px] h-[116px] flex items-center gap-3 sticky top-0 bg-transparent z-30">
        <button 
          onClick={() => navigate(-1)}
          className="w-[34px] h-[34px] bg-white rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm border border-slate-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Want to Try List</h1>
      </div>

      {/* Content */}
      <div className="px-5 mt-4 space-y-3">
        {WANT_TO_TRY_SPOTS.map(spot => (
          <div 
            key={spot.id} 
            className="group bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow flex items-center gap-3"
          >
            <div className="w-24 h-24 rounded-[2rem] overflow-hidden shrink-0">
              <img src={spot.image} alt={spot.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-900 text-lg truncate">{spot.name}</h3>
                <div className="flex items-center gap-1 bg-[#FFD60A] px-2 py-1 rounded-lg text-slate-900 text-xs font-bold shrink-0 shadow-sm">
                  <span>{spot.rating}</span>
                  <Star size={10} fill="currentColor" />
                </div>
              </div>
              <p className="text-slate-500 text-sm truncate">{spot.type} • {spot.description}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{spot.price}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-md ${spot.isOpen ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>
                  {spot.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>
            </div>
          </div>
        ))}
        <Link 
          to="/add-favorite"
          className="group bg-white p-3 rounded-[2.5rem] border border-slate-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow flex items-center justify-center"
        >
          <div className="w-full h-[50px] rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold flex items-center justify-center gap-2 group-hover:bg-slate-50 group-hover:border-slate-300 transition-all">
            <Plus size={20} />
            Add New Place
          </div>
        </Link>
      </div>
    </div>
  );
};
