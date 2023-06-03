-- AlterTable
ALTER TABLE "LostAndFoundItem" ALTER COLUMN "expires" SET DEFAULT NOW() + interval '1 week';

-- CreateTable
CREATE TABLE "LostAndFoundItemSocialNetworks" (
    "id" TEXT NOT NULL,
    "lostAndFoundItemId" TEXT NOT NULL,
    "userSocialNetworkId" TEXT NOT NULL,

    CONSTRAINT "LostAndFoundItemSocialNetworks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LostAndFoundItemSocialNetworks" ADD CONSTRAINT "LostAndFoundItemSocialNetworks_lostAndFoundItemId_fkey" FOREIGN KEY ("lostAndFoundItemId") REFERENCES "LostAndFoundItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LostAndFoundItemSocialNetworks" ADD CONSTRAINT "LostAndFoundItemSocialNetworks_userSocialNetworkId_fkey" FOREIGN KEY ("userSocialNetworkId") REFERENCES "UserSessionNetwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;
