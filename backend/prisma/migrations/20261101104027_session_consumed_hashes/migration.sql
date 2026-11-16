-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "consumedHashes" TEXT[] DEFAULT ARRAY[]::TEXT[];
