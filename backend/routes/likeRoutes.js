import express from 'express';
import { toggleLike } from '../controllers/likeController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:id', authMiddleware, toggleLike);

export default router;
