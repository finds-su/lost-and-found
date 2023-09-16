-- AlterTable
ALTER TABLE "LostAndFoundItem" ADD COLUMN     "isInStoragePlace" BOOLEAN DEFAULT false,
ALTER COLUMN "expires" SET DEFAULT NOW() + interval '1 week';
