import prisma from '../utils/prisma';

export const generateQuiz = async (limit: number = 5) => {
  // Get all words
  const allWords = await prisma.word.findMany();
  
  if (allWords.length < 4) {
    throw new Error('Not enough words to generate a quiz. Add at least 4 words.');
  }

  // Shuffle and pick 'limit' words for questions
  const shuffled = allWords.sort(() => 0.5 - Math.random());
  const selectedWords = shuffled.slice(0, Math.min(limit, allWords.length));

  const questions = selectedWords.map((word) => {
    // Select 3 random distractors from other words
    const distractors = allWords
      .filter((w) => w.id !== word.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((w) => w.translation);

    const options = [word.translation, ...distractors].sort(() => 0.5 - Math.random());

    return {
      wordId: word.id,
      germanWord: word.germanWord,
      article: word.article,
      correctAnswer: word.translation,
      options,
    };
  });

  return questions;
};
