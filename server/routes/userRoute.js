import express from 'express';
import { register, login, isAuth, logout } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';

const userRouter = express.Router();

// --- User Registration ---
userRouter.post('/register', register);

// --- User Login ---
userRouter.post('/login', login);

// --- Check if user is authenticated ---
// ✅ Only accessible if valid token exists
userRouter.get('/is-auth', authUser, isAuth);

// --- Logout User ---
// ✅ Require authentication to log out
userRouter.get('/logout', authUser, logout);

export default userRouter;