-- Add optional credentials so existing user records remain valid.
ALTER TABLE "User"
ADD COLUMN "username" TEXT,
ADD COLUMN "passwordHash" TEXT;

CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
