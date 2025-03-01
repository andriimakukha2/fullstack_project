import express from 'express';
import { followUser, unfollowUser, getFollowing, getFollowers } from '../controllers/followController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/follow/:id', authMiddleware, followUser);
router.post('/unfollow/:id', authMiddleware, unfollowUser);
router.get('/following', authMiddleware, getFollowing);
router.get('/followers', authMiddleware, getFollowers);

export default router;
