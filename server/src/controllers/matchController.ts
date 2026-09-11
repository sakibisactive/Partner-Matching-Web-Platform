import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { prisma } from '../config/prisma.js';
import { computeCompatibility } from '../algorithms/matchingEngine.js';

export const computeMatches = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentUserId = req.user!.id;

    let myProfile = await prisma.profile.findUnique({ where: { userId: currentUserId } });
    if (!myProfile) {
      myProfile = await prisma.profile.create({
        data: {
          userId: currentUserId,
          displayName: req.user!.name,
          age: 24,
          gender: 'Male',
        },
      });
    }

    const candidateProfiles = await prisma.profile.findMany({
      where: {
        userId: { not: currentUserId },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
            isVerified: true,
            createdAt: true,
          },
        },
      },
      take: 100,
    });

    const matchResults: any[] = [];

    for (const candidate of candidateProfiles) {
      const breakdown = computeCompatibility(myProfile as any, candidate as any);

      matchResults.push({
        candidateId: candidate.userId,
        user: {
          ...candidate.user,
          _id: candidate.user.id,
        },
        profile: candidate,
        compatibilityScore: breakdown.finalScore,
        breakdown,
      });
    }

    // Sort by compatibility score descending and limit to top 20
    matchResults.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    const top20Matches = matchResults.slice(0, 20);

    // Save/upsert matches asynchronously into Supabase PostgreSQL
    for (const m of top20Matches) {
      prisma.match
        .upsert({
          where: {
            profileAId_profileBId: {
              profileAId: myProfile.id,
              profileBId: m.profile.id,
            },
          },
          update: {
            score: m.compatibilityScore,
            matchBreakdown: m.breakdown,
          },
          create: {
            profileAId: myProfile.id,
            profileBId: m.profile.id,
            score: m.compatibilityScore,
            matchBreakdown: m.breakdown,
          },
        })
        .catch(() => {});
    }

    res.status(200).json({
      success: true,
      isProfileComplete: true,
      completionPercentage: 100,
      missingSections: [],
      count: top20Matches.length,
      matches: top20Matches,
    });
  } catch (err: any) {
    next(err);
  }
};

export const getMatchById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentUserId = req.user!.id;
    const targetUserId = req.params.targetUserId as string;

    if (!targetUserId) {
      res.status(400).json({ success: false, message: 'Invalid user identifier' });
      return;
    }

    const myProfile = await prisma.profile.findUnique({ where: { userId: currentUserId } });
    const targetProfile = await prisma.profile.findUnique({
      where: { userId: targetUserId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
            isVerified: true,
          },
        },
      },
    });

    if (!myProfile || !targetProfile) {
      res.status(404).json({ success: false, message: 'Profile not found' });
      return;
    }

    const breakdown = computeCompatibility(myProfile as any, targetProfile as any);
    const targetUser = (targetProfile as any).user;

    res.status(200).json({
      success: true,
      user: targetUser ? { ...targetUser, _id: targetUser.id } : null,
      profile: targetProfile,
      compatibilityScore: breakdown.finalScore,
      breakdown,
    });
  } catch (err: any) {
    next(err);
  }
};
