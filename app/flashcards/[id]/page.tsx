'use client';

import { useState, useEffect, use } from 'react';
import { FlashcardSet } from '../../types';

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
    return <div>Loading...</div>;
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-black">{flashcardSet.name}</h1>
      <div
        className="bg-white p-8 rounded shadow-md w-96 h-64 flex items-center justify-center cursor-pointer transition-transform duration-300 ease-in-out text-black"
        onClick={handleFlip}
        style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        <p className="text-xl text-center" style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
          {isFlipped ? currentCard.definition : currentCard.term}
        </p>
      </div>
      <button
        className="mt-8 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleNextCard}
      >
        Next Card
      </button>
      <p className="mt-4 text-gray-600">
        Card {currentCardIndex + 1} of {flashcardSet.cards.length}
      </p>
    </div>
  );
}