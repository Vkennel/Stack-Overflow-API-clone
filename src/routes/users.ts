import express from 'express'
import { RegisterUser, LoginUser } from '../controller/userController';
const router = express.Router();

router.post('/signup', RegisterUser)
router.post('/login', LoginUser)

export default router;
