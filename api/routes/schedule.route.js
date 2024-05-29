import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createSchedule, editSchedule, getGroupSchedule, getGroupsSchedule,  } from '../controllers/schedule.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createSchedule)
router.get('/getschedules', getGroupsSchedule)
router.get('/getSchedule/:group', getGroupSchedule)
router.put('/edit/:scheduleId/:userId', verifyToken, editSchedule)
// router.put('/editComment/:commentId', verifyToken, editComment)
// router.delete('/deleteComment/:commentId', verifyToken, deleteComment)
// router.get('/getcomments', verifyToken, getcomments)

export default router;