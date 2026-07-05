import { Interest } from '../models/Interest.js';

export const seedInterests = async (): Promise<void> => {
  try {
    const defaultInterests = [
      // Sports & Athletics
      { name: 'Football', category: 'Sports' },
      { name: 'Cricket', category: 'Sports' },
      { name: 'Basketball', category: 'Sports' },
      { name: 'Tennis', category: 'Sports' },
      { name: 'Badminton', category: 'Sports' },
      { name: 'Swimming', category: 'Sports' },
      { name: 'Table Tennis', category: 'Sports' },
      { name: 'Volleyball', category: 'Sports' },
      { name: 'Golf', category: 'Sports' },
      { name: 'Martial Arts', category: 'Sports' },

      // Outdoor & Adventure
      { name: 'Hiking', category: 'Outdoor & Adventure' },
      { name: 'Camping', category: 'Outdoor & Adventure' },
      { name: 'Rock Climbing', category: 'Outdoor & Adventure' },
      { name: 'Bouldering', category: 'Outdoor & Adventure' },
      { name: 'Fishing', category: 'Outdoor & Adventure' },
      { name: 'Cycling', category: 'Outdoor & Adventure' },
      { name: 'Scuba Diving', category: 'Outdoor & Adventure' },
      { name: 'Surfing', category: 'Outdoor & Adventure' },

      // Arts, Crafts & Creativity
      { name: 'Photography', category: 'Arts & Crafts' },
      { name: 'Painting', category: 'Arts & Crafts' },
      { name: 'Sculpting', category: 'Arts & Crafts' },
      { name: 'Calligraphy', category: 'Arts & Crafts' },
      { name: 'Drawing & Sketching', category: 'Arts & Crafts' },
      { name: 'Pottery', category: 'Arts & Crafts' },

      // Music & Performing
      { name: 'Music', category: 'Music & Performing' },
      { name: 'Guitar', category: 'Music & Performing' },
      { name: 'Piano', category: 'Music & Performing' },
      { name: 'Singing', category: 'Music & Performing' },
      { name: 'Dancing', category: 'Music & Performing' },
      { name: 'Theater & Acting', category: 'Music & Performing' },

      // Entertainment & Gaming
      { name: 'Gaming', category: 'Gaming & Tech' },
      { name: 'Anime', category: 'Entertainment' },
      { name: 'Movies & Cinema', category: 'Entertainment' },
      { name: 'Board Games', category: 'Gaming & Tech' },
      { name: 'Chess', category: 'Gaming & Tech' },
      { name: 'Esports', category: 'Gaming & Tech' },
      { name: 'Blogging & Podcasting', category: 'Gaming & Tech' },
      { name: 'Coding', category: 'Gaming & Tech' },

      // Culinary & Lifestyle
      { name: 'Cooking', category: 'Culinary' },
      { name: 'Baking', category: 'Culinary' },
      { name: 'Wine Tasting', category: 'Culinary' },
      { name: 'Coffee Brewing', category: 'Culinary' },

      // Health & Wellness
      { name: 'Fitness', category: 'Health & Wellness' },
      { name: 'Yoga', category: 'Health & Wellness' },
      { name: 'Meditation', category: 'Health & Wellness' },
      { name: 'Pilates', category: 'Health & Wellness' },

      // Culture & Learning
      { name: 'Traveling', category: 'Travel & Culture' },
      { name: 'Reading', category: 'Learning & Literature' },
      { name: 'Astronomy', category: 'Learning & Literature' },
      { name: 'Languages', category: 'Travel & Culture' },
      { name: 'Gardening', category: 'Lifestyle' },
      { name: 'Pet Care & Animal Training', category: 'Lifestyle' },
    ];

    for (const item of defaultInterests) {
      await Interest.findOneAndUpdate(
        { name: item.name },
        { name: item.name, category: item.category },
        { upsert: true, new: true }
      );
    }
    console.log(`[Seeder] ${defaultInterests.length} World Hobbies and Interest options synced!`);
  } catch (err: any) {
    console.error(`[Seeder Error] Failed to seed interests: ${err.message}`);
  }
};
