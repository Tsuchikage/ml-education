'use server'

import { promises as fs } from 'fs';
import path from 'path';

type QuizStats = {
  total: number;
  correct: number;
  incorrect: number;
};

const statsFilePath = path.join(process.cwd(), 'quizstats.json');

async function readStats(): Promise<Record<string, QuizStats>> {
  try {
    const data = await fs.readFile(statsFilePath, 'utf-8');
    return JSON.parse(data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return {};
    }
    throw error;
  }
}

async function writeStats(stats: Record<string, QuizStats>) {
  await fs.writeFile(statsFilePath, JSON.stringify(stats, null, 2));
}

export async function quiz(question: string, isCorrect: boolean) {
  const stats = await readStats();
  const id = question.toLowerCase();

  if (!stats[id]) {
    stats[id] = {
      total: 0,
      correct: 0,
      incorrect: 0,
    };
  }

  stats[id].total += 1;
  if (isCorrect) {
    stats[id].correct += 1;
  } else {
    stats[id].incorrect += 1;
  }

  await writeStats(stats);
}