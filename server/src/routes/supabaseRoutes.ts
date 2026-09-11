import { Router, Request, Response } from 'express';
import { getSupabaseServerStatus } from '../config/supabase.js';
import { getPrismaStatus, prisma } from '../config/prisma.js';
import { getFirebaseServerStatus } from '../config/firebase.js';
import { protect, AuthRequest } from '../middlewares/authMiddleware.js';

const router = Router();

// GET /api/supabase/status - Return health/configuration of Supabase, Prisma, and Firebase
router.get('/status', async (req: Request, res: Response) => {
  let prismaDbConnected = false;
  let profileCount = 0;

  try {
    if (process.env.DATABASE_URL) {
      profileCount = await prisma.profile.count();
      prismaDbConnected = true;
    }
  } catch (error: any) {
    prismaDbConnected = false;
  }

  res.status(200).json({
    supabase: getSupabaseServerStatus(),
    prisma: {
      ...getPrismaStatus(),
      connected: prismaDbConnected,
      profileCount,
    },
    firebase: getFirebaseServerStatus(),
    timestamp: new Date().toISOString(),
  });
});

// GET /api/supabase/profiles - Fetch profiles from Supabase Postgres via Prisma (Protected)
router.get('/profiles', protect, async (req: AuthRequest, res: Response) => {
  try {
    const profiles = await prisma.profile.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        sentMatches: true,
        receivedMatches: true,
      },
    });
    res.status(200).json({ success: true, count: profiles.length, data: profiles });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/supabase/sync-profile - Sync a profile into Supabase Postgres (Protected)
router.post('/sync-profile', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { userId, displayName, bio, age, gender, avatarUrl } = req.body;
    const currentUserId = req.user!._id.toString();

    // Verify ownership or Admin privilege
    if (userId !== currentUserId && req.user!.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'You can only sync your own profile' });
    }

    if (!userId || !displayName) {
      return res.status(400).json({ success: false, message: 'userId and displayName are required' });
    }

    const profile = await prisma.profile.upsert({
      where: { userId },
      update: {
        displayName,
        bio: bio || null,
        age: age ? Number(age) : null,
        gender: gender || null,
        avatarUrl: avatarUrl || null,
      },
      create: {
        userId,
        displayName,
        bio: bio || null,
        age: age ? Number(age) : null,
        gender: gender || null,
        avatarUrl: avatarUrl || null,
      },
    });

    res.status(200).json({ success: true, profile });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
