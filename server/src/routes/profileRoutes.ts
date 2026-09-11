import { Router } from 'express';
import {
  getMyProfile,
  updateProfile,
  submitPersonalityAnswers,
  updateInterests,
  updatePreferences,
  addPhoto,
  getProfileByUserId,
  upgradeSubscription,
} from '../controllers/profileController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/me', getMyProfile);
router.put('/me', updateProfile);

// Subscription routes (support both /upgrade and /subscription for frontend contracts)
router.post('/upgrade', upgradeSubscription);
router.post('/subscription', upgradeSubscription);

// Personality routes (support both PUT and POST for frontend contracts)
router.put('/personality', submitPersonalityAnswers);
router.post('/personality', submitPersonalityAnswers);

router.put('/interests', updateInterests);
router.put('/preferences', updatePreferences);
router.post('/photos', addPhoto);
router.get('/user/:userId', getProfileByUserId);

export default router;
