import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('studyfetch');

    const flashcardSets = await db.collection('flashcards').find().toArray();

    return NextResponse.json(flashcardSets);
  } catch (error) {
    console.error('Error fetching flashcard sets:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}