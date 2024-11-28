'use client';

import { useState, useEffect, use } from 'react';
import { FlashcardSet } from '../../types';
import { motion } from 'framer-motion';

export default function FlashcardSetPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const fetchFlashcardSet = async () => {
      try {
        const response = await fetch(`/api/flashcards/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch flashcard set');
        }
        const data = await response.json();
        setFlashcardSet(data);
      } catch (error) {
        console.error('Error fetching flashcard set:', error);
      }
    };
    fetchFlashcardSet();
  }, [id]);

  if (!flashcardSet) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  const currentCard = flashcardSet.cards[currentCardIndex];

  const handleNextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % flashcardSet.cards.length);
    setIsFlipped(false);
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <h1 className="text-4xl font-bold mb-8 text-white">{flashcardSet.name}</h1>
      <motion.div
        className="bg-white rounded-lg shadow-lg w-96 h-64 flex items-center justify-center cursor-pointer"
        onClick={handleFlip}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 50 }}
      >
        <motion.div
          className="absolute w-full h-full flex items-center justify-center p-6"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 50 }}
        >
          <p className="text-2xl text-center font-semibold text-gray-800">
            {isFlipped ? currentCard.definition : currentCard.term}
          </p>
        </motion.div>
      </motion.div>
      <button
        className="mt-8 px-6 py-3 bg-white text-blue-600 rounded-full font-bold text-lg shadow-md hover:bg-blue-100 transition duration-300 ease-in-out transform hover:scale-105"
        onClick={handleNextCard}
      >
        Next Card
      </button>
      <p className="mt-4 text-lg font-medium">
        Card {currentCardIndex + 1} of {flashcardSet.cards.length}
      </p>
    </div>
  );
}