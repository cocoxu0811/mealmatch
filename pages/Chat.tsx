import React, { useState } from 'react';
import { ChatThread } from '../types';
import { Search, MessageSquare, ArrowLeft, Send, Bell } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

interface ChatPageProps {
  threads: ChatThread[];
}

export const Chat: React.FC<ChatPageProps> = ({ threads }) => {
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState('');

  // If viewing a specific thread
  if (threadId) {
    const activeThread = threads.find(t => t.id === threadId);
    
    if (!activeThread) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
          <p className="text-gray-500 mb-4">Conversation not found</p>
          <button 
            onClick={() => navigate('/chat')}
            className="text-blue-600 font-bold hover:underline"
          >
            Back to Messages
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-[calc(100vh-8rem)] sm:h-[calc(100vh-6rem)] animate-fade-in bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center gap-3 pt-[62px] h-[116px] px-5 border-b border-gray-100 bg-white z-10">
          <button 
            onClick={() => navigate('/chat')}
            className="w-[34px] h-[34px] flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={activeThread.user.avatar || `https://ui-avatars.com/api/?name=${activeThread.user.name}`} 
                alt={activeThread.user.name} 
                className="w-10 h-10 rounded-full object-cover border border-gray-100" 
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 leading-tight">{activeThread.user.name}</h3>
              <p className="text-xs text-green-600 font-medium">Online now</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          <div className="text-center py-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Today</p>
          </div>
          
          {/* Mock Messages for Demo */}
          <div className="flex justify-end">
            <div className="bg-[#FFD60A] text-slate-900 px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm">
              <p className="text-sm">Hi! I saw you're interested in that Italian place?</p>
              <span className="text-[10px] text-slate-700 block text-right mt-1">10:30 AM</span>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="bg-white text-gray-800 px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm border border-gray-100">
              <p className="text-sm">{activeThread.lastMessage}</p>
              <span className="text-[10px] text-gray-400 block text-right mt-1">10:32 AM</span>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-full border border-gray-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <input 
              type="text" 
              placeholder="Type a message..." 
              className="flex-1 bg-transparent border-none focus:ring-0 px-3 py-1 text-sm outline-none"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newMessage.trim()) {
                  setNewMessage('');
                }
              }}
            />
            <button 
              className={`p-2 rounded-full transition-all ${newMessage.trim() ? 'bg-[#FFD60A] text-slate-900 shadow-md' : 'bg-gray-200 text-gray-400'}`}
              disabled={!newMessage.trim()}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center pt-[62px] h-[116px] px-5 mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <button className="w-[34px] h-[34px] bg-white rounded-full flex items-center justify-center text-slate-900 hover:bg-slate-50 transition-colors relative shadow-sm">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#FFD60A] rounded-full"></span>
        </button>
      </div>
      
      {/* Search Bar */}
      <div className="relative mb-4 px-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search chats..." 
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-100 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all shadow-sm"
        />
      </div>

      {/* Threads List */}
      <div className="space-y-3 px-5">
        
        {/* User Threads */}
        {threads.map(thread => (
          <div 
            key={thread.id} 
            onClick={() => navigate(`/chat/${thread.id}`)}
            className="flex items-center gap-4 px-4 h-[52px] bg-white rounded-2xl cursor-pointer hover:shadow-md transition-all border border-gray-50 hover:border-gray-200"
          >
            <div className="relative">
              <img src={thread.user.avatar} alt={thread.user.name} className="w-10 h-10 rounded-full object-cover" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-gray-900 truncate">{thread.user.name}</h3>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(thread.timestamp)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p className={`text-sm truncate ${thread.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  {thread.lastMessage}
                </p>
                {thread.unread > 0 && (
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full shrink-0 ml-2"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-2xl text-center border border-dashed border-gray-200">
        <MessageSquare className="mx-auto text-gray-300 mb-2" size={32} />
        <p className="text-gray-500 text-sm">Join more events to start new conversations!</p>
      </div>
    </div>
  );
};