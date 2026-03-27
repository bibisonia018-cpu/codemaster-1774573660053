import React, { useState } from 'react';
import { generateRandomRoomId } from '../utils/crypto';
import { KeyRound, Hash, LogIn, Plus } from 'lucide-react';

interface JoinRoomProps {
  onJoin: (roomId: string, secretKey: string) => void;
}

const JoinRoom: React.FC<JoinRoomProps> = ({ onJoin }) => {
  const [roomId, setRoomId] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim() && secretKey.trim()) {
      onJoin(roomId.trim(), secretKey.trim());
    }
  };

  const createRandomRoom = () => {
    const newRoomId = generateRandomRoomId();
    setRoomId(newRoomId);
  };

  return (
    <div className="max-w-md w-full mx-auto mt-20 bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-800">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">الدخول لغرفة آمنة</h2>
        <p className="text-gray-400 text-sm">يتم تشفير الرسائل ولن يتمكن أحد من قراءتها بدون مفتاح التشفير.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">معرف الغرفة (Room ID)</label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Hash className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              required
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="block w-full bg-gray-950 border border-gray-700 text-white rounded-lg py-3 pr-10 pl-4 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="مثال: secret-123"
            />
          </div>
          <button 
            type="button" 
            onClick={createRandomRoom}
            className="mt-2 text-xs text-emerald-500 hover:text-emerald-400 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> توليد معرف عشوائي
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">مفتاح التشفير السري</label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <KeyRound className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="password"
              required
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="block w-full bg-gray-950 border border-gray-700 text-white rounded-lg py-3 pr-10 pl-4 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="كلمة السر التي يتفق عليها الطرفان"
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">ملاحظة: لا تفقد هذا المفتاح، בלعكس لن تتمكن من فك التشفير.</p>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
        >
          <LogIn className="w-5 h-5" />
          دخول الغرفة
        </button>
      </form>
    </div>
  );
};

export default JoinRoom;