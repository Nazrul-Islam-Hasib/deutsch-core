/*
  Warnings:

  - A unique constraint covering the columns `[germanWord,userId]` on the table `words` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `words` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Insert default user (password is 'Deutsch_Core@1234' hashed with bcrypt, round 10)
-- For migration purposes, I can use a placeholder or just use a fixed ID.
-- I'll use a specific UUID for the default user.
INSERT INTO "users" ("id", "email", "password") VALUES ('default-user-id', 'nazrulhasib@gmial.com', '$2b$10$h.NyuDhh3vTKKrEh2R3KtO.R/lu3yAi3vzO9Oj7UxyRY.6yNb.TTK');

-- AlterTable
ALTER TABLE "words" ADD COLUMN "userId" TEXT;
UPDATE "words" SET "userId" = 'default-user-id';
ALTER TABLE "words" ALTER COLUMN "userId" SET NOT NULL;

-- DropIndex
DROP INDEX "words_germanWord_key";

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "words_germanWord_userId_key" ON "words"("germanWord", "userId");

-- AddForeignKey
ALTER TABLE "words" ADD CONSTRAINT "words_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
