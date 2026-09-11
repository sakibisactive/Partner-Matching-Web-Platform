import { prisma } from '../config/prisma.js';
import bcrypt from 'bcryptjs';

export const seedAdminUser = async (): Promise<void> => {
  try {
    const adminEmail = 'admin@findtruluv.com';
    const adminPassword = 'findtruluvwithsakib';

    let admin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!admin) {
      console.log('[Seeder] Creating FIND TRU LUV Default Master Admin Account in Supabase...');
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      admin = await prisma.user.create({
        data: {
          name: 'FIND TRU LUV Master Admin',
          email: adminEmail,
          password: hashedPassword,
          role: 'Admin',
          isVerified: true,
        },
      });

      await prisma.profile.create({
        data: {
          userId: admin.id,
          displayName: 'Master Admin',
          age: 30,
          gender: 'Male',
          bio: 'FIND TRU LUV Platform Administrator and Master Moderator.',
          location: 'Global Headquarters',
          photos: [
            {
              url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
              isMain: true,
            },
          ],
          isProfileComplete: true,
          completionPercentage: 100,
        },
      });

      console.log(`[Seeder] Master Admin verified for: ${adminEmail}`);
    } else {
      await prisma.user.update({
        where: { id: admin.id },
        data: {
          role: 'Admin',
          isVerified: true,
        },
      });
    }
  } catch (err: any) {
    console.error(`[Admin Seeder Error]: ${err.message}`);
  }
};
