import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { prisma } from '../config/prisma.js';

export const getMyProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    let profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          userId,
          displayName: req.user!.name,
          age: 24,
          gender: 'Male',
          bio: '',
          photos: [],
          interests: [],
          personalityAnswers: [],
          completionPercentage: 15,
          isProfileComplete: false,
          preference: {
            minAge: 18,
            maxAge: 50,
            gender: ['Female'],
            maxDistanceKm: 100,
            relationshipType: ['Long-term'],
            interests: [],
          },
        },
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: req.user!.id,
        _id: req.user!.id,
        name: req.user!.name,
        email: req.user!.email,
        role: req.user!.role,
        isVerified: req.user!.isVerified,
      },
      profile,
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { bio, age, gender, occupation, location, photos, interests, preference, displayName } = req.body;

    const dataToUpdate: any = {};
    if (displayName !== undefined) dataToUpdate.displayName = displayName;
    if (bio !== undefined) dataToUpdate.bio = bio;
    if (age !== undefined) dataToUpdate.age = Number(age) || 24;
    if (gender !== undefined) dataToUpdate.gender = gender;
    if (occupation !== undefined) dataToUpdate.occupation = occupation;
    if (location !== undefined) dataToUpdate.location = typeof location === 'string' ? location : JSON.stringify(location);
    if (photos !== undefined) dataToUpdate.photos = photos;
    if (interests !== undefined) dataToUpdate.interests = interests;
    if (preference !== undefined) dataToUpdate.preference = preference;

    const updatedProfile = await prisma.profile.upsert({
      where: { userId },
      update: dataToUpdate,
      create: {
        userId,
        displayName: displayName || req.user!.name,
        ...dataToUpdate,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully in Supabase',
      profile: updatedProfile,
    });
  } catch (err: any) {
    next(err);
  }
};

export const upgradeSubscription = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { membershipTier } = req.body;
    const tier = membershipTier === 'VIP' ? 'VIP' : 'Gold';

    const profile = await prisma.profile.update({
      where: { userId },
      data: { verified: true },
    });

    res.status(200).json({
      success: true,
      message: `🎉 Membership upgraded to ${tier}!`,
      membershipTier: tier,
      isPremium: true,
      profile,
    });
  } catch (err: any) {
    next(err);
  }
};

export const submitPersonalityAnswers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const answers = Array.isArray(req.body) ? req.body : req.body.answers;

    if (!Array.isArray(answers)) {
      res.status(400).json({ success: false, message: 'Answers must be an array of question answers' });
      return;
    }

    const sanitizedAnswers = answers
      .filter((a: any) => a && (typeof a.questionNumber === 'number' || typeof a.questionId === 'string') && typeof a.answer === 'number')
      .map((a: any) => ({
        questionNumber: a.questionNumber || 1,
        answer: Math.min(5, Math.max(1, Math.round(a.answer))),
      }));

    const profile = await prisma.profile.update({
      where: { userId },
      data: {
        personalityAnswers: sanitizedAnswers,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Personality questionnaire answers saved successfully in Supabase!',
      personalityAnswersCount: sanitizedAnswers.length,
      profile,
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateInterests = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const rawIds = req.body.interestIds || req.body.interests;

    if (!Array.isArray(rawIds)) {
      res.status(400).json({ success: false, message: 'Interests must be an array of IDs' });
      return;
    }

    const profile = await prisma.profile.update({
      where: { userId },
      data: {
        interests: rawIds,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Interests updated successfully in Supabase',
      interests: profile.interests,
    });
  } catch (err: any) {
    next(err);
  }
};

export const updatePreferences = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { minAge, maxAge, gender, maxDistanceKm, relationshipType } = req.body;

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      res.status(404).json({ success: false, message: 'Profile not found' });
      return;
    }

    const currentPref: any = profile.preference || {};
    const updatedPref = {
      ...currentPref,
      minAge: minAge !== undefined ? Math.max(18, Number(minAge)) : currentPref.minAge || 18,
      maxAge: maxAge !== undefined ? Math.min(100, Number(maxAge)) : currentPref.maxAge || 50,
      gender: gender !== undefined ? (Array.isArray(gender) ? gender : [gender]) : currentPref.gender || ['Female'],
      maxDistanceKm: maxDistanceKm !== undefined ? Math.max(1, Number(maxDistanceKm)) : currentPref.maxDistanceKm || 100,
      relationshipType: relationshipType !== undefined ? (Array.isArray(relationshipType) ? relationshipType : [relationshipType]) : currentPref.relationshipType || ['Long-term'],
    };

    const updated = await prisma.profile.update({
      where: { userId },
      data: { preference: updatedPref },
    });

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: updated.preference,
    });
  } catch (err: any) {
    next(err);
  }
};

export const addPhoto = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const photoUrl = req.body.photoUrl || req.body.url;

    if (!photoUrl || typeof photoUrl !== 'string' || !photoUrl.trim().startsWith('http')) {
      res.status(400).json({ success: false, message: 'A valid http/https photo URL is required' });
      return;
    }

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      res.status(404).json({ success: false, message: 'Profile not found' });
      return;
    }

    const photosList = Array.isArray(profile.photos) ? [...(profile.photos as any[])] : [];
    const isMain = photosList.length === 0;
    photosList.push({ url: photoUrl.trim(), isMain });

    const updated = await prisma.profile.update({
      where: { userId },
      data: { photos: photosList },
    });

    res.status(200).json({
      success: true,
      message: 'Photo added successfully',
      photos: updated.photos,
    });
  } catch (err: any) {
    next(err);
  }
};

export const getProfileByUserId = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.params.userId as string;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, role: true, isVerified: true, createdAt: true },
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const profile = await prisma.profile.findUnique({ where: { userId } });
    res.status(200).json({
      success: true,
      user: { ...user, _id: user.id },
      profile,
    });
  } catch (err: any) {
    next(err);
  }
};
