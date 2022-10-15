import express from 'express'
import { Answer, Comment, Question } from '../controller/StackController';
import { auth } from '../middleware/Middleware';
const router = express.Router();


router.post('/answer', auth, Answer)
router.post('/comment/:id', auth, Comment)
router.post('/question', auth, Question)

export default router;