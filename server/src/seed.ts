import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedAdminUser } from './seeders/adminSeeder.js';
import { seedQuestions } from './seeders/questionSeeder.js';
import { seedInterests } from './seeders/interestSeeder.js';
import process from 'process';

dotenv.config();

const populateAtlasDB = async () => {
  try {
    console.log('[Atlas Seeder] Connecting to MongoDB Atlas cloud database...');
    await connectDB();

    console.log('[Atlas Seeder] Seeding Master Admin User...');
    await seedAdminUser();

    console.log('[Atlas Seeder] Seeding 50 Personality Questions...');
    await seedQuestions();

    console.log('[Atlas Seeder] Seeding World Hobbies & Interests...');
    await seedInterests();

    console.log('✅ MongoDB Atlas Cloud Database populated successfully!');
    process.exit(0);
  } catch (err: any) {
    console.error(`❌ Atlas Seeding Failed: ${err.message}`);
    process.exit(1);
  }
};

populateAtlasDB();
