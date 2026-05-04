import prisma from '../utils/prisma';

export const createWord = async (data: {
  germanWord: string;
  translation: string;
  article?: string;
  wordType?: string;
}) => {
  return await prisma.word.create({
    data,
  });
};

export const getAllWords = async (search?: string, page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;
  const where = search
    ? {
        OR: [
          { germanWord: { contains: search } },
          { translation: { contains: search } },
        ],
      }
    : {};

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

export const getWordById = async (id: string) => {
  return await prisma.word.findUnique({
    where: { id },
    include: {
      progress: true,
    },
  });
};

export const updateWordProgress = async (wordId: string, isKnown: boolean) => {
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
  data: {
    germanWord?: string;
    translation?: string;
    article?: string;
    wordType?: string;
  }
) => {
  return await prisma.word.update({
    where: { id },
    data,
  });
};

export const deleteWord = async (id: string) => {
  return await prisma.word.delete({
    where: { id },
  });
};
