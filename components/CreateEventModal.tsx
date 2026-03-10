import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { CUISINES } from '../types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    cuisine: CUISINES[0],
    date: '',
    time: '',
    location: '',
    description: '',
    spotsTotal: 4
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const dateObj = new Date(`${formData.date}T${formData.time}`);
      onSubmit({
        ...formData,
        date: dateObj,
        spotsFilled: 1 // Host
      });
      setLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-xl font-bold text-gray-800">Host a Meal</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">What are we eating?</label>
            <input 
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Spicy Sichuan Hotpot Night"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine</label>
              <select 
                name="cuisine"
                value={formData.cuisine}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-white"
              >
                {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Group Size</label>
              <input 
                type="number" 
                min="2" 
                max="20"
                name="spotsTotal"
                value={formData.spotsTotal}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input 
                type="date" 
                required
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input 
                type="time" 
                required
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input 
              required
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Restaurant name or Area"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Description <span className="text-gray-400 font-normal">(Optional)</span></label>
            </div>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Tell people why they should join..."
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 outline-none resize-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#FFD60A] text-slate-900 font-bold hover:bg-[#e5c009] transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Create Event'}
          </button>

        </form>
      </div>
    </div>
  );
};