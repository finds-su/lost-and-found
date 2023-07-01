-- CreateEnum
CREATE TYPE "LostAndFoundItemStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'BLOCKED');

-- AlterTable
ALTER TABLE "LostAndFoundItem" ADD COLUMN     "status" "LostAndFoundItemStatus" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "expires" SET DEFAULT NOW() + interval '1 week';
