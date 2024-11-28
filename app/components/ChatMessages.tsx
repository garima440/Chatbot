import React from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  return (
    <div className="flex-grow overflow-y-auto p-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`mb-4 ${
            message.role === 'user' ? 'text-right' : 'text-left'
          }`}
        >
          <div
            className={`inline-block p-2 rounded-lg ${
              message.role === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-black'
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;