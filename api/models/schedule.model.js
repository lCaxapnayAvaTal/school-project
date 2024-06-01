import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
    subject: String,
    teacherId: String,
    day:String,
    time:String,
    group: String,
    lesson: Number,
    teacherNum: Number,
    teacherFirstName: String,
    teacherLastName: String,
    teacherThirdName: String,
}
)
const scheduleSchema = new mongoose.Schema({
    days: {
        type: Array,
        default: ["Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"]
    },
    formmasterId: {
        type: Number,
    },
    time: {
        type: Array,
        default: ["8:00 8:45","8:50 9:35","9:40 10:25","10:35 11:20","11:25 12:10","12:15 13:00","13:05 13:50"]
    },
    group: {
        type: String,
        required: true
    },
    lessons: {
        type: Array,
        default: [1,2,3,4,5,6,7]
    },
    monday: [subjectSchema],
    tuesday:[subjectSchema],
    wednesday:[subjectSchema],
    thursday:[subjectSchema],
    friday:[subjectSchema],
    saturday:[subjectSchema],
}
)
const Schedule = mongoose.model('Schedule', scheduleSchema);
export default Schedule;