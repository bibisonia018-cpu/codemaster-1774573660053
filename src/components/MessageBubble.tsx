import React, { useMemo } from 'react';
import { decryptMessage } from '../utils/crypto';

interface MessageBubbleProps {
  message: {
    id: string;
    text: string; // Encrypted
    senderId: string;
    createdAt: any;
  };
  isOwn: boolean;
  secretKey: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn, secretKey }) => {
  // Decrypt the message locally
  const decryptedText = useMemo(() => {
    return decryptMessage(message.text, secretKey);
  }, [message.text, secretKey]);

  // Format time
  const timeString = useMemo(() => {
    if (!message.createdAt) return 'الآن';
    const date = message.createdAt.toDate ? message.createdAt.toDate() : new Date(message.createdAt);
    return new Intl.DateTimeFormat('ar-EG', { hour: 'numeric', minute: 'numeric' }).format(date);
  }, [message.createdAt]);

  return (
    <div className={`flex w-full ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[75%] md:max-w-[60%] flex flex-col ${
          isOwn ? 'items-end' : 'items-start'
        }`}
      >
        <div 
          className={`px-4 py-3 rounded-2xl shadow-sm ${
            isOwn 
              ? 'bg-emerald-600 text-white rounded-tl-none' 
              : 'bg-gray-800 text-gray-100 border border-gray-700 rounded-tr-none'
          }`}
          style={{ wordBreak: 'break-word' }}
        >
          <p className="text-sm md:text-base leading-relaxed">{decryptedText}</p>
        </div>
        <span className="text-[10px] text-gray-500 mt-1 px-1">
          {timeString}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;