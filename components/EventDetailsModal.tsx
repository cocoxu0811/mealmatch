import React from 'react';
import { X, Calendar, MapPin, Users, Check, X as XIcon, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DiningEvent, User, RequestStatus } from '../types';

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: DiningEvent | null;
  currentUser: User;
  onJoinRequest: (eventId: string) => void;
  onProcessRequest: (eventId: string, requestId: string, approved: boolean) => void;
  isFollowing: boolean;
  onToggleFollow: (userId: string) => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  isOpen,
  onClose,
  event,
  currentUser,
  onJoinRequest,
  onProcessRequest,
  isFollowing,
  onToggleFollow
}) => {
  const navigate = useNavigate();

  if (!isOpen || !event) return null;

  const isHost = event.host.id === currentUser.id;
  const isParticipant = event.participants.some(p => p.id === currentUser.id);
  const existingRequest = event.requests.find(r => r.user.id === currentUser.id);
  const isPending = existingRequest?.status === RequestStatus.PENDING;
  const isFull = event.spotsFilled >= event.spotsTotal;

  const pendingRequests = event.requests.filter(r => r.status === RequestStatus.PENDING);

  const handleHostClick = () => {
    onClose();
    navigate(`/profile/${event.host.id}`);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up max-h-[75vh] flex flex-col">
        
        {/* Header Image */}
        <div className="relative h-48 sm:h-64 shrink-0">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-colors"
          >
            <X size={20} />
          </button>
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-slate-800 uppercase tracking-wide shadow-sm">
            {event.cuisine}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Title & Host */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-4">{event.title}</h2>
            <div className="flex items-center gap-4">
              <div 
                className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-xl -ml-2 transition-colors w-fit"
                onClick={handleHostClick}
              >
                <img 
                  src={event.host.avatar} 
                  alt={event.host.name} 
                  className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                />
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Hosted by</p>
                  <p className="text-base font-bold text-slate-700">{event.host.name}</p>
                </div>
              </div>
              
              {!isHost && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFollow(event.host.id);
                  }}
                  className={`
                    px-3 py-1.5 rounded-full text-xs font-bold transition-all
                    ${isFollowing 
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                      : 'bg-[#FFD60A] text-slate-900 hover:bg-[#e5c009]'}
                  `}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <div className="flex items-center gap-2 text-slate-900 mb-1">
                <Calendar size={18} />
                <span className="text-xs font-bold uppercase">Time</span>
              </div>
              <p className="font-semibold text-slate-700">
                {new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(event.date)}
              </p>
              <p className="text-sm text-slate-500">
                {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(event.date)}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <div className="flex items-center gap-2 text-slate-900 mb-1">
                <MapPin size={18} />
                <span className="text-xs font-bold uppercase">Location</span>
              </div>
              <p className="font-semibold text-slate-700">{event.location}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <div className="flex items-center gap-2 text-slate-900 mb-1">
                <Users size={18} />
                <span className="text-xs font-bold uppercase">Spots</span>
              </div>
              <p className="font-semibold text-slate-700">{event.spotsFilled} / {event.spotsTotal} Filled</p>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-[#FFD60A] h-full rounded-full" 
                  style={{ width: `${(event.spotsFilled / event.spotsTotal) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">About this meal</h3>
            <p className="text-slate-600 leading-relaxed">{event.description}</p>
          </div>

          {/* Host Management Section */}
          {isHost && (
            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                Manage Requests
                {pendingRequests.length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingRequests.length}</span>
                )}
              </h3>
              
              {pendingRequests.length === 0 ? (
                <p className="text-slate-400 text-sm italic">No pending requests yet.</p>
              ) : (
                <div className="space-y-3">
                  {pendingRequests.map(req => (
                    <div key={req.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                      <div className="flex items-center gap-3">
                        <img src={req.user.avatar} alt={req.user.name} className="w-10 h-10 rounded-full" />
                        <div>
                          <p className="font-bold text-slate-700">{req.user.name}</p>
                          <p className="text-xs text-slate-400">Requested {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(req.timestamp)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => onProcessRequest(event.id, req.id, false)}
                          className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"
                        >
                          <XIcon size={18} />
                        </button>
                        <button 
                          onClick={() => onProcessRequest(event.id, req.id, true)}
                          className="p-2 text-blue-500 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-colors"
                        >
                          <Check size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Participants List */}
           <div className="border-t border-slate-100 pt-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Who's Going</h3>
              <div className="flex flex-wrap gap-4">
                {event.participants.map(p => (
                  <div key={p.id} className="flex flex-col items-center gap-1">
                    <img src={p.avatar} alt={p.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                    <span className="text-xs font-medium text-slate-600">{p.id === event.host.id ? 'Host' : p.name.split(' ')[0]}</span>
                  </div>
                ))}
                {Array.from({ length: event.spotsTotal - event.spotsFilled }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 opacity-40">
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                      <Users size={16} className="text-slate-400" />
                    </div>
                    <span className="text-xs font-medium text-slate-400">Open</span>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* Footer Action */}
        {!isHost && (
          <div className="p-6 border-t border-slate-100 bg-white">
            {isParticipant ? (
              <div className="w-full py-3 rounded-xl bg-green-100 text-green-700 font-bold flex items-center justify-center gap-2">
                <Check size={20} />
                You're going!
              </div>
            ) : isPending ? (
              <div className="w-full py-3 rounded-xl bg-yellow-50 text-yellow-600 font-bold flex items-center justify-center gap-2">
                <Clock size={20} />
                Request Pending
              </div>
            ) : isFull ? (
              <button disabled className="w-full py-3 rounded-xl bg-slate-100 text-slate-400 font-bold cursor-not-allowed">
                Event Full
              </button>
            ) : (
              <button 
                onClick={() => onJoinRequest(event.id)}
                className="w-full py-3 rounded-xl bg-[#FFD60A] text-slate-900 font-bold hover:bg-[#e5c009] transition-colors shadow-lg shadow-[#FFD60A]/30"
              >
                Request to Join
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
