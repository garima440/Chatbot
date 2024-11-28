import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaRobot } from 'react-icons/fa';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const formatContent = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      if (parsed.topic && Array.isArray(parsed.cards)) {
        return (
          <div className="bg-white rounded-lg p-4 shadow-md">
            <h3 className="font-bold text-lg mb-3 text-indigo-600">Flashcard Set: {parsed.topic}</h3>
            <ul className="space-y-2">
              {parsed.cards.map((card: any, index: number) => (
                <li key={index} className="bg-gray-50 p-2 rounded">
                  <span className="font-semibold text-indigo-500">{card.term}:</span> {card.definition}
                </li>
              ))}
            </ul>
          </div>
        );
      }
    } catch (e) {}
    return <span>{content}</span>;
  };

  return (
    <div className="flex-grow overflow-y-auto p-4 bg-gray-100">
      {messages.map((message, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`flex mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`flex max-w-3/4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${message.role === 'user' ? 'bg-blue-500' : 'bg-green-500'} text-white`}>
              {message.role === 'user' ? <FaUser /> : <FaRobot />}
            </div>
            <div className={`mx-3 px-4 py-2 rounded-lg ${message.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-white text-gray-800'} shadow-md`}>
              {formatContent(message.content)}
            </div>
          </div>
        </motion.div>
      ))}
      {isLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center mt-4"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          <span className="ml-2 text-indigo-500 font-medium">Thinking...</span>
        </motion.div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;