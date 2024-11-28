import React from 'react';
import Link from 'next/link';
import { FlashcardSet } from '../types';

interface SidebarProps {
  flashcardSets: FlashcardSet[];
}

const Sidebar: React.FC<SidebarProps> = ({ flashcardSets }) => {
  return (
    <div className="w-64 bg-gray-100 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-black">Flashcard Sets</h2>
      <ul>
        {flashcardSets.map((set) => (
          <li key={set._id} className="mb-2">
            <Link href={`/flashcards/${set._id}`}>
              <span className="text-blue-500 hover:underline">{set.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;