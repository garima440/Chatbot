import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import clientPromise from '../../lib/mongodb';
import { FlashcardData } from '../../types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? '',
});

function isFlashcardRequest(message: string): boolean {
  const flashcardKeywords = [
    'flashcard',
    'flash card',
    'study cards',
    'make cards',
    'create cards'
  ];
  const lowerMessage = message.toLowerCase();
  return flashcardKeywords.some(keyword => lowerMessage.includes(keyword));
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const systemPrompt = isFlashcardRequest(message) 
      ? `Create a flashcard set for "${message}". Respond ONLY with a JSON object in this format:
        {
          "topic": "Topic Name",
          "cards": [
            {
              "term": "term here",
              "definition": "definition here"
            }
          ]
        }`
      : "You are StudyFetch, an AI tutor. Respond naturally to help with learning or follow the conversation. Provide supportive, clear, and engaging assistance. ";



    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `${message}\n\n${systemPrompt}`
        }
      ]
    });

    const textContent = response.content.find(
      (block): block is Anthropic.TextBlock => block.type === 'text'
    )?.text || '';

    let flashcardSetId = null;
    const responseText = textContent;

    if (textContent.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(textContent);
        if (parsed.topic && Array.isArray(parsed.cards)) {
          flashcardSetId = await createFlashcardSet(parsed.topic, parsed.cards);
        }
      } catch (e) {
        console.error('Failed to parse flashcard JSON:', e);
      }
    }

    return NextResponse.json({
      response: responseText,
      flashcardSetId
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

async function createFlashcardSet(topic: string, cards: FlashcardData[]) {
  try {
    const client = await clientPromise;
    const db = client.db('studyfetch');

    const flashcardSet = {
      name: topic,
      cards: cards,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('flashcards').insertOne(flashcardSet);
    return result.insertedId;
  } catch (dbError) {
    console.error('Database insertion error:', dbError);
    throw dbError;
  }
}