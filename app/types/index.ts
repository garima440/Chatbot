export interface FlashcardData {
    term: string;
    definition: string;
  }
  
  export interface FlashcardSet {
    _id: string;
    name: string;
    cards: FlashcardData[];
  }