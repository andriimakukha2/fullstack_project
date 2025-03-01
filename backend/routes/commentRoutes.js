import express from 'express';
import { addComment, getComments } from '../controllers/commentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:id', authMiddleware, addComment);
router.get('/:id', getComments);

export default router;
