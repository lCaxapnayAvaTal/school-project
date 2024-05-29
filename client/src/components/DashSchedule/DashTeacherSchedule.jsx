import React, { useEffect, useState } from "react";
import "./DashSchedule.scss";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const times = [
    "8:00 8:45",
    "8:50 9:35",
    "9:40 10:25",
    "10:35 11:20",
    "11:25 12:10",
    "12:15 13:00",
    "13:05 13:50",
];
const dayss = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
];
const subsArray = []
export const DashTeacherSchedule = () => {
    const { currentUser } = useSelector((state) => state.user);
    const {days, time, monday, tuesday, wednesday, thursday, friday, saturday} = currentUser.teacher.teacherSchedule
    const [schedules, setSchedules] = useState([]);
    const [groups, setGroups] = useState({});
    // const [subsArray, setSubsArray] = useState([]);
    const [teacherSchedule, setteacherSchedule] = useState({});
    const array3 = monday&&monday.concat(tuesday).concat(wednesday).concat(thursday).concat(friday).concat(saturday)

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const res = await fetch("/api/schedule/getschedules");
                const data = await res.json();
                if (res.ok) {
                    setSchedules(data);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentUser.teacher.isTeacher) {
            fetchSchedules();
        }

    }, [currentUser._id]);
    useEffect(()=>{
        schedules.map(m=>{
            dayss.map((day) => {
                for (let key in m) {
                    if(key==day){
                        m[key].map(day=>{
                            if(day.teacherId&&day.teacherId==currentUser._id){
                                console.log('edsfs');
                                subsArray.push(day)
                            }
                        })
                    }
                }
            })
        })
        console.log(subsArray);
        const ss=array3&&subsArray!=[]&&array3.concat(subsArray)
        console.log(array3);
        console.log(ss);
        const lessons = ss&&ss.reduce((acc, current) => {
            acc.map(accEl=>{
                if (current.lesson==accEl.lesson&&current.day==accEl.day) {
                    acc.splice(acc.indexOf(accEl), 1);
                }
            })
            return [...acc, current]
        } , [])
        const typedArr = [Object.groupBy( lessons, ({ day }) => day)]
        dayss.map(day=>typedArr.map(av=>(
            av[day]?.sort((a, b) => (+a.lesson) - (+b.lesson)) //!сортируем по уроку
        ))
        )
        setteacherSchedule(typedArr[0])
    },[schedules])

    console.log(schedules);
    console.log(teacherSchedule);
    return (
        <div className="schedule">
            <div className="schedule__group">
                <div className="schedule__group">
                            <div
                                className="schedule__group-schedule"
                            >
                                <div className="schedule__group-name">
                                    <h4 className="schedule__h4">
                                        Мое расписание
                                    </h4>
                                </div>
                                <table
                                    className="schedule__table"
                                >
                                    <tbody className="schedule__thead">
                                        <tr>
                                            <th>*</th>
                                            
                                            {time.map((time) => (
                                                    <th
                                                        key={time}
                                                        className="schedule__th"
                                                    >
                                                        {time}
                                                    </th>
                                                ))}
                                        </tr>
                                        {/* {days.map((day) => (
                                            <tr key={day}>
                                                <th>{day}</th>
                                                {monday &&
                                                    monday.map(
                                                        (subject) => (
                                                            <td
                                                                key={
                                                                    subject._id
                                                                }
                                                            >
                                                                {
                                                                    subject.subject
                                                                }
                                                            </td>
                                                        )
                                                    )}
                                            </tr>
                                        ))} */}
                                        <tr>
                                            <th>{days[0]}</th>
                                            {teacherSchedule.monday &&
                                                teacherSchedule.monday.map(
                                                    (subject) => (
                                                        <td key={subject._id} >
                                                            {subject.subject} {subject.group}
                                                        </td>
                                                    )
                                                )}
                                        </tr>
                                        <tr>
                                            <th>{days[1]}</th>
                                            {teacherSchedule.tuesday &&
                                                teacherSchedule.tuesday.map(
                                                    (subject) => (
                                                        <td key={subject._id}>
                                                            {subject.subject} {subject.group}
                                                        </td>
                                                    )
                                                )}
                                        </tr>
                                        <tr>
                                            <th>{days[2]}</th>
                                            {teacherSchedule.wednesday &&
                                                teacherSchedule.wednesday.map(
                                                    (subject) => (
                                                        <td key={subject._id}>
                                                            {subject.subject} {subject.group}
                                                        </td>
                                                    )
                                                )}
                                        </tr>
                                        <tr>
                                            <th>{days[3]}</th>
                                            {teacherSchedule.thursday &&
                                                teacherSchedule.thursday.map(
                                                    (subject) => (
                                                        <td key={subject._id}>
                                                            {subject.subject} {subject.group}
                                                        </td>
                                                    )
                                                )}
                                        </tr>
                                        <tr>
                                            <th>{days[4]}</th>
                                            {teacherSchedule.friday &&
                                                teacherSchedule.friday.map(
                                                    (subject) => (
                                                        <td key={subject._id}>
                                                            {subject.subject} {subject.group}
                                                        </td>
                                                    )
                                                )}
                                        </tr>
                                        <tr>
                                            <th>{days[5]}</th>
                                            {teacherSchedule.saturday &&
                                                teacherSchedule.saturday.map(
                                                    (subject) => (
                                                        <td key={subject._id}>
                                                            {subject.subject} {subject.group}
                                                        </td>
                                                    )
                                                )}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        
                </div>
            </div>
        </div>
    );
};
