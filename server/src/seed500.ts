import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { Profile } from './models/Profile.js';
import { Interest } from './models/Interest.js';
import bcrypt from 'bcryptjs';
import process from 'process';

dotenv.config();

const firstNamesMale = [
  'Liam', 'Noah', 'Oliver', 'James', 'Elijah', 'William', 'Henry', 'Lucas', 'Benjamin', 'Theodore',
  'Mateo', 'Levi', 'Sebastian', 'Daniel', 'Jack', 'Alexander', 'Owen', 'Asher', 'Samuel', 'Ethan',
  'Leo', 'Jackson', 'Mason', 'Ezra', 'John', 'Hudson', 'Luca', 'David', 'Jacob', 'Logan',
  'Sakib', 'Aarav', 'Rohan', 'Zayd', 'Tariq', 'Hiroshi', 'Kenji', 'Carlos', 'Diego', 'Mateo',
  'Siddharth', 'Vikram', 'Dmitri', 'Antoine', 'Lukas', 'Matteo', 'Hans', 'Gabriel', 'Julian', 'Kai'
];

const firstNamesFemale = [
  'Olivia', 'Emma', 'Charlotte', 'Amelia', 'Sophia', 'Mia', 'Isabella', 'Ava', 'Evelyn', 'Harper',
  'Luna', 'Camila', 'Gianna', 'Elizabeth', 'Eleanor', 'Ella', 'Abigail', 'Sofia', 'Avery', 'Scarlett',
  'Emily', 'Aria', 'Penelope', 'Chloe', 'Layla', 'Mila', 'Nora', 'Hazel', 'Madison', 'Ellie',
  'Ananya', 'Zara', 'Priya', 'Aisha', 'Mei', 'Yuki', 'Lucia', 'Elena', 'Valentina', 'Fatima',
  'Astrid', 'Freja', 'Sora', 'Chloe', 'Katarina', 'Nadia', 'Ingrid', 'Isla', 'Hannah', 'Maya'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Rahman', 'Khan', 'Ahmed', 'Patel', 'Sharma', 'Takahashi', 'Mueller', 'Dubois', 'Novak', 'Silva'
];

const cities = [
  { city: 'New York', country: 'USA', coords: [-74.006, 40.7128] },
  { city: 'London', country: 'UK', coords: [-0.1278, 51.5074] },
  { city: 'Paris', country: 'France', coords: [2.3522, 48.8566] },
  { city: 'Tokyo', country: 'Japan', coords: [139.6917, 35.6895] },
  { city: 'Sydney', country: 'Australia', coords: [151.2093, -33.8688] },
  { city: 'Toronto', country: 'Canada', coords: [-79.3832, 43.6532] },
  { city: 'Berlin', country: 'Germany', coords: [13.405, 52.52] },
  { city: 'Dubai', country: 'UAE', coords: [55.2708, 25.2048] },
  { city: 'Singapore', country: 'Singapore', coords: [103.8198, 1.3521] },
  { city: 'Dhaka', country: 'Bangladesh', coords: [90.4125, 23.8103] },
];

const occupations = [
  'Software Engineer', 'Product Designer', 'Data Scientist', 'Architect', 'Financial Analyst',
  'Photographer', 'Marketing Manager', 'Doctor', 'Lawyer', 'Journalist', 'Chef', 'Entrepreneur',
  'UX Researcher', 'Pilot', 'Biologist', 'Musician', 'Graphic Artist', 'Professor', 'Fitness Trainer'
];

const educations = [
  'B.Sc Computer Science', 'M.A Fine Arts', 'MBA Finance', 'Ph.D Biotechnology',
  'B.Arch Architecture', 'B.A Communication', 'M.Sc Artificial Intelligence', 'MD Medicine'
];

const samplePhotosMale = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600'
];

const samplePhotosFemale = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=600'
];

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

