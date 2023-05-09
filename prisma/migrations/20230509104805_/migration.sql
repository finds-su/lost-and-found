/*
  Warnings:

  - You are about to drop the column `isBlockedUntil` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LostAndFoundItem" ALTER COLUMN "expires" SET DEFAULT NOW() + interval '1 week';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isBlockedUntil",
ADD COLUMN     "isBlocked" BOOLEAN NOT NULL DEFAULT false;
