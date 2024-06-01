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
})
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
    },
    monday: [teacherschedulesubjectSchema],
    tuesday:[teacherschedulesubjectSchema],
    wednesday:[teacherschedulesubjectSchema],
    thursday:[teacherschedulesubjectSchema],
    friday:[teacherschedulesubjectSchema],
    saturday:[teacherschedulesubjectSchema],
})
const teacherSchema = new mongoose.Schema({
    isTeacher: {
        type: Boolean,
        default: false,
    },
    subject: {
        type: Array,
    },
    group: String,
    firstName: String,
    lastName: String,
    thirdName: String,
    distinctiveNumber: Number,
    teacherSchedule: teacherscheduleSchema
})
const studentSchema = new mongoose.Schema({
    isStudent: {
        type: Boolean,
        default: false,
    },
    firstName: String,
    lastName: String,
    group: String,

})
const userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    teacher: teacherSchema,
    student: studentSchema
}, { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;