import { errorHandler } from "../utils/error.js"
import Schedule from "../models/schedule.model.js"

export const createSchedule = async (req, res, next) => {
    try {
        const { formmasterId, days, time, monday, tuesday, wednesday, thursday, friday, saturday, group, lesson } = req.body
        const newSchedule = new Schedule({
            formmasterId,
            days,
            time,
            monday,
            tuesday,
            wednesday,
            thursday,
            friday,
            saturday,
            group,
            lesson
        })
        await newSchedule.save()
        res.status(200).json(newSchedule)
    } catch (error) {
        next(error)
    }
}
export const getGroupsSchedule = async (req, res, next) => {
    try {
        const schedule = await Schedule.find()
        if (!schedule) {
            return next(errorHandler(404, 'schedule не найден'))
        }
        res.status(200).json(schedule)
    } catch (error) {
        next(error)
    }
}
export const getGroupSchedule = async (req, res, next) => {
    try {
        console.log(req.params.group);
        const schedule = await Schedule.findById(req.params.group)
        if (!schedule) {
            return next(errorHandler(404, 'schedule не найден'))
        }
        res.status(200).json(schedule)
    } catch (error) {
        next(error)
    }
}
export const editSchedule = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'Вы не можете изменить расписание'))
    }
    try {
        const {  monday, tuesday, wednesday, thursday, friday, saturday, } = req.body
        monday.sort((a, b) => (+a.lesson) - (+b.lesson))
        tuesday.sort((a, b) => (+a.lesson) - (+b.lesson))
        wednesday.sort((a, b) => (+a.lesson) - (+b.lesson))
        thursday.sort((a, b) => (+a.lesson) - (+b.lesson))
        friday.sort((a, b) => (+a.lesson) - (+b.lesson))
        saturday.sort((a, b) => (+a.lesson) - (+b.lesson))
        
        const updateSubject = await Schedule.findByIdAndUpdate(
            req.params.scheduleId,
            {
                $set: {
                    monday,
                    tuesday,
                    wednesday,
                    thursday,
                    friday,
                    saturday,
                }
            }, { new: true }
        )
        res.status(200).json(updateSubject)
    } catch (error) {
        next(error)
    }
}