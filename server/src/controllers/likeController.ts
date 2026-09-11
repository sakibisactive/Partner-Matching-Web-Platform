import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { prisma } from '../config/prisma.js';

export const likeUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const senderId = req.user!.id;
    const { receiverId } = req.body;

    if (!receiverId || typeof receiverId !== 'string') {
      res.status(400).json({ success: false, message: 'Valid receiver ID is required' });
      return;
    }

    if (senderId === receiverId) {
      res.status(400).json({ success: false, message: 'You cannot like your own profile' });
      return;
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        senderId_receiverId: { senderId, receiverId },
      },
    });

    if (existingLike) {
      res.status(200).json({ success: true, message: 'Already liked this user' });
      return;
    }

    await prisma.like.create({
      data: { senderId, receiverId },
    });

    // Check for mutual like
    const isMutual = await prisma.like.findUnique({
      where: {
        senderId_receiverId: { senderId: receiverId, receiverId: senderId },
      },
    });

    let chatId: string | undefined;

    if (isMutual) {
      let chat = await prisma.chat.findFirst({
        where: {
          participants: { hasEvery: [senderId, receiverId] },
        },
      });

      if (!chat) {
        chat = await prisma.chat.create({
          data: {
            participants: [senderId, receiverId],
          },
        });
      }
      chatId = chat.id;
    }

    // Send Notification
    await prisma.notification.create({
      data: {
        recipientId: receiverId,
        senderId,
        type: isMutual ? 'match' : 'like',
        message: isMutual
          ? `🎉 It's a Mutual Match! You and ${req.user!.name} liked each other.`
          : `💖 ${req.user!.name} liked your profile!`,
      },
    });

    res.status(200).json({
      success: true,
      message: isMutual ? 'It is a Mutual Match! 🎉' : 'Profile liked successfully',
      isMutualMatch: !!isMutual,
      chatId,
    });
  } catch (err: any) {
    next(err);
  }
};

export const saveUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const senderId = req.user!.id;
    const { targetUserId } = req.body;

    if (!targetUserId || typeof targetUserId !== 'string') {
      res.status(400).json({ success: false, message: 'Valid target user ID is required' });
      return;
    }

    if (senderId === targetUserId) {
      res.status(400).json({ success: false, message: 'You cannot bookmark your own profile' });
      return;
    }

    await prisma.like.upsert({
      where: {
        senderId_receiverId: { senderId, receiverId: targetUserId },
      },
      update: { isSuperLike: true },
      create: { senderId, receiverId: targetUserId, isSuperLike: true },
    });

    res.status(200).json({ success: true, message: 'Profile saved to bookmarks' });
  } catch (err: any) {
    next(err);
  }
};

export const getMyLikes = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;

    const likesGiven = await prisma.like.findMany({
      where: { senderId: userId },
      include: {
        receiver: {
          select: {
            id: true,
            name: true,
            role: true,
            isVerified: true,
            profile: true,
          },
        },
      },
    });

    const likesReceived = await prisma.like.findMany({
      where: { receiverId: userId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
            isVerified: true,
            profile: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      likesGiven,
      likesReceived,
    });
  } catch (err: any) {
    next(err);
  }
};

export const deleteLike = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const senderId = req.user!.id;
    const targetUserId = req.params.id as string;

    if (!targetUserId) {
      res.status(400).json({ success: false, message: 'Valid user ID required' });
      return;
    }

    await prisma.like.deleteMany({
      where: { senderId, receiverId: targetUserId },
    });

    res.status(200).json({ success: true, message: 'Like removed' });
  } catch (err: any) {
    next(err);
  }
};
