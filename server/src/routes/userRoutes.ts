import { Router } from 'express';
import { discoverUsers, deleteMyAccount } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/discover', protect, discoverUsers);
router.delete('/me', protect, deleteMyAccount);

export default router;
