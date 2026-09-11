import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { prisma } from '../config/prisma.js';
import { getIO } from '../services/socketService.js';

export const getChats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const chats = await prisma.chat.findMany({
      where: {
        participants: { has: userId },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Populate participant profiles for each chat
    const allParticipantIds = Array.from(new Set(chats.flatMap((c) => c.participants)));
    const users = await prisma.user.findMany({
      where: { id: { in: allParticipantIds } },
      select: {
        id: true,
        name: true,
        role: true,
        isVerified: true,
        profile: {
          select: {
            displayName: true,
            avatarUrl: true,
            photos: true,
          },
        },
      },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    const populatedChats = chats.map((c) => ({
      ...c,
      _id: c.id,
      participants: c.participants.map((pid) => userMap.get(pid) || { id: pid, name: 'User' }),
    }));

    res.status(200).json({ success: true, count: populatedChats.length, chats: populatedChats });
  } catch (err: any) {
    next(err);
  }
};

export const getMessages = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const chatId = req.params.chatId as string;
    const userId = req.user!.id;

    if (!chatId) {
      res.status(400).json({ success: false, message: 'Invalid chat identifier' });
      return;
    }

    // IDOR / BOLA Prevention: Verify user is a participant
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        participants: { has: userId },
      },
    });

    if (!chat) {
      res.status(403).json({ success: false, message: 'Access denied. You are not a participant in this conversation.' });
      return;
    }

    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
    });

    const formattedMessages = messages.map((m) => ({
      ...m,
      _id: m.id,
      sender: m.senderId,
      message: m.content,
    }));

    res.status(200).json({ success: true, count: formattedMessages.length, messages: formattedMessages });
  } catch (err: any) {
    next(err);
  }
};

export const sendMessage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const senderId = req.user!.id;
    const { receiverId, messageText, chatId: reqChatId } = req.body;

    if (!messageText || typeof messageText !== 'string' || !messageText.trim()) {
      res.status(400).json({ success: false, message: 'Message text cannot be empty' });
      return;
    }

    const trimmedMessage = messageText.trim();
    if (trimmedMessage.length > 2000) {
      res.status(400).json({ success: false, message: 'Message exceeds maximum length of 2000 characters' });
      return;
    }

    let chat;

    if (reqChatId) {
      chat = await prisma.chat.findFirst({
        where: {
          id: reqChatId,
          participants: { has: senderId },
        },
      });

      if (!chat) {
        res.status(403).json({ success: false, message: 'You are not authorized to post in this conversation' });
        return;
      }
    } else if (receiverId) {
      if (senderId === receiverId) {
        res.status(400).json({ success: false, message: 'Cannot send messages to yourself' });
        return;
      }

      chat = await prisma.chat.findFirst({
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
    }

    if (!chat) {
      res.status(400).json({ success: false, message: 'Chat context could not be resolved' });
      return;
    }

    const newMessage = await prisma.message.create({
      data: {
        chatId: chat.id,
        senderId,
        content: trimmedMessage,
      },
    });

    await prisma.chat.update({
      where: { id: chat.id },
      data: {
        lastMessage: {
          sender: senderId,
          text: trimmedMessage,
          createdAt: new Date(),
        },
      },
    });

    const formattedMessage = {
      ...newMessage,
      _id: newMessage.id,
      sender: newMessage.senderId,
      message: newMessage.content,
    };

    // Emit Socket event to room if active
    try {
      const io = getIO();
      if (io) {
        io.to(chat.id).emit('receive_message', formattedMessage);
      }
    } catch (e) {
      // socket failover non-blocking
    }

    res.status(201).json({
      success: true,
      chatId: chat.id,
      message: formattedMessage,
    });
  } catch (err: any) {
    next(err);
  }
};
