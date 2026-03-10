import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { CreateEventModal } from './components/CreateEventModal';
import { Home } from './pages/Home';
import { Chat } from './pages/Chat';
import { Profile } from './pages/Profile';
import { MapPage } from './pages/MapPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { WantToTryPage } from './pages/WantToTryPage';
import { AddFavoritePage } from './pages/AddFavoritePage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { DiningEvent, User, RequestStatus, ChatThread } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

const INITIAL_EVENTS: DiningEvent[] = [
  {
    id: 'e1',
    host: { id: 'u2', name: 'Sarah L.', avatar: 'https://picsum.photos/id/65/100/100' },
    title: 'Hidden Gem Ramen Spot 🍜',
    description: 'Found this amazing tiny ramen bar downtown. They only have 8 seats! Looking for a couple of people to enjoy some tonkotsu with.',
    cuisine: 'Chinese',
    date: new Date(Date.now() + 86400000), 
    location: 'Downtown District',
    spotsTotal: 3,
    spotsFilled: 1,
    image: 'https://picsum.photos/id/225/800/600',
    tags: ['Casual', 'Late Night'],
    participants: [],
    requests: []
  },
  {
    id: 'e2',
    host: { id: 'u3', name: 'Mike Ross', avatar: 'https://picsum.photos/id/91/100/100' },
    title: 'AYCE K-BBQ Extravaganza 🔥',
    description: 'It is Friday night and I need meat! Going to Iron Age. Prepare your stomachs. First round of soju is on me!',
    cuisine: 'BBQ',
    date: new Date(Date.now() + 172800000), 
    location: 'K-Town',
    spotsTotal: 6,
    spotsFilled: 5, 
    image: 'https://picsum.photos/id/429/800/600',
    tags: ['Party', 'Alcohol'],
    participants: [],
    requests: []
  },
  {
    id: 'e3',
    host: { id: 'u4', name: 'Emily D.', avatar: 'https://picsum.photos/id/111/100/100' },
    title: 'Authentic Italian Pasta Making',
    description: 'Not just eating, but watching them make it fresh. A bit pricey but totally worth it for the carbonara.',
    cuisine: 'Italian',
    date: new Date(Date.now() + 3600000), 
    location: 'Little Italy',
    spotsTotal: 4,
    spotsFilled: 2,
    image: 'https://picsum.photos/id/338/800/600',
    tags: ['Fancy', 'Foodie'],
    participants: [],
    requests: []
  }
];

