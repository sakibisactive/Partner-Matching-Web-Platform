import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export const runSupabaseMigrations = async (): Promise<void> => {
  const client = new Client({
    user: 'postgres.ibdwzdyehsqxuqccognm',
    password: process.env.SUPABASE_DB_PASSWORD || 'SAKIB22101641',
    host: 'aws-0-ap-southeast-2.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('[Supabase Migration] Connected to Supabase PostgreSQL database.');

    const ddl = `
      -- 1. User Table
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT PRIMARY KEY,
        "email" TEXT UNIQUE NOT NULL,
        "password" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'User',
        "isVerified" BOOLEAN NOT NULL DEFAULT FALSE,
        "failedOtpAttempts" INTEGER NOT NULL DEFAULT 0,
        "resetPasswordToken" TEXT,
        "resetPasswordExpires" TIMESTAMP WITH TIME ZONE,
        "verificationTokenExpires" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );

      -- 2. Profile Table
      CREATE TABLE IF NOT EXISTS "Profile" (
        "id" TEXT PRIMARY KEY,
        "userId" TEXT UNIQUE NOT NULL,
        "displayName" TEXT NOT NULL,
        "bio" TEXT,
        "age" INTEGER,
        "gender" TEXT,
        "occupation" TEXT,
        "location" TEXT,
        "avatarUrl" TEXT,
        "photos" JSONB DEFAULT '[]'::jsonb,
        "interests" JSONB DEFAULT '[]'::jsonb,
        "personalityAnswers" JSONB DEFAULT '[]'::jsonb,
        "completionPercentage" INTEGER NOT NULL DEFAULT 0,
        "isProfileComplete" BOOLEAN NOT NULL DEFAULT FALSE,
        "preference" JSONB DEFAULT '{}'::jsonb,
        "verified" BOOLEAN NOT NULL DEFAULT FALSE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );

      -- Add columns to Profile if table pre-existed with partial schema
      ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "occupation" TEXT;
      ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "location" TEXT;
      ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "photos" JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "interests" JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "personalityAnswers" JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "completionPercentage" INTEGER NOT NULL DEFAULT 0;
      ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "isProfileComplete" BOOLEAN NOT NULL DEFAULT FALSE;
      ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "preference" JSONB DEFAULT '{}'::jsonb;
      ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "verified" BOOLEAN NOT NULL DEFAULT FALSE;

      -- 3. Match Table
      CREATE TABLE IF NOT EXISTS "Match" (
        "id" TEXT PRIMARY KEY,
        "profileAId" TEXT NOT NULL,
        "profileBId" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'pending',
        "score" DOUBLE PRECISION,
        "matchBreakdown" JSONB DEFAULT '{}'::jsonb,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
      ALTER TABLE "Match" ADD COLUMN IF NOT EXISTS "matchBreakdown" JSONB DEFAULT '{}'::jsonb;
      ALTER TABLE "Match" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();

      -- 4. Chat Table
      CREATE TABLE IF NOT EXISTS "Chat" (
        "id" TEXT PRIMARY KEY,
        "participants" TEXT[] NOT NULL DEFAULT '{}',
        "lastMessage" JSONB,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );

      -- 5. Message Table
      CREATE TABLE IF NOT EXISTS "Message" (
        "id" TEXT PRIMARY KEY,
        "chatId" TEXT,
        "senderId" TEXT,
        "content" TEXT,
        "readBy" TEXT[] NOT NULL DEFAULT '{}',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
      ALTER TABLE "Message" ADD COLUMN IF NOT EXISTS "chatId" TEXT;
      ALTER TABLE "Message" ADD COLUMN IF NOT EXISTS "senderId" TEXT;
      ALTER TABLE "Message" ADD COLUMN IF NOT EXISTS "content" TEXT;
      ALTER TABLE "Message" ADD COLUMN IF NOT EXISTS "readBy" TEXT[] NOT NULL DEFAULT '{}';

      -- 6. Like Table
      CREATE TABLE IF NOT EXISTS "Like" (
        "id" TEXT PRIMARY KEY,
        "senderId" TEXT NOT NULL,
        "receiverId" TEXT NOT NULL,
        "isSuperLike" BOOLEAN NOT NULL DEFAULT FALSE,
        "status" TEXT NOT NULL DEFAULT 'pending',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );

      -- 7. Interest Table
      CREATE TABLE IF NOT EXISTS "Interest" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT UNIQUE NOT NULL,
        "category" TEXT NOT NULL DEFAULT 'General',
        "icon" TEXT,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );

      -- 8. Question Table
      CREATE TABLE IF NOT EXISTS "Question" (
        "id" TEXT PRIMARY KEY,
        "questionNumber" INTEGER UNIQUE,
        "question" TEXT,
        "questionText" TEXT,
        "trait" TEXT,
        "category" TEXT DEFAULT 'General',
        "weight" DOUBLE PRECISION DEFAULT 1.0,
        "options" JSONB DEFAULT '[]'::jsonb,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
      ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "questionNumber" INTEGER;
      ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "question" TEXT;
      ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "category" TEXT DEFAULT 'General';
      ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "weight" DOUBLE PRECISION DEFAULT 1.0;

      -- 9. Report Table
      CREATE TABLE IF NOT EXISTS "Report" (
        "id" TEXT PRIMARY KEY,
        "reporterId" TEXT NOT NULL,
        "reportedUserId" TEXT NOT NULL,
        "reason" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'pending',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );

      -- 10. Notification Table
      CREATE TABLE IF NOT EXISTS "Notification" (
        "id" TEXT PRIMARY KEY,
        "recipientId" TEXT NOT NULL,
        "senderId" TEXT,
        "type" TEXT NOT NULL DEFAULT 'system',
        "message" TEXT NOT NULL,
        "read" BOOLEAN NOT NULL DEFAULT FALSE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );

      -- Useful indexes
      CREATE INDEX IF NOT EXISTS "idx_user_email" ON "User"("email");
      CREATE INDEX IF NOT EXISTS "idx_profile_userId" ON "Profile"("userId");
      CREATE INDEX IF NOT EXISTS "idx_like_sender_receiver" ON "Like"("senderId", "receiverId");
      CREATE INDEX IF NOT EXISTS "idx_message_chatId" ON "Message"("chatId");
      CREATE INDEX IF NOT EXISTS "idx_notification_recipient" ON "Notification"("recipientId");
    `;

    await client.query(ddl);
    console.log('[Supabase Migration] All 10 tables and indexes successfully ensured in Supabase PostgreSQL!');
  } catch (error: any) {
    console.error('[Supabase Migration Error]', error.message);
    throw error;
  } finally {
    await client.end();
  }
};

if (process.argv[1] && process.argv[1].includes('migrateSupabase')) {
  runSupabaseMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
