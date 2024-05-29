import { errorHandler } from "../utils/error.js"
import teacherschedule from "../models/teacherschedule.model.js"

export const createTeacherSchedule = async (req, res, next) => {
    try {
        const { formmasterId, days, time, monday, tuesday, wednesday, thursday, friday, saturday, teacherId } = req.body
        const newTeacherschedule = new teacherschedule({
            formmasterId,
            days,
            time,
            teacherId,
            monday,
            tuesday,
            wednesday,
            thursday,
            friday,
            saturday,
        })
        await newTeacherschedule.save()
        res.status(200).json(newTeacherschedule)
    } catch (error) {
        next(error)
    }
}