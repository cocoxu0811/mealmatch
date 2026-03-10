import React, { useState } from 'react';
import { X, Loader2, MapPin, Heart, Bookmark } from 'lucide-react';

interface AddSpotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const SPOT_TYPES = ['Restaurant', 'Cafe', 'Bar', 'Street Food', 'Dessert'];

export const AddSpotModal: React.FC<AddSpotModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: SPOT_TYPES[0],
    description: '',
    rating: 5,
    isFavorite: false,
    isInterested: false
  });

  if (!isOpen) return null;

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
      onSubmit(formData);
      setLoading(false);
      onClose();
      // Reset form
      setFormData({
        name: '',
        type: SPOT_TYPES[0],
        description: '',
        rating: 5,
        isFavorite: false,
        isInterested: false
      });
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up ring-1 ring-black/5">
        
        {/* Minimal Header */}
        <div className="px-8 pt-8 pb-2 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Mark a Spot</h2>
            <p className="text-slate-400 text-sm">Share your discovery</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
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
                className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 text-slate-800 placeholder-slate-400 border-none outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Type</label>
              <div className="relative">
                <select 
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-4 rounded-2xl bg-slate-50 text-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none font-medium"
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
                className="w-full px-4 py-4 rounded-2xl bg-slate-50 text-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-center"
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
              className="w-full px-4 py-4 rounded-2xl bg-slate-50 text-slate-800 placeholder-slate-400 border-none outline-none focus:ring-2 focus:ring-blue-500/20 resize-none font-medium"
            />
          </div>

          <div className="flex gap-4">
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
            className="w-full py-5 rounded-[1.2rem] bg-yellow-400 text-slate-900 font-bold text-lg hover:bg-yellow-300 transition-all transform active:scale-[0.98] shadow-lg shadow-yellow-400/20 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Add Spot'}
          </button>
        </form>
      </div>
    </div>
  );
};