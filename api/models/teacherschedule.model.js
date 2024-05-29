import mongoose from "mongoose";

const teacherschedulesubjectSchema = new mongoose.Schema({
    subject: {
        type: String,
    },
    teacherId: {
        type: String,
    },
    day:{
        type: String,
    },
    time:{
        type: String,
    },
    group: {
        type: String,
    },
    lesson: {
        type: Number,
    }
}
)
const teacherscheduleSchema = new mongoose.Schema({
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
    teacherId: {
        type: String,
        required: true
    },
    monday: [teacherschedulesubjectSchema],
    tuesday:[teacherschedulesubjectSchema],
    wednesday:[teacherschedulesubjectSchema],
    thursday:[teacherschedulesubjectSchema],
    friday:[teacherschedulesubjectSchema],
    saturday:[teacherschedulesubjectSchema],
}
)
const teacherschedule = mongoose.model('teacherschedule', teacherscheduleSchema);
export default teacherschedule;