import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Heart, Bookmark, Loader2 } from 'lucide-react';

const SPOT_TYPES = ['Restaurant', 'Cafe', 'Bar', 'Street Food', 'Dessert'];

export const AddFavoritePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: SPOT_TYPES[0],
    description: '',
    rating: 5,
    isFavorite: true,
    isInterested: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleFlag = (flag: 'isFavorite' | 'isInterested') => {
    setFormData(prev => ({ ...prev, [flag]: !prev[flag] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      navigate(-1);
    }, 800);
  };

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
        <h1 className="text-2xl font-bold text-slate-900">Add Favorite Spot</h1>
      </div>

      {/* Form */}
      <div className="px-5 mt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Place Name</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <MapPin size={18} />
            </div>
            <input 
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Joe's Pizza"
              className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white text-slate-800 placeholder-slate-400 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Type</label>
            <div className="relative">
              <select 
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-4 rounded-2xl bg-white text-slate-800 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none font-medium shadow-sm"
              >
                {SPOT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Rating</label>
            <input 
              type="number" 
              min="1" 
              max="5"
              step="0.1"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full px-4 py-4 rounded-2xl bg-white text-slate-800 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-center shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
            Description <span className="text-slate-300 font-normal text-xs">(Optional)</span>
          </label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="What makes this place special?"
            className="w-full px-4 py-4 rounded-2xl bg-white text-slate-800 placeholder-slate-400 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20 resize-none font-medium shadow-sm"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => toggleFlag('isFavorite')}
            className={`flex-1 py-4 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-200 border-2 ${
              formData.isFavorite 
                ? 'bg-red-50 border-red-100 text-red-500' 
                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
            }`}
          >
            <Heart size={24} fill={formData.isFavorite ? "currentColor" : "none"} />
            <span className="text-xs font-bold">Favorite</span>
          </button>
          <button
            type="button"
            onClick={() => toggleFlag('isInterested')}
            className={`flex-1 py-4 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-200 border-2 ${
              formData.isInterested 
                ? 'bg-yellow-50 border-yellow-100 text-yellow-600' 
                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
            }`}
          >
            <Bookmark size={24} fill={formData.isInterested ? "currentColor" : "none"} />
            <span className="text-xs font-bold">Interested</span>
          </button>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full h-[50px] rounded-[1.2rem] bg-[#FFD60A] text-slate-900 font-bold text-lg hover:bg-[#e5c009] transition-all transform active:scale-[0.98] shadow-lg shadow-[#FFD60A]/20 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Add to Favorites'}
        </button>
        </form>
      </div>
    </div>
  );
};
