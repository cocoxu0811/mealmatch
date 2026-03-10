import React, { useState } from 'react';
import { User, Settings, MapPin, Heart, Shield, LogOut, ChevronRight, Utensils, MessageSquare, UserPlus, Check, Globe, Eye, EyeOff, Plus } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { DiningEvent } from '../types';
import { EventCard } from '../components/EventCard';
import { EventDetailsModal } from '../components/EventDetailsModal';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface ProfileProps {
  events: DiningEvent[];
  currentUser: User;
  onJoinRequest: (eventId: string) => void;
  onProcessRequest: (eventId: string, requestId: string, approved: boolean) => void;
  followedUserIds: string[];
  onToggleFollow: (userId: string) => void;
  onStartChat: (targetUser: User) => void;
}

export const Profile: React.FC<ProfileProps> = ({ 
  events, 
  currentUser, 
  onJoinRequest, 
  onProcessRequest,
  followedUserIds,
  onToggleFollow,
  onStartChat
}) => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { logout, updatePrivacySettings } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showPrivacyMenu, setShowPrivacyMenu] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<DiningEvent | null>(null);
  const [userTags, setUserTags] = useState<string[]>(['Spicy food lover 🌶️']);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  // Find the user to display
  // In a real app, we'd fetch this user. Here we search through events to find the user object if it's not the current user.
  let displayedUser = currentUser;
  
  if (userId && userId !== currentUser.id) {
    // Try to find user in events
    const foundUser = events.flatMap(e => [e.host, ...e.participants, ...e.requests.map(r => r.user)])
      .find(u => u.id === userId);
    
    if (foundUser) {
      displayedUser = foundUser;
    }
  }

  const isOwnProfile = displayedUser.id === currentUser.id;
  const isFollowing = followedUserIds.includes(displayedUser.id);

  const favoriteListPublic = displayedUser.privacySettings?.favoriteListPublic ?? true;
  const wantToTryListPublic = displayedUser.privacySettings?.wantToTryListPublic ?? true;

  const userEvents = events.filter(event => 
    event.host.id === displayedUser.id || 
    event.participants.some(p => p.id === displayedUser.id) ||
    event.requests.some(r => r.user.id === displayedUser.id)
  );

  const handleLogout = () => {
    logout();
    navigate('/register');
  };

  return (
    <div className="animate-fade-in pb-24 pt-[62px] px-5">
      
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-4 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full border-4 border-[#FFD60A] shadow-lg overflow-hidden mb-3 bg-[#FFD60A]">
           <img src={displayedUser.avatar} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">{displayedUser.name}</h2>
        <p className="text-gray-500 text-sm mb-3">{t('San Francisco')}</p>
        
        <div className="flex flex-wrap justify-center gap-2 mb-2 max-w-sm">
          {userTags.map((tag, index) => (
            <div key={index} className="bg-blue-50 text-blue-600 h-[28px] px-3 rounded-full text-xs font-medium border border-blue-100 flex items-center gap-1">
              {t(tag)}
              {isOwnProfile && (
                <button 
                  onClick={() => setUserTags(userTags.filter((_, i) => i !== index))}
                  className="ml-1 text-blue-400 hover:text-blue-600 focus:outline-none"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          {isOwnProfile && !isAddingTag && (
            <button 
              onClick={() => setIsAddingTag(true)}
              className="bg-gray-50 text-gray-500 h-[28px] px-3 rounded-full text-xs font-medium border border-gray-200 hover:bg-gray-100 transition-colors flex items-center gap-1"
            >
              <Plus size={12} />
              {t('Add')}
            </button>
          )}
          {isOwnProfile && isAddingTag && (
            <div className="flex items-center gap-1 h-[28px]">
              <input 
                type="text" 
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newTagInput.trim()) {
                    setUserTags([...userTags, newTagInput.trim()]);
                    setNewTagInput('');
                    setIsAddingTag(false);
                  } else if (e.key === 'Escape') {
                    setNewTagInput('');
                    setIsAddingTag(false);
                  }
                }}
                autoFocus
                placeholder="New tag..."
                className="bg-white text-gray-700 h-[28px] px-3 rounded-full text-xs font-medium border border-blue-300 outline-none focus:ring-2 focus:ring-blue-100 w-24"
              />
            </div>
          )}
        </div>
        
        <div className="flex gap-3 mt-4 w-full justify-center">
            <div className="text-center">
              <div className="font-bold text-gray-900 text-lg">{userEvents.length}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">{t('Meals')}</div>
            </div>
            <div className="text-center border-l border-gray-100 pl-6">
              <div className="font-bold text-gray-900 text-lg">48</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">{t('Followers')}</div>
            </div>
            <div className="text-center border-l border-gray-100 pl-6">
              <div className="font-bold text-gray-900 text-lg">4.9</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">{t('Rating')}</div>
            </div>
          </div>
      </div>

      {/* Action Buttons for Other Users */}
      {!isOwnProfile && (
        <div className="fixed bottom-20 left-0 w-full px-6 z-30 pointer-events-none">
          <div className="flex justify-between max-w-5xl mx-auto pointer-events-auto">
            <button 
              onClick={() => onToggleFollow(displayedUser.id)}
              className={`
                flex items-center gap-2 px-6 h-[50px] rounded-full font-bold shadow-lg transition-all active:scale-95
                ${isFollowing 
                  ? 'bg-white text-slate-800 border border-slate-200' 
                  : 'bg-slate-900 text-white'}
              `}
            >
              {isFollowing ? <Check size={20} /> : <UserPlus size={20} />}
              <span>{isFollowing ? t('Following') : t('Follow')}</span>
            </button>

            <button 
              onClick={() => onStartChat(displayedUser)}
              className="flex items-center gap-2 px-6 h-[50px] rounded-full font-bold bg-[#FFD60A] text-slate-900 shadow-lg shadow-[#FFD60A]/30 transition-all active:scale-95 hover:bg-[#e5c009]"
            >
              <MessageSquare size={20} />
              <span>{t('Chat')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Menu Sections */}
      <div className="space-y-4">
        
        {(isOwnProfile || favoriteListPublic) && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div 
              onClick={() => navigate('/favorites')}
              className="h-[52px] px-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <Heart size={16} />
                </div>
                <span className="font-medium text-gray-700">{t('My Favorite List')}</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          </div>
        )}

        {(isOwnProfile || wantToTryListPublic) && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div 
              onClick={() => navigate('/want-to-try')}
              className="h-[52px] px-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Utensils size={16} />
                </div>
                <span className="font-medium text-gray-700">{t('Want to Try List')}</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          </div>
        )}

        {isOwnProfile && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-[52px] px-4 border-b border-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <MapPin size={16} />
                </div>
                <span className="font-medium text-gray-700">{t('Location Settings')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{t('On')}</span>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </div>

            <div 
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="h-[52px] px-4 border-b border-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Globe size={16} />
                </div>
                <span className="font-medium text-gray-700">{t('Language Settings')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{language}</span>
                <ChevronRight size={16} className={`text-gray-400 transition-transform ${showLanguageMenu ? 'rotate-90' : ''}`} />
              </div>
            </div>
            
            {showLanguageMenu && (
              <div className="bg-slate-50/50 border-b border-gray-50">
                {['English', '中文', 'Français'].map((lang) => (
                  <div 
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setShowLanguageMenu(false);
                    }}
                    className="h-[52px] px-4 pl-14 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <span className={`text-sm ${language === lang ? 'font-bold text-slate-900' : 'text-gray-600'}`}>
                      {lang}
                    </span>
                    {language === lang && <Check size={16} className="text-slate-900 mr-4" />}
                  </div>
                ))}
              </div>
            )}

            <div 
              onClick={() => setShowPrivacyMenu(!showPrivacyMenu)}
              className="h-[52px] px-4 border-b border-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <Shield size={16} />
                </div>
                <span className="font-medium text-gray-700">{t('Privacy & Security')}</span>
              </div>
              <ChevronRight size={16} className={`text-gray-400 transition-transform ${showPrivacyMenu ? 'rotate-90' : ''}`} />
            </div>

            {showPrivacyMenu && (
              <div className="bg-slate-50/50 border-b border-gray-50">
                <div className="h-[52px] px-4 pl-14 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">{t('Favorite List Public')}</span>
                    <span className="text-xs text-gray-500">{t('Allow others to see your favorite list')}</span>
                  </div>
                  <button 
                    onClick={() => updatePrivacySettings({ 
                      favoriteListPublic: !favoriteListPublic, 
                      wantToTryListPublic 
                    })}
                    className={`w-12 h-6 rounded-full transition-colors relative ${favoriteListPublic ? 'bg-[#FFD60A]' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${favoriteListPublic ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <div className="h-[52px] px-4 pl-14 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">{t('Want to Try List Public')}</span>
                    <span className="text-xs text-gray-500">{t('Allow others to see your want to try list')}</span>
                  </div>
                  <button 
                    onClick={() => updatePrivacySettings({ 
                      favoriteListPublic, 
                      wantToTryListPublic: !wantToTryListPublic 
                    })}
                    className={`w-12 h-6 rounded-full transition-colors relative ${wantToTryListPublic ? 'bg-[#FFD60A]' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${wantToTryListPublic ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>
            )}

            <div className="h-[52px] px-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                  <Settings size={16} />
                </div>
                <span className="font-medium text-gray-700">{t('App Settings')}</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          </div>
        )}

        {isOwnProfile && (
          <button 
            onClick={handleLogout}
            className="w-full bg-white h-[50px] rounded-2xl shadow-sm border border-gray-100 text-red-500 font-medium flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            {t('Sign Out')}
          </button>
        )}

      </div>

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