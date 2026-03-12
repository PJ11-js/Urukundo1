
import React, { useState } from 'react';
import { UserProfile, AppScreen, ChatSession, Message } from './types';
import { MOCK_PROFILES } from './constants';
import DiscoveryScreen from './components/DiscoveryScreen';
import MessagesScreen from './components/MessagesScreen';
import ProfileScreen from './components/ProfileScreen';
import ChatDetailScreen from './components/ChatDetailScreen';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.DISCOVERY);
  const [profiles, setProfiles] = useState<UserProfile[]>(MOCK_PROFILES);
  const [matches, setMatches] = useState<ChatSession[]>([]);
  const [activeChat, setActiveChat] = useState<ChatSession | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'me',
    name: 'Jean',
    age: 26,
    bio: 'Fier Burundais à la recherche d\'une connexion sincère.',
    location: 'Bujumbura',
    images: ['https://picsum.photos/id/1/600/800'],
    interests: ['Technologie', 'Football', 'Musique']
  });

  const handleLike = (profile: UserProfile) => {
    const isMatch = Math.random() > 0.4;
    if (isMatch) {
      const newSession: ChatSession = {
        id: `session-${Date.now()}`,
        partner: profile,
        messages: [
          {
            id: 'm1',
            senderId: profile.id,
            text: `C'est un match ! Amahoro ${currentUser.name} !`,
            timestamp: Date.now()
          }
        ]
      };
      setMatches(prev => [newSession, ...prev]);
    }
    setProfiles(prev => prev.filter(p => p.id !== profile.id));
  };

  const handleDislike = (profileId: string) => {
    setProfiles(prev => prev.filter(p => p.id !== profileId));
  };

  const openChat = (session: ChatSession) => {
    setActiveChat(session);
    setCurrentScreen(AppScreen.CHAT);
  };

  const sendMessage = (text: string) => {
    if (!activeChat) return;
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      text,
      timestamp: Date.now()
    };
    
    const updatedMatches = matches.map(m => {
      if (m.id === activeChat.id) {
        const updated = { ...m, messages: [...m.messages, newMessage] };
        setActiveChat(updated);
        return updated;
      }
      return m;
    });
    setMatches(updatedMatches);
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl relative overflow-hidden border-x border-gray-100">
      <header className="px-6 py-4 flex justify-between items-center bg-white border-b border-gray-100 z-10">
        <h1 className="text-2xl font-black tracking-tighter" style={{ color: '#ce1126' }}>
          URUKUNDO <span className="text-gray-300 font-light">| BI</span>
        </h1>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <i className="fa-solid fa-sliders text-xl"></i>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto relative bg-gray-50/50">
        {currentScreen === AppScreen.DISCOVERY && (
          <DiscoveryScreen 
            profiles={profiles} 
            onLike={handleLike} 
            onDislike={handleDislike} 
          />
        )}
        {currentScreen === AppScreen.MESSAGES && (
          <MessagesScreen 
            matches={matches} 
            onSelectChat={openChat} 
          />
        )}
        {currentScreen === AppScreen.PROFILE && (
          <ProfileScreen user={currentUser} setUser={setCurrentUser} />
        )}
        {currentScreen === AppScreen.CHAT && activeChat && (
          <ChatDetailScreen 
            session={activeChat} 
            onSendMessage={sendMessage} 
            onBack={() => setCurrentScreen(AppScreen.MESSAGES)}
          />
        )}
      </main>

      {currentScreen !== AppScreen.CHAT && (
        <BottomNav 
          currentScreen={currentScreen} 
          onNavigate={setCurrentScreen} 
        />
      )}
    </div>
  );
};

export default App;
