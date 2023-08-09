-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'MODERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "LostAndFoundItemStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "PostItemReason" AS ENUM ('LOST', 'FOUND', 'ANY');

-- CreateEnum
CREATE TYPE "Campus" AS ENUM ('V78', 'S20', 'V86', 'MP1', 'SG22', 'SHP23', 'U7');

-- CreateEnum
CREATE TYPE "SocialNetwork" AS ENUM ('TELEGRAM', 'VK');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "nickname" TEXT NOT NULL,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "userInfo" VARCHAR(280),
    "role" "Role" NOT NULL DEFAULT 'USER',
    "image" TEXT,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "blockReason" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "UserSocialNetwork" (
    "id" TEXT NOT NULL,
    "socialNetwork" "SocialNetwork" NOT NULL,
    "link" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserSocialNetwork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LostAndFoundItem" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(512) NOT NULL DEFAULT '',
    "campus" "Campus" NOT NULL,
    "reason" "PostItemReason" NOT NULL,
    "status" "LostAndFoundItemStatus" NOT NULL DEFAULT 'ACTIVE',
    "images" TEXT[],
    "userId" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires" TIMESTAMP(3) NOT NULL DEFAULT NOW() + interval '1 week',
    "slug" TEXT NOT NULL,

    CONSTRAINT "LostAndFoundItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LostAndFoundItemSocialNetworks" (
    "id" TEXT NOT NULL,
    "lostAndFoundItemId" INTEGER NOT NULL,
    "userSocialNetworkId" TEXT NOT NULL,

    CONSTRAINT "LostAndFoundItemSocialNetworks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session" USING HASH ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User" USING HASH ("id");

-- CreateIndex
CREATE INDEX "User_nickname_idx" ON "User" USING HASH ("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "UserSocialNetwork_socialNetwork_userId_idx" ON "UserSocialNetwork"("socialNetwork", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSocialNetwork_userId_socialNetwork_key" ON "UserSocialNetwork"("userId", "socialNetwork");

-- CreateIndex
CREATE UNIQUE INDEX "LostAndFoundItem_slug_key" ON "LostAndFoundItem"("slug");

-- CreateIndex
CREATE INDEX "LostAndFoundItem_name_idx" ON "LostAndFoundItem" USING HASH ("name");

-- CreateIndex
CREATE UNIQUE INDEX "LostAndFoundItemSocialNetworks_lostAndFoundItemId_userSocia_key" ON "LostAndFoundItemSocialNetworks"("lostAndFoundItemId", "userSocialNetworkId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSocialNetwork" ADD CONSTRAINT "UserSocialNetwork_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LostAndFoundItem" ADD CONSTRAINT "LostAndFoundItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LostAndFoundItemSocialNetworks" ADD CONSTRAINT "LostAndFoundItemSocialNetworks_lostAndFoundItemId_fkey" FOREIGN KEY ("lostAndFoundItemId") REFERENCES "LostAndFoundItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LostAndFoundItemSocialNetworks" ADD CONSTRAINT "LostAndFoundItemSocialNetworks_userSocialNetworkId_fkey" FOREIGN KEY ("userSocialNetworkId") REFERENCES "UserSocialNetwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;
