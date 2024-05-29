import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs'

export const test = (req, res) => {
    res.json({ message: 'API is workingggg' })
}

export const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.userId){
        return next(errorHandler(403, 'Вы не можете обновить этого пользователя'))
    }
    if(req.body.password){
        if(req.body.password.length < 6){
            return next(errorHandler(400, 'Пароль должен содержать минимум 6 символов'))
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }
    if (req.body.username){
        if(req.body.username.length < 3 || req.body.username.length > 20){
            return next(errorHandler(400, 'Имя пользователя должно содержать от 3 до 20 символов'))
        }
        if(req.body.username.includes(' ')){
            return next(errorHandler(400, 'Имя пользователя не может содержать пробелы'))
        }
        if(req.body.username !== req.body.username.toLowerCase()){
            return next(errorHandler(400, 'Имя пользователя должно быть в нижнем регистре'))
        }
        if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){
            return next(errorHandler(400, 'Имя пользователя может содержать только буквы и цифры'))
        }
    }
    try {
        const upatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password: req.body.password,
            }
        }, {new:true});
        const {password, ...rest} = upatedUser._doc;
        res.status(200).json(rest)
    } catch (error) {
        next(error,'eeeeeeeee')
    }
};
export const deleteUser = async (req, res, next) => {
    if(!req.user.isAdmin && req.user.id !== req.params.userId){
        return next(errorHandler(403, 'Вы не можете удалить этого пользователя'))
    }
    try {
        await User.findByIdAndDelete(req.params.userId)
        res.status(200).json('Пользователь был удален')
    } catch (error) {
        next(error)
    }
}
export const signout = (req, res, next) => {
    try {
        res
        .clearCookie('access_token')
        .status(200)
        .json('Вы вышли из аккаунта')
    } catch (error) {
        next(error)
    }
}
export const getusers = async(req,res,next) => {
    if(!req.user.isAdmin){
        return next(errorHandler(403, 'Вы не можете просматривать пользователей'))
    }
    try {
        const startIndex = parseInt(req.query.startIndex)||0;
        const limit = parseInt(req.query.limit)||9
        const sortDirection = req.query.sort === 'asc' ? 1 : -1

        const users = await User.find()
            .sort({createdAt:sortDirection})
            .skip(startIndex)
            .limit(limit)

        const usersWithoutPasswords = users.map((user)=>{
            const {password, ...rest} = user._doc;
            return rest
        })
        const totalUsers = await User.countDocuments()
        const now = new Date()
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )
        const lastMonthUsers = await User.countDocuments({
            createdAt: {$gte:oneMonthAgo}
        })
        res.status(200).json({
            users:usersWithoutPasswords,
            totalUsers,
            lastMonthUsers
        })
    } catch (error) {
        next(error)
    }
}
export const getUser = async(req,res,next) => {
    try {
        const user = await User.findById(req.params.userId)
        if(!user){
            return next(errorHandler(404, 'Пользователь не найден'))
        }
        const {password, ...rest} = user._doc
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}
export const getTeachers = async(req,res,next) => {
    if(!req.user.isAdmin){
        return next(errorHandler(403, 'Вы не можете просматривать пользователей'))
    }
    try {
        const startIndex = parseInt(req.query.startIndex)||0;
        const limit = parseInt(req.query.limit)||9
        const sortDirection = req.query.sort === 'asc' ? 1 : -1

        const users = await User.find()
            .sort({createdAt:sortDirection})
            .skip(startIndex)
            .limit(limit)

        const usersWithoutPasswords = users.map((user)=>{
            const {password, ...rest} = user._doc;
            return rest
        })
        const teachers = usersWithoutPasswords.filter(teacher=>teacher.teacher.isTeacher)
        console.log(teachers);
        res.status(200).json({
            users:teachers,
        })
    } catch (error) {
        next(error)
    }
}