'use client';

import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatInput from './components/ChatInput';
import ChatMessages from './components/ChatMessages';
import Sidebar from './components/Sidebar';
import { FlashcardSet } from './types';


// Define the type for messages
interface Message {
  role: 'user' | 'assistant'; // Set the role to be one of these two values
  content: any;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [isLoading, setIsLoading] = useState(false);

   // Load messages from localStorage on initial render
   useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    fetchFlashcardSets();
  }, []);

  const fetchFlashcardSets = async () => {
    try {
      const response = await fetch('/api/flashcards');
      if (!response.ok) {
        throw new Error('Failed to fetch flashcard sets');
      }
      const data = await response.json();
      setFlashcardSets(data);
    } catch (error) {
      console.error('Error fetching flashcard sets:', error);
      toast.error('Failed to load flashcard sets');
    }
  };

  const handleSendMessage = async (message: string) => {
    setMessages((prev) => [...prev, { role: 'user', content: message }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);

      if (data.flashcardSetId) {
        toast.success('New flashcard set created!');
        fetchFlashcardSets();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar flashcardSets={flashcardSets} />
      <main className="flex-1 flex flex-col">
        <ChatMessages messages={messages} isLoading={isLoading}/>
        
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </main>
      <ToastContainer />
    </div>
  );
}