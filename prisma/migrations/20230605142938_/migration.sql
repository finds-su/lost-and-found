/*
  Warnings:

  - You are about to drop the `UserSessionNetwork` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[lostAndFoundItemId,userSocialNetworkId]` on the table `LostAndFoundItemSocialNetworks` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "LostAndFoundItemSocialNetworks" DROP CONSTRAINT "LostAndFoundItemSocialNetworks_userSocialNetworkId_fkey";

-- DropForeignKey
ALTER TABLE "UserSessionNetwork" DROP CONSTRAINT "UserSessionNetwork_userId_fkey";

-- AlterTable
ALTER TABLE "LostAndFoundItem" ALTER COLUMN "expires" SET DEFAULT NOW() + interval '1 week';

-- DropTable
DROP TABLE "UserSessionNetwork";

-- CreateTable
CREATE TABLE "UserSocialNetwork" (
    "id" TEXT NOT NULL,
    "socialNetwork" "SocialNetwork" NOT NULL,
    "link" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserSocialNetwork_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserSocialNetwork_socialNetwork_userId_idx" ON "UserSocialNetwork"("socialNetwork", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSocialNetwork_userId_socialNetwork_key" ON "UserSocialNetwork"("userId", "socialNetwork");

-- CreateIndex
CREATE UNIQUE INDEX "LostAndFoundItemSocialNetworks_lostAndFoundItemId_userSocia_key" ON "LostAndFoundItemSocialNetworks"("lostAndFoundItemId", "userSocialNetworkId");

-- AddForeignKey
ALTER TABLE "UserSocialNetwork" ADD CONSTRAINT "UserSocialNetwork_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LostAndFoundItemSocialNetworks" ADD CONSTRAINT "LostAndFoundItemSocialNetworks_userSocialNetworkId_fkey" FOREIGN KEY ("userSocialNetworkId") REFERENCES "UserSocialNetwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;
