import React, { useState } from 'react';
import { FaPaperPlane, FaMicrophone } from 'react-icons/fa';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white border-t border-gray-200 px-4 py-3"
    >
      <div className="flex items-center space-x-2">
        <div className="flex-grow relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full 
              focus:outline-none focus:ring-2 focus:ring-blue-500 
              text-gray-800 placeholder-gray-500"
            placeholder="Ask a question or request flashcards..."
          />
          <button 
            type="button" 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 
              text-gray-500 hover:text-gray-700"
          >
            <FaMicrophone />
          </button>
        </div>
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className={`p-2 rounded-full transition-colors duration-200 ${
            disabled || !message.trim()
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          <FaPaperPlane />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;