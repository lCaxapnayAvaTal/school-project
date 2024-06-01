import express from 'express';
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
import postRoutes from './routes/post.route.js'
import commentRoutes from './routes/comment.route.js'
import scheduleRoutes from './routes/schedule.route.js'
import teacherscheduleRoutes from './routes/teacherschedule.route.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'

const PORT = 3000
dotenv.config()

mongoose
    .connect(process.env.MONGO)
    .then(() => {
        console.log('MongoDb is connectedd');
    }).catch(err => {
        console.log(err);
    })

const app = express();

app.use(express.json()); //отправить JSON в бэкенд
app.use(cookieParser()); 
app.use(cors())

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
})

app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/teacherschedule', teacherscheduleRoutes);

// !Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Inrernal server error popopopoop';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})