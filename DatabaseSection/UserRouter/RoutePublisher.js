import express from 'express'
import { UserLogin, UserRegister, UpdateRole, GetAllUser, UpdateUser } from './Publisher.js'
import { VerifyToken } from '../Middlewares/VerifyAdmin.js';
const userRouter = express.Router();

userRouter.post('/login', UserLogin);
userRouter.post('/register', UserRegister);
userRouter.put('/roleUpdate', UpdateRole)
userRouter.get('/getAllUsers', GetAllUser)
userRouter.post('/UpdateUser', UpdateUser)
userRouter.post('/VerifyToken', VerifyToken)

export { userRouter }