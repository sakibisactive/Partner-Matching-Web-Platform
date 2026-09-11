import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { prisma } from '../config/prisma.js';
import { computeCompatibility } from '../algorithms/matchingEngine.js';

export const discoverUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentUserId = req.user!.id;
    const {
      page = 1,
      limit = 10,
      minAge,
      maxAge,
      gender,
      sortBy = 'compatibility',
    } = req.query;

    let myProfile = await prisma.profile.findUnique({ where: { userId: currentUserId } });
    if (!myProfile) {
      myProfile = await prisma.profile.create({
        data: {
          userId: currentUserId,
          displayName: req.user!.name,
          age: 24,
          gender: 'Male',
          isProfileComplete: false,
          completionPercentage: 15,
        },
      });
    }

    const whereClause: any = {
      userId: { not: currentUserId },
    };

    if (gender && typeof gender === 'string') {
      whereClause.gender = gender;
    }

    if (minAge || maxAge) {
      whereClause.age = {};
      if (minAge) whereClause.age.gte = parseInt(minAge as string, 10);
      if (maxAge) whereClause.age.lte = parseInt(maxAge as string, 10);
    }

    const rawProfiles = await prisma.profile.findMany({
      where: whereClause,
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
    });

    let results = rawProfiles.map((candidate) => {
      const breakdown = computeCompatibility(myProfile as any, candidate as any);
      return {
        candidateId: candidate.userId,
        user: {
          ...candidate.user,
          _id: candidate.user.id,
        },
        profile: candidate,
        compatibilityScore: breakdown.finalScore,
        breakdown,
      };
    });

    // Sorting
    if (sortBy === 'newest') {
      results.sort(
        (a, b) =>
          new Date(b.user.createdAt).getTime() - new Date(a.user.createdAt).getTime()
      );
    } else {
      results.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10) || 10));
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedResults = results.slice(startIndex, startIndex + limitNum);

    res.status(200).json({
      success: true,
      isProfileComplete: true,
      completionPercentage: 100,
      missingSections: [],
      total: results.length,
      page: pageNum,
      totalPages: Math.ceil(results.length / limitNum) || 1,
      count: paginatedResults.length,
      users: paginatedResults,
    });
  } catch (err: any) {
    next(err);
  }
};

export const deleteMyAccount = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user!;

    if (user.role === 'Admin') {
      res.status(403).json({
        success: false,
        message: 'Master Admin accounts cannot be self-deleted to maintain platform administration.',
      });
      return;
    }

    const userId = user.id;

    // PostgreSQL Foreign Key Cascades handle profile, likes, reports, notifications
    await prisma.user.delete({
      where: { id: userId },
    });

    // Clean up chats where user was a participant
    const chats = await prisma.chat.findMany({
      where: { participants: { has: userId } },
    });
    for (const chat of chats) {
      await prisma.chat.delete({ where: { id: chat.id } });
    }

    res.status(200).json({
      success: true,
      message: 'Your account and all associated data have been permanently deleted from Supabase.',
    });
  } catch (err: any) {
    next(err);
  }
};
