import prisma from '../utils/prisma';

export const createWord = async (
  userId: string,
  data: {
    germanWord: string;
    translation: string;
    article?: string;
    wordType?: string;
  }
) => {
  return await prisma.word.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const getAllWords = async (
  userId: string,
  search?: string,
  page: number = 1,
  limit: number = 20
) => {
  const skip = (page - 1) * limit;
  const where: any = {
    userId,
  };

  if (search) {
    where['OR'] = [
      { germanWord: { contains: search, mode: 'insensitive' } },
      { translation: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [words, total] = await Promise.all([
    prisma.word.findMany({
      where,
      include: {
        progress: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.word.count({ where }),
  ]);

  return {
    words,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getWordById = async (id: string, userId: string) => {
  return await prisma.word.findFirst({
    where: { id, userId },
    include: {
      progress: true,
    },
  });
};

export const updateWordProgress = async (wordId: string, userId: string, isKnown: boolean) => {
  // Ensure the word belongs to the user
  const word = await prisma.word.findFirst({
    where: { id: wordId, userId },
  });

  if (!word) {
    throw new Error('Word not found or unauthorized');
  }

  return await prisma.flashcardProgress.upsert({
    where: { wordId },
    update: {
      isKnown,
      lastReviewed: new Date(),
      reviewCount: { increment: 1 },
    },
    create: {
      wordId,
      isKnown,
      lastReviewed: new Date(),
      reviewCount: 1,
    },
  });
};

export const updateWord = async (
  id: string,
  userId: string,
  data: {
    germanWord?: string;
    translation?: string;
    article?: string;
    wordType?: string;
  }
) => {
  // Ensure the word belongs to the user
  const word = await prisma.word.findFirst({
    where: { id, userId },
  });

  if (!word) {
    throw new Error('Word not found or unauthorized');
  }

  return await prisma.word.update({
    where: { id },
    data,
  });
};

export const deleteWord = async (id: string, userId: string) => {
  // Ensure the word belongs to the user
  const word = await prisma.word.findFirst({
    where: { id, userId },
  });

  if (!word) {
    throw new Error('Word not found or unauthorized');
  }

  return await prisma.word.delete({
    where: { id },
  });
};