const MOCK_THREADS: ChatThread[] = [
  {
    id: 't1',
    user: { id: 'u2', name: 'Sarah L.', avatar: 'https://picsum.photos/id/65/100/100' },
    lastMessage: 'Great! See you at 7pm then!',
    timestamp: new Date(Date.now() - 3600000),
    unread: 2
  },
  {
    id: 't2',
    user: { id: 'u3', name: 'Mike Ross', avatar: 'https://picsum.photos/id/91/100/100' },
    lastMessage: 'Is the parking lot full?',
    timestamp: new Date(Date.now() - 86400000),
    unread: 0
  }
];

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const [events, setEvents] = useState<DiningEvent[]>(INITIAL_EVENTS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [followedUserIds, setFollowedUserIds] = useState<string[]>([]);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(MOCK_THREADS);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If not logged in and not on auth pages, don't render main content (handled by ProtectedRoute, but this is for layout)
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  // Safe to assume user exists for protected routes logic below, 
  // but TypeScript needs reassurance or we handle null gracefully.
  const currentUser = user || { id: 'guest', name: 'Guest', avatar: '' };

  const handleCreateEvent = (data: any) => {
    const newEvent: DiningEvent = {
      id: Date.now().toString(),
      host: currentUser,
      title: data.title,
      description: data.description,
      cuisine: data.cuisine,
      date: data.date,
      location: data.location,
      spotsTotal: Number(data.spotsTotal),
      spotsFilled: 1,
      image: `https://picsum.photos/seed/${Date.now()}/800/600`,
      tags: ['New'],
      participants: [currentUser],
      requests: []
    };
    setEvents([newEvent, ...events]);
  };

  const handleJoinRequest = (eventId: string) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        if (event.requests.some(r => r.user.id === currentUser.id)) return event;
        
        return {
          ...event,
          requests: [
            ...event.requests,
            {
              id: Date.now().toString(),
              user: currentUser,
              status: RequestStatus.PENDING,
              timestamp: new Date()
            }
          ]
        };
      }
      return event;
    }));
  };

  const handleProcessRequest = (eventId: string, requestId: string, approved: boolean) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        const request = event.requests.find(r => r.id === requestId);
        if (!request) return event;

        const newRequests = event.requests.map(r => 
          r.id === requestId 
            ? { ...r, status: approved ? RequestStatus.APPROVED : RequestStatus.REJECTED }
            : r
        );

        let newParticipants = event.participants;
        let newSpotsFilled = event.spotsFilled;

        if (approved) {
          newParticipants = [...event.participants, request.user];
          newSpotsFilled += 1;
        }

        return {
          ...event,
          requests: newRequests,
          participants: newParticipants,
          spotsFilled: newSpotsFilled
        };
      }
      return event;
    }));
  };

  const handleToggleFollow = (userId: string) => {
    setFollowedUserIds(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const handleStartChat = (targetUser: User) => {
    let threadId = `t_${Date.now()}`;
    const existingThread = chatThreads.find(t => t.user.id === targetUser.id);
    
    if (existingThread) {
      threadId = existingThread.id;
    } else {
      const newThread: ChatThread = {
        id: threadId,
        user: targetUser,
        lastMessage: 'Started a new conversation',
        timestamp: new Date(),
        unread: 0
      };
      setChatThreads([newThread, ...chatThreads]);
    }
    navigate(`/chat/${threadId}`);
  };

  const unreadCount = chatThreads.reduce((sum, thread) => sum + thread.unread, 0);

  return (
    <div className="min-h-screen bg-transparent pb-24 sm:pb-10">
      {!isAuthPage && <Navbar onOpenCreate={() => setIsCreateOpen(true)} />}
      
      <main className={!isAuthPage ? "max-w-5xl mx-auto px-4 pt-8" : ""}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home 
                  events={events} 
                  currentUser={currentUser}
                  onEventCreate={handleCreateEvent} 
                  onJoinRequest={handleJoinRequest}
                  onProcessRequest={handleProcessRequest}
                  onOpenCreate={() => setIsCreateOpen(true)}
                  followedUserIds={followedUserIds}
                  onToggleFollow={handleToggleFollow}
                />
              </ProtectedRoute>
            } 
          />
          <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
          <Route path="/want-to-try" element={<ProtectedRoute><WantToTryPage /></ProtectedRoute>} />
          <Route path="/add-favorite" element={<ProtectedRoute><AddFavoritePage /></ProtectedRoute>} />
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <Chat threads={chatThreads} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chat/:threadId" 
            element={
              <ProtectedRoute>
                <Chat threads={chatThreads} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile 
                  events={events}
                  currentUser={currentUser}
                  onJoinRequest={handleJoinRequest}
                  onProcessRequest={handleProcessRequest}
                  followedUserIds={followedUserIds}
                  onToggleFollow={handleToggleFollow}
                  onStartChat={handleStartChat}
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile/:userId" 
            element={
              <ProtectedRoute>
                <Profile 
                  events={events}
                  currentUser={currentUser}
                  onJoinRequest={handleJoinRequest}
                  onProcessRequest={handleProcessRequest}
                  followedUserIds={followedUserIds}
                  onToggleFollow={handleToggleFollow}
                  onStartChat={handleStartChat}
                />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAuthPage && <BottomNav onOpenCreate={() => setIsCreateOpen(true)} unreadCount={unreadCount} />}
      
      <CreateEventModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onSubmit={handleCreateEvent}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <HashRouter>
          <AppContent />
        </HashRouter>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;