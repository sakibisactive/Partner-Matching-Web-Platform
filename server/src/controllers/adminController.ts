import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { prisma } from '../config/prisma.js';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 50));
    const skip = (page - 1) * limit;

    const totalCount = await prisma.user.count();
    const users = await prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        profile: true,
      },
    });

    const enrichedUsers = users.map((u) => ({
      _id: u.id,
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      isVerified: u.isVerified,
      createdAt: u.createdAt,
      profile: u.profile || null,
    }));

    res.status(200).json({
      success: true,
      count: enrichedUsers.length,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit) || 1,
      users: enrichedUsers,
    });
  } catch (err: any) {
    next(err);
  }
};

export const getUserFullDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, isVerified: true, createdAt: true },
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const profile = await prisma.profile.findUnique({ where: { userId: id } });

    res.status(200).json({
      success: true,
      user: { ...user, _id: user.id },
      profile,
    });
  } catch (err: any) {
    next(err);
  }
};

export const banUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (req.user && req.user.id === id) {
      res.status(400).json({ success: false, message: 'Administrators cannot ban their own account' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isVerified: !user.isVerified },
    });

    res.status(200).json({
      success: true,
      message: `User status updated`,
      isVerified: updated.isVerified,
    });
  } catch (err: any) {
    next(err);
  }
};

export const verifyUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;

    const user = await prisma.user.update({
      where: { id },
      data: { isVerified: true },
    });

    res.status(200).json({ success: true, message: 'User badge verified by Admin in Supabase', user });
  } catch (err: any) {
    next(err);
  }
};

export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (req.user && req.user.id === id) {
      res.status(400).json({ success: false, message: 'Administrators cannot delete their own account' });
      return;
    }

    await prisma.user.delete({ where: { id } });

    res.status(200).json({ success: true, message: 'User and all associated profile data permanently deleted from Supabase' });
  } catch (err: any) {
    next(err);
  }
};

export const getReports = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reports = await prisma.report.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        reportedUser: { select: { id: true, name: true, email: true } },
      },
    });

    const formattedReports = reports.map((r) => ({
      ...r,
      _id: r.id,
      reporter: r.reporter ? { ...r.reporter, _id: r.reporter.id } : null,
      reportedUser: r.reportedUser ? { ...r.reportedUser, _id: r.reportedUser.id } : null,
    }));

    res.status(200).json({ success: true, count: formattedReports.length, reports: formattedReports });
  } catch (err: any) {
    next(err);
  }
};

export const resolveReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reportId = req.params.reportId as string;
    const { status } = req.body;

    const report = await prisma.report.update({
      where: { id: reportId },
      data: { status: status || 'resolved' },
    });

    res.status(200).json({ success: true, message: 'Report status updated in Supabase', report });
  } catch (err: any) {
    next(err);
  }
};

export const createInterest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, category } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      res.status(400).json({ success: false, message: 'Interest name is required' });
      return;
    }

    const newInterest = await prisma.interest.create({
      data: {
        name: name.trim(),
        category: category || 'General',
      },
    });

    res.status(201).json({ success: true, interest: { ...newInterest, _id: newInterest.id } });
  } catch (err: any) {
    next(err);
  }
};

export const deleteInterest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;

    await prisma.interest.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Interest tag deleted from Supabase' });
  } catch (err: any) {
    next(err);
  }
};

export const getAdminAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({ where: { isVerified: true } });
    const totalMatches = await prisma.match.count();
    const pendingReports = await prisma.report.count({ where: { status: 'pending' } });

    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        activeUsers,
        totalMatches,
        pendingReports,
      },
    });
  } catch (err: any) {
    next(err);
  }
};
