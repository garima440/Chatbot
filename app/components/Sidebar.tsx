import React from 'react';
import Link from 'next/link';
import { FlashcardSet } from '../types';
import { FaBook } from 'react-icons/fa';

interface SidebarProps {
  flashcardSets: FlashcardSet[];
}

const Sidebar: React.FC<SidebarProps> = ({ flashcardSets }) => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <FaBook className="mr-2" />
        Flashcard Sets
      </h2>
      <ul className="space-y-2">
        {flashcardSets.map((set) => (
          <li key={set._id} className="transition duration-300 ease-in-out">
            <Link href={`/flashcards/${set._id}`}>
              <span className="block py-2 px-4 rounded-md hover:bg-gray-700 cursor-pointer">
                {set.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;