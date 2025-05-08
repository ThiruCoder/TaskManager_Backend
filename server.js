import dotenv from 'dotenv'
dotenv.config();
import express from 'express'
import cors from 'cors'
import { DatabaseConnection } from './DatabaseSection/DatabaseConnection/DatabaseConnect.js';
import { TaskRoute } from './DatabaseSection/TaskRouters/RoutePublisher.js';
import { userRouter } from './DatabaseSection/UserRouter/RoutePublisher.js';
import cookieParser from 'cookie-parser';
import morgan from 'morgan'
import helmet from 'helmet'
import { authRouter } from './DatabaseSection/Middlewares/AuthorizationMiddleware.js';

const app = express()

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))
app.use(helmet())
app.use(cookieParser());
app.use(express.json());

// Database Connection
DatabaseConnection()

// Cors strict orders
const allowedOrigins = [
    process.env.FRONTEND_DEV_URL,
    process.env.FRONTEND_PROD_URL
];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            const message = `The CORS policy for this site does not allow access from ${allowedOrigins.join(', ')}`;
            return callback(new Error(message), false)
        }
    },
    credentials: true,
    methods: ['GET', 'PUT', 'DELETE', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// CORS error handler (Middleware)
app.use((err, req, res, next) => {
    if (err.message.includes('CORS policy')) {
        return res.status(403).json({
            success: false,
            error: 'CORS Error',
            message: process.env.NODE_ENV === 'development'
                ? err.message
                : 'Request not allowed from this origin',
            allowedOrigins
        })
    }
    next();
});


app.use('/task', TaskRoute);
app.use('/user', userRouter);
app.use('/admin', authRouter)

app.use('/', (req, res) => {
    res.send('Backend Server is running')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`The port is running on http://localhost:${PORT}`)
})
