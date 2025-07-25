import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { db } from '@/firebase/admin';

export async function GET(request: Request) {
  return Response.json({ hi: 'Hii' });
}

export async function POST(request: Request) {
  const { role, level, type, techstack, numberOfQuestions, userId } =
    await request.json();
  try {
    console.log({ role, level, type, techstack, numberOfQuestions, userId });
    const { text: questions } = await generateText({
      model: google('gemini-2.0-flash-001'),
      prompt: `Prepare questions for the interview
      The job role is ${role}
      The job level is ${level}
      The job type between technical and behavioural is ${type}
      The tech stacks will be ${techstack.split(' ').join(',')}
      Create ${numberOfQuestions} questions
      Please return only the questions
      The questions will be read by the AI voice assistant so do not include any unnecessary special character
      Return the questions formatted like this only
      ['Question1', 'Question2', 'Question3']
      
      Thanks`,
    });
    console.log({ questions });
    const interview = {
      userId,
      role,
      level,
      type,
      techstack,
      numberOfQuestions,
      questions,
      createdAt: new Date(),
    };
    await db.collection('interviews').add(interview);
    return Response.json({ success: true });
  } catch (e: any) {
    console.log(e);
    return Response.json({ success: false });
  }
}

