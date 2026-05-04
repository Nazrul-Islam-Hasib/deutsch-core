-- CreateTable
CREATE TABLE "words" (
    "id" TEXT NOT NULL,
    "germanWord" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "article" TEXT,
    "wordType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "words_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flashcard_progress" (
    "id" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "isKnown" BOOLEAN NOT NULL DEFAULT false,
    "lastReviewed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "flashcard_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "words_germanWord_key" ON "words"("germanWord");

-- CreateIndex
CREATE UNIQUE INDEX "flashcard_progress_wordId_key" ON "flashcard_progress"("wordId");

-- AddForeignKey
ALTER TABLE "flashcard_progress" ADD CONSTRAINT "flashcard_progress_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "words"("id") ON DELETE CASCADE ON UPDATE CASCADE;
