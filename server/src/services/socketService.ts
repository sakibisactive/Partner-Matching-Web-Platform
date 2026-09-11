import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Chat } from '../models/Chat.js';

let io: Server | null = null;

export const initSocket = (server: HttpServer): Server => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      credentials: true,
    },
  });

  const onlineUsers = new Map<string, string>(); // userId -> socketId

  // Middleware: Authenticate Socket connection via JWT
  io.use((socket: Socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(' ')[1];

      if (token) {
        const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_partner_match_2026';
        const decoded = jwt.verify(token, secret) as { id: string };
        socket.data.userId = decoded.id;
      } else if (socket.handshake.auth?.userId) {
        socket.data.userId = socket.handshake.auth.userId;
      }

      next();
    } catch (err: any) {
      // Allow lenient connection but without verified userId
      next();
    }
  });

  io.on('connection', (socket: Socket) => {
    // Online tracking setup - bound strictly to verified user or provided id
    socket.on('setup', (userId: string) => {
      const effectiveUserId = socket.data.userId || userId;
      if (effectiveUserId) {
        onlineUsers.set(effectiveUserId, socket.id);
        socket.join(effectiveUserId);
        socket.data.userId = effectiveUserId;
        io?.emit('online_users', Array.from(onlineUsers.keys()));
      }
    });

    // Join room for a specific chat - verified against chat participants
    socket.on('join_chat', async (chatId: string) => {
      if (!chatId || !mongoose.isValidObjectId(chatId)) return;

      const userId = socket.data.userId;
      if (userId) {
        try {
          const isParticipant = await Chat.exists({
            _id: chatId,
            participants: userId,
          });

          if (isParticipant) {
            socket.join(chatId);
          }
        } catch {
          // If verification fails, do not join room
        }
      } else {
        // Fallback for demo or guest modes
        socket.join(chatId);
      }
    });

    // Typing Indicators
    socket.on('typing', ({ chatId, userId }) => {
      if (chatId) {
        socket.to(chatId).emit('typing', { chatId, userId: socket.data.userId || userId });
      }
    });

    socket.on('stop_typing', ({ chatId, userId }) => {
      if (chatId) {
        socket.to(chatId).emit('stop_typing', { chatId, userId: socket.data.userId || userId });
      }
    });

    // Send Message Event
    socket.on('send_message', (newMessage) => {
      if (newMessage && newMessage.chatId) {
        socket.to(newMessage.chatId).emit('receive_message', newMessage);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      let disconnectedUserId: string | null = null;
      for (const [uId, sId] of onlineUsers.entries()) {
        if (sId === socket.id) {
          disconnectedUserId = uId;
          onlineUsers.delete(uId);
          break;
        }
      }
      if (disconnectedUserId) {
        io?.emit('online_users', Array.from(onlineUsers.keys()));
      }
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};
