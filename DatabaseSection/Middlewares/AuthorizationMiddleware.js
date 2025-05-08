import express from 'express'
import { VerifyAdminOrUser } from './VerifyAdmin.js';
const authRouter = express.Router()

authRouter.get('/log', VerifyAdminOrUser, (req, res) => {
    const data = req.user
    return res.json({
        message: 'Welcome, admin!',
        data: data,
        success: true
    });
})

export { authRouter }