const populate500Users = async () => {
  try {
    console.log('[500 Users Seeder] Connecting to MongoDB Atlas cloud database...');
    await connectDB();

    const existingCount = await User.countDocuments();
    console.log(`[500 Users Seeder] Current total users in DB: ${existingCount}`);

    const dbInterests = await Interest.find({});
    const interestIds = dbInterests.map((i) => i._id);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const usersToInsert: any[] = [];
    const profilesToInsert: any[] = [];

    console.log('[500 Users Seeder] Generating 500 user objects & 5D personality vectors...');

    for (let i = 1; i <= 500; i++) {
      const isFemale = i % 2 === 0;
      const firstName = isFemale ? getRandomElement(firstNamesFemale) : getRandomElement(firstNamesMale);
      const lastName = getRandomElement(lastNames);
      const name = `${firstName} ${lastName}`;
      const email = `user${i}_${Date.now()}@soulsync.com`;
      const gender = isFemale ? 'Female' : 'Male';
      const age = getRandomInt(20, 45);
      const loc = getRandomElement(cities);

      const userId = new (User as any).base.Types.ObjectId();

      usersToInsert.push({
        _id: userId,
        name,
        email,
        password: hashedPassword,
        role: 'User',
        isVerified: i % 3 === 0, // 33% verified checkmark
        status: 'active',
        createdAt: new Date(Date.now() - getRandomInt(1, 90) * 24 * 60 * 60 * 1000),
      });

      // 50 Personality Answers (1-5 scale)
      const personalityAnswers = Array.from({ length: 50 }, (_, idx) => ({
        questionNumber: idx + 1,
        answer: getRandomInt(1, 5),
      }));

      // Pick 4-8 random world hobbies
      const randomHobbies = Array.from(
        new Set(Array.from({ length: getRandomInt(4, 8) }, () => getRandomElement(interestIds)))
      );

      const photoUrl = isFemale ? getRandomElement(samplePhotosFemale) : getRandomElement(samplePhotosMale);

      profilesToInsert.push({
        userId,
        bio: `Hi there! I'm ${firstName}, living in ${loc.city}. Passionate about ${getRandomElement(occupations).toLowerCase()}, adventure, and deep connections.`,
        age,
        gender,
        height: getRandomInt(160, 190),
        education: getRandomElement(educations),
        occupation: getRandomElement(occupations),
        city: loc.city,
        country: loc.country,
        location: {
          type: 'Point',
          coordinates: loc.coords,
        },
        lifestyle: {
          smoking: getRandomElement(['Never', 'Occasionally', 'Regularly']),
          drinking: getRandomElement(['Never', 'Socially', 'Regularly']),
          exercise: getRandomElement(['Never', 'Sometimes', 'Often', 'Daily']),
          diet: getRandomElement(['Anything', 'Vegetarian', 'Vegan', 'Halal']),
          pets: getRandomElement(['None', 'Cat', 'Dog', 'Both', 'Lover']),
        },
        socialLinks: {
          facebook: i % 2 === 0 ? `https://facebook.com/${firstName.toLowerCase()}.${lastName.toLowerCase()}` : '',
          instagram: i % 3 === 0 ? `@${firstName.toLowerCase()}_${lastName.toLowerCase()}` : '',
          whatsapp: i % 4 === 0 ? `+1${getRandomInt(2000000000, 9999999999)}` : '',
        },
        isPremium: i % 5 === 0,
        membershipTier: i % 5 === 0 ? (i % 2 === 0 ? 'VIP' : 'Gold') : 'Free',
        personalityAnswers,
        interests: randomHobbies,
        preferences: {
          minAge: Math.max(18, age - 5),
          maxAge: Math.min(65, age + 8),
          gender: [isFemale ? 'Male' : 'Female'],
          maxDistanceKm: 100,
          relationshipType: ['Long-term'],
          interests: [],
        },
        photos: [
          {
            url: photoUrl,
            isMain: true,
          },
        ],
      });
    }

    console.log('[500 Users Seeder] Inserting 500 User documents to MongoDB Atlas...');
    await User.insertMany(usersToInsert);

    console.log('[500 Users Seeder] Inserting 500 Profile documents to MongoDB Atlas...');
    await Profile.insertMany(profilesToInsert);

    const totalCount = await User.countDocuments();
    console.log(`✅ SUCCESS! Database successfully populated with 500 realistic users! Total users now in DB: ${totalCount}`);
    process.exit(0);
  } catch (err: any) {
    console.error(`❌ 500 Users Seeding Error: ${err.message}`);
    process.exit(1);
  }
};

populate500Users();
