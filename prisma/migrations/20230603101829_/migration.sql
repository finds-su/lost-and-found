/*
  Warnings:

  - You are about to drop the column `telegramLink` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SocialNetwork" AS ENUM ('TELEGRAM', 'VK');

-- AlterTable
ALTER TABLE "LostAndFoundItem" ALTER COLUMN "expires" SET DEFAULT NOW() + interval '1 week';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "telegramLink";

-- CreateTable
CREATE TABLE "UserSessionNetwork" (
    "id" TEXT NOT NULL,
    "socialNetwork" "SocialNetwork" NOT NULL,
    "link" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserSessionNetwork_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserSessionNetwork" ADD CONSTRAINT "UserSessionNetwork_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
