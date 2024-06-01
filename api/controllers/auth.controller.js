import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const createTeacher = async (req, res, next) => {
    const { firstName, lastName, thirdName, email, password, subject, group,
        formmasterId, days, time, monday, tuesday, wednesday, thursday, friday, saturday, teacherId
    } = req.body
    

    if (!firstName || !lastName || !email || !password || !subject || !monday || firstName === '' || lastName === '' || email === '' || password === '' || subject == '') {
        next(errorHandler(400, 'All fields are required'))
    }
    const lastContact = await User.find({"teacher.isTeacher":true}).sort({$natural:-1}).limit(1);
    const hashedPassword = bcryptjs.hashSync(password, 10) //here was some not understandable problem

    const newUser = new User({
        email: email,
        password: hashedPassword,
        teacher:
        {
            isTeacher: true,
            subject: subject,
            group: group,
            firstName:firstName,
            lastName:lastName,
            thirdName:thirdName,
            distinctiveNumber:lastContact ? Number(lastContact.map(d=>d.teacher.distinctiveNumber))+1 : 1,
            teacherSchedule: {
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
            }
        },
        student: {isStudent: false}

    });
    console.log(newUser);
    try {
        await newUser.save()
        res.json('Teacher sign up successful');
    } catch (error) {
        next(error)
    }
}
export const createStudent = async (req, res, next) => {
    const { firstName, lastName, email, password, group } = req.body

    if (!firstName || !lastName || !email || !password || firstName === '' || lastName === '' || email === '' || password === '') {
        next(errorHandler(400, 'All fields are requiredddd'))
    }

    const hashedPassword = bcryptjs.hashSync(password, 10) //here was some not understandable problem

    const newUser = new User({
        email: email,
        password: hashedPassword,
        student: {
            isStudent: true,
            group,
            firstName,
            lastName
        },
        teacher:{isTeacher: false}
    });
    console.log(newUser);
    try {
        const { user, ...rest } = newUser._doc;
        console.log(rest);
        await newUser.save()
        res.json('Student sign up successful');
    } catch (error) {
        next(error)
    }
}
export const signup = async (req, res, next) => {
    const { username, email, password } = req.body

    if (!username || !email || !password || username === '' || email === '' || password === '') {
        next(errorHandler(400, 'All fields are required'))
    }

    const hashedPassword = bcryptjs.hashSync(password, 10) //here was some not understandable problem

    const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword,
        teacher:{isTeacher: false},
        student: {isStudent: false}
    });

    try {
        await newUser.save()
        res.json('Signup successful');
    } catch (error) {
        next(error)
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '') {
        next(errorHandler(400, 'All fields are required'))
    }

    try {
        const validUser = await User.findOne({ email })
        if (!validUser) {
            return next(errorHandler(404, 'User not found'))
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if (!validPassword) {
            return next(errorHandler(404, 'Invalid password'))
        }
        const token = jwt.sign(
            { id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET
        );
        const { password: pass, ...rest } = validUser._doc;

        res
            .status(200)
            .cookie('access_token', token, {
                httpOnly: true,
                // maxAge: 1000 * 60 * 60 * 24 * 365 * 7 
                // // secure: true,
                // sameSite: 'None',
                // priority: 'Low',
                // domain:'localhost:3000'
            })
            .json(rest)

    } catch (error) {
        next(error)
    }
}

export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;
    try {
        const user = await User.findOne({ email })
        if (user) {
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
            const { password, ...rest } = user._doc;

            res
                .status(200)
                .cookie('access_token', token, {
                    httpOnly: true
                })
                .json(rest);

        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username:
                    name.toLowerCase().split(' ').join('') +
                    Math.random().toString(9).slice(-4),
                email: email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
                teacher:
                {
                    isTeacher: false
                }
                ,
                student: {
                    isStudent: false,
                }
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET);
            const { password, ...rest } = newUser._doc;
            res
                .status(200)
                .cookie('access_token', token, {
                    httpOnly: true
                })
                .json(rest);
        }
    } catch (error) {
        next(error)
    }

}