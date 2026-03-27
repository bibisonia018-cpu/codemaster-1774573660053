import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { encryptMessage } from '../utils/crypto';
import MessageBubble from './MessageBubble';
import { Send, Lock } from 'lucide-react';

interface ChatRoomProps {
  roomData: { roomId: string; secretKey: string };
  userId: string;
}

interface Message {
  id: string;
  text: string; // Encrypted text from DB
  senderId: string;
  createdAt: any;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ roomData, userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // REQUIRED BY SYSTEM PROMPT: Real-time Listener on Firestore using currentRoomId
    const q = query(
      collection(db, 'messages'),
      where('roomId', '==', roomData.roomId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(msgs);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [roomData.roomId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageToEncrypt = newMessage;
    setNewMessage(''); // clear input instantly for UX

    // Encrypt before sending to server
    const encryptedText = encryptMessage(messageToEncrypt, roomData.secretKey);

    try {
      await addDoc(collection(db, 'messages'), {
        roomId: roomData.roomId,
        text: encryptedText,
        senderId: userId,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending message: ", error);
      alert('حدث خطأ أثناء الإرسال');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-2xl flex-1">
      {/* Room Header Info */}
      <div className="bg-gray-950 p-4 border-b border-gray-800 flex justify-between items-center">
        <div>
          <h3 className="text-gray-200 font-semibold flex items-center gap-2">
            الغرفة: <span className="text-emerald-400 select-all">{roomData.roomId}</span>
          </h3>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <Lock className="w-3 h-3" /> التشفير مفعل (E2EE)
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 text-sm">
            لا توجد رسائل بعد. ابدأ المحادثة المشفرة!
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              isOwn={msg.senderId === userId} 
              secretKey={roomData.secretKey} 
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-950 border-t border-gray-800">
        <form onSubmit={handleSendMessage} className="flex gap-2 relative">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="اكتب رسالة سرية..."
            className="flex-1 bg-gray-900 text-white border border-gray-700 rounded-full py-3 px-6 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors shrink-0"
          >
            <Send className="w-5 h-5 rtl:-scale-x-100" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;