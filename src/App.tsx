import React, { useState, useEffect } from 'react';
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import JoinRoom from './components/JoinRoom';
import ChatRoom from './components/ChatRoom';
import { Shield } from 'lucide-react';

interface RoomData {
  roomId: string;
  secretKey: string;
}

function App() {
  const [userId, setUserId] = useState<string | null>(null);
  const [currentRoom, setCurrentRoom] = useState<RoomData | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleJoin = (roomId: string, secretKey: string) => {
    setCurrentRoom({ roomId, secretKey });
  };

  const handleLeave = () => {
    setCurrentRoom(null);
  };

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-pulse flex flex-col items-center">
          <Shield className="w-12 h-12 text-emerald-500 mb-4" />
          <p className="text-gray-400">جاري تأمين الاتصال...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <header className="bg-gray-900 border-b border-gray-800 p-4 shadow-md">
        <div className="container mx-auto max-w-4xl flex justify-between items-center">
          <div className="flex items-center gap-2 text-emerald-500">
            <Shield className="w-6 h-6" />
            <h1 className="text-xl font-bold tracking-wider">دردشة سرية E2EE</h1>
          </div>
          {currentRoom && (
            <button 
              onClick={handleLeave}
              className="text-sm bg-red-500/10 text-red-500 hover:bg-red-500/20 px-4 py-2 rounded-lg transition-colors"
            >
              مغادرة الغرفة
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 container mx-auto max-w-4xl p-4 flex flex-col">
        {!currentRoom ? (
          <JoinRoom onJoin={handleJoin} />
        ) : (
          <ChatRoom roomData={currentRoom} userId={userId} />
        )}
      </main>
    </div>
  );
}

export default App;