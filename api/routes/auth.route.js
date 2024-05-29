import express from 'express';
import { createStudent, createTeacher, google, signin, signup } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup)
router.post('/createTeacher', createTeacher)
router.post('/createStudent', createStudent)
router.post('/signin', signin)
router.post('/google', google)

export default router;
