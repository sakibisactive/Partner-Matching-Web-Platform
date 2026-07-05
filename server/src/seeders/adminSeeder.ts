import { User } from '../models/User.js';
import { Profile } from '../models/Profile.js';

export const seedAdminUser = async (): Promise<void> => {
  try {
    const adminEmail = 'admin@findtruluv.com';
    const adminPassword = 'findtruluvwithsakib';

    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      console.log('[Seeder] Creating FIND TRU LUV Default Master Admin Account...');
      admin = await User.create({
        name: 'FIND TRU LUV Master Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'Admin',
        isVerified: true,
        status: 'active',
      });

      await Profile.create({
        userId: admin._id,
        age: 30,
        gender: 'Male',
        bio: 'FIND TRU LUV Platform Administrator and Master Moderator.',
        city: 'Global Headquarters',
        country: 'Worldwide',
        isPremium: true,
        membershipTier: 'VIP',
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
            isMain: true,
          },
        ],
      });

      console.log(`[Seeder] Master Admin created: ${adminEmail} / ${adminPassword}`);
    } else {
      // Ensure role is Admin and status is active
      admin.role = 'Admin';
      admin.status = 'active';
      admin.isVerified = true;
      await admin.save();
    }
  } catch (err: any) {
    console.error(`[Admin Seeder Error]: ${err.message}`);
  }
};
