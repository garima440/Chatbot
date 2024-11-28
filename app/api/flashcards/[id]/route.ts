import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const client = await clientPromise;
    const db = client.db('studyfetch');

    const flashcardSet = await db
      .collection('flashcards')
      .findOne({ _id: new ObjectId(id) });

    if (!flashcardSet) {
      return NextResponse.json(
        { error: 'Flashcard set not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(flashcardSet);
  } catch (error) {
    console.error('Error fetching flashcard set:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}