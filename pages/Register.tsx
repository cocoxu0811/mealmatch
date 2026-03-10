import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { UserPreferences } from '../types';

export const Register: React.FC = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    taste: [],
    allergies: [],
    budget: '$$'
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleBasicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name && password) {
      setStep(2);
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(email, name, preferences);
    navigate('/');
  };

  const togglePreference = (category: 'taste' | 'allergies', value: string) => {
    setPreferences(prev => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const setBudget = (value: string) => {
    setPreferences(prev => ({ ...prev, budget: value }));
  };

  const TASTE_OPTIONS = ['Spicy', 'Sweet', 'Savory', 'Vegetarian', 'Vegan', 'Healthy'];
  const ALLERGY_OPTIONS = ['Peanuts', 'Seafood', 'Dairy', 'Gluten', 'Eggs', 'Soy'];
  const BUDGET_OPTIONS = ['$', '$$', '$$$'];

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100 transition-all duration-500">
        
        {step === 1 ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Join FanDa</h1>
              <p className="text-slate-500">Discover amazing food with new friends</p>
            </div>

            <form onSubmit={handleBasicSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Alex Chen"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#FFD60A] hover:bg-[#e5c009] text-slate-900 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FFD60A]/20 active:scale-[0.98]"
              >
                <span>Next Step</span>
                <ArrowRight size={20} />
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-slate-900 font-bold hover:underline">
                Sign in
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <button 
                onClick={() => setStep(1)}
                className="flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" /> Back
              </button>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Your Preferences</h1>
              <p className="text-slate-500 text-sm">Help us find the best meals for you</p>
            </div>

            <form onSubmit={handleFinalSubmit} className="space-y-8">
              
              {/* Taste Preferences */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-3">Taste Preferences</label>
                <div className="flex flex-wrap gap-2">
                  {TASTE_OPTIONS.map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => togglePreference('taste', option)}
                      className={`
                        px-4 py-2 rounded-full text-sm font-medium transition-all border
                        ${preferences.taste.includes(option)
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50'}
                      `}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Allergies */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-3">Allergies / Dietary Restrictions</label>
                <div className="flex flex-wrap gap-2">
                  {ALLERGY_OPTIONS.map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => togglePreference('allergies', option)}
                      className={`
                        px-4 py-2 rounded-full text-sm font-medium transition-all border
                        ${preferences.allergies.includes(option)
                          ? 'bg-red-500 text-white border-red-500 shadow-md shadow-red-500/20'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-red-300 hover:bg-red-50'}
                      `}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-3">Typical Budget</label>
                <div className="grid grid-cols-3 gap-3">
                  {BUDGET_OPTIONS.map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setBudget(option)}
                      className={`
                        py-3 rounded-xl text-sm font-bold transition-all border
                        ${preferences.budget === option
                          ? 'bg-green-600 text-white border-green-600 shadow-md shadow-green-600/20'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-green-300 hover:bg-green-50'}
                      `}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#FFD60A] hover:bg-[#e5c009] text-slate-900 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FFD60A]/20 active:scale-[0.98] mt-8"
              >
                <Check size={20} />
                <span>Complete Registration</span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
