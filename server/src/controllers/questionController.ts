import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';

export const getQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const questions = await prisma.question.findMany({
      orderBy: { questionNumber: 'asc' },
    });
    res.status(200).json({ success: true, count: questions.length, questions });
  } catch (err: any) {
    next(err);
  }
};

export const getInterests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const interests = await prisma.interest.findMany({
      orderBy: { name: 'asc' },
    });
    res.status(200).json({ success: true, count: interests.length, interests });
  } catch (err: any) {
    next(err);
  }
};
