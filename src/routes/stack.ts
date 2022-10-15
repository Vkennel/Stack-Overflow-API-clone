import express from 'express'
import { Answer, Comment, Question } from '../controller/StackController';
const router = express.Router();


router.post('/answer', Answer)
router.post('/comment/:id', Comment)
router.post('/question', Question)

export default router;