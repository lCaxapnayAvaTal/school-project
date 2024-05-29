import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import shortid from "shortid";

const subjects = [
    "математика",
    "русский язык",
    "литература",
    "физика",
    "геометрия",
    "дпм",
    "биология",
    "химия",
    "история",
    "правоведение",
    "чио",
    "модуль",
    "физкультура",
    "адабият",
    "кыргызский язык",
    "география",
    "ДПМ2",
];
const times = [
    "8:00 8:45",
    "8:50 9:35",
    "9:40 10:25",
    "10:35 11:20",
    "11:25 12:10",
    "12:15 13:00",
    "13:05 13:50",
];
const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
];
const m = [
    {
        day: "monday",
        time: "10:35 11:20",
        group: "04-21",
        lesson: 4,
        subject: "литература",
        teacherId: 453665453,
    },
    {
        day: "monday",
        time: "8:00 8:45",
        group: "04-21",
        lesson: 1,

        subject: "русский",
        teacherId: 453665453,
    },
    {
        day: "monday",
        time: "8:50 9:35",
        group: "04-21",
        lesson: 2,
        subject: "русский",
        teacherId: 453665453,
    },
    {
        day: "monday",
        time: "8:50 9:35",
        group: "04-21",
        lesson: 2,
        subject: "физра",
        teacherId: 453665453,
    },
    {
        day: "monday",
        time: "9:40 10:25",
        group: "04-21",
        lesson: 3,
        subject: "русский",
        teacherId: 453665453,
    },
    {
        day: "monday",
        time: "11:25 12:10",
        group: "04-21",
        lesson: 5,
        subject: "русский",
        teacherId: 453665453,
    },
    {
        day: "monday",
        time: "12:15 13:00",
        group: "04-21",
        lesson: 6,
        subject: "русский",
        teacherId: 453665453,
    },
    {
        day: "monday",
        time: "12:15 13:00",
        group: "04-21",
        lesson: 6,
        subject: "history",
        teacherId: 453665453,
    },
    {
        day: "monday",
        time: "13:05 13:50",
        group: "04-21",
        lesson: 7,
        subject: "русский",
        teacherId: 453665453,
    },
    {
        day: "monday",
        time: "13:05 13:50",
        group: "04-21",
        lesson: 7,
        subject: "english",
        teacherId: 453665453,
    },
    {
        day: "monday",
        time: "13:05 13:50",
        group: "04-21",
        lesson: 7,
        subject: "biology",
        teacherId: 453665453,
    },
];
const dayss = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
];
const subsArray = [];

export const ChangeShedule = () => {
    const { currentUser } = useSelector((state) => state.user);
    const { scheduleId } = useParams();
    const [schedule, setSchedule] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [subject, setSubject] = useState();
    const [teacher, setTeacher] = useState(``);
    const [teacherId, setTeacherId] = useState(0);
    const [oneLesson, setOneLesson] = useState([]);
    const [subsArrayy, setSubsArrayy] = useState([]);
    const [error, setError] = useState(false);
    const { monday, tuesday, wednesday, thursday, friday, saturday } = schedule;
    const array3 =
        monday &&
        monday
            .concat(tuesday)
            .concat(wednesday)
            .concat(thursday)
            .concat(friday)
            .concat(saturday);

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
        if (currentUser.isAdmin) {
            fetchSchedules();
        }
    }, [currentUser._id]);

    console.log(schedules);
    const changeSub = (e, subjectt) => {
        if (!subject == "") {
            e.target.innerText = subject;
        }
        if (subject) {
            setOneLesson([
                ...oneLesson,
                {
                    subject,
                    group: subjectt.group,
                    lesson: subjectt.lesson,
                    teacherId: teacherId,
                    day: subjectt.day,
                    time: subjectt.time,
                },
            ]);
        }
    };
    console.log(subsArray);

    useEffect(() => {
        schedules.map((m) => {
            dayss.map((day) => {
                for (let key in m) {
                    console.log(m._id);
                    if (m._id != scheduleId) {
                        if (key == day) {
                            m[key].map((day) => {
                                subsArray.push(day);
                                return;
                            });
                        }
                    }
                }
            });
        });

        return () => {
            subsArray.length = 0;
        };
    }, [schedules]);

    const AkdilaysSmartBlock = async (e) => {
        e.preventDefault();
        const ss = array3 && array3.concat(oneLesson);
        console.log(ss);
        const lessons =
            ss &&
            ss.reduce((acc, current) => {
                acc.map((accEl) => {
                    if (
                        current.lesson == accEl.lesson &&
                        current.day == accEl.day
                    ) {
                        acc.splice(acc.indexOf(accEl), 1);
                    }
                });
                return [...acc, current];
            }, []);
        console.log(lessons);
        const oo = subsArray.concat(lessons);
        if (lessons != undefined) {
            const typedArr = [Object.groupBy(lessons, ({ day }) => day)];
            const dd = days.map((day) =>
                typedArr.map(
                    (av) => av[day]?.sort((a, b) => +a.lesson - +b.lesson) //!сортируем по уроку
                )
            );
            console.log(dd);

            const returnedTarget = Object.assign(schedule, typedArr[0]); //!потом сложим
            oo &&
                oo.reduce((acc, current) => {
                    acc.map((accEl) => {
                        if (
                            current.lesson == accEl.lesson &&
                            current.day == accEl.day &&
                            current.teacherId &&
                            accEl.teacherId == current.teacherId
                        ) {
                            console.log(current);
                            console.log(
                                `У этого учителя уже есть урок группа: ${accEl.group}  день:${accEl.day} урок: ${accEl.lesson}`
                            );
                            console.log(accEl);
                            return setError(true);
                        }
                    });
                    return [...acc, current];
                }, []);
            console.log(oo);
            // try {
            //     delete returnedTarget.days;
            //     delete returnedTarget.lessons;
            //     delete returnedTarget.time;
            //     delete returnedTarget.group;
            //     delete returnedTarget._id;
            //     delete returnedTarget._v;
            //     const res = await fetch(`/api/schedule/edit/${scheduleId}/${currentUser._id}`,{
            //         method:"PUT",
            //         headers:{
            //             'Content-Type':'application/json',
            //         },
            //         body: JSON.stringify(returnedTarget)
            //     })
            //     const data = await res.json()
            //     if(!res.ok){
            //         console.log(data.message)
            //     }
            //     if(res.ok){
            //         alert('Расписание успешно изменено:D!!!!!!!')
            //     }
            // } catch (error) {
            //     console.log('Что то пошло не так')
            // }
            console.log([returnedTarget]);
        }
    };

    useEffect(() => {
        const handleClick = async () => {
            try {
                const res = await fetch(
                    `/api/schedule/getSchedule/${scheduleId}`
                );
                const data = await res.json();
                if (res.ok) {
                    setSchedule(data);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        handleClick();
    }, [currentUser._id]);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const res = await fetch("/api/user/getteacher");
                const data = await res.json();
                if (res.ok) {
                    setTeachers(data.users);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentUser.isAdmin) {
            fetchTeachers();
        }
    }, [currentUser._id]);

    return (
        <div className="change-schedule">
            <div className="change-schedule__in">
                <h1>Изменить расписание</h1>
                <div className="change-schedule__teachers-sch-cont">
                    <div className="change-schedule__teachers-sch-cont-flex">
                        <div className="schedule__teachers">
                            <h3 className="schedule__h3">Учителя</h3>
                            <ul className="schedule__teachers-list">
                                {subjects.map((s) => (
                                    <li
                                        key={shortid.generate()}
                                        className="schedule__subject-cont"
                                    >
                                        <div className="schedule__subject">
                                            <span className="schedule__subject-span">
                                                {s}
                                            </span>
                                        </div>
                                        {teachers.map((teacher) =>
                                            teacher.teacher.subject.length > 1
                                                ? teacher.teacher.subject.map(
                                                    (sub) =>
                                                        sub == s && (
                                                            <div
                                                                key={shortid.generate()}
                                                                className="schedule__teacher"
                                                                onClick={() => {
                                                                    setTeacherId(
                                                                        teacher._id
                                                                    );
                                                                    setTeacher(
                                                                        `${teacher.teacher.firstName} ${teacher.teacher.lastName}`
                                                                    );
                                                                    setSubject(s);
                                                                }}
                                                            >
                                                                <span className="schedule__teacher-span">{`${teacher.teacher.firstName} ${teacher.teacher.lastName}`}</span>
                                                            </div>
                                                        )
                                                )
                                                : teacher.teacher.subject == s && (
                                                    <div
                                                        onClick={() => {
                                                            setTeacherId(
                                                                teacher._id
                                                            );
                                                            setTeacher(
                                                                `${teacher.teacher.firstName} ${teacher.teacher.lastName}`
                                                            );
                                                            setSubject(s);
                                                        }}
                                                        className="schedule__teacher"
                                                        key={shortid.generate()}
                                                    >
                                                        <span className="schedule__teacher-span">{`${teacher.teacher.firstName} ${teacher.teacher.lastName}`}</span>
                                                    </div>
                                                )
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="schedule__group-schedule">
                            <table key={schedule._id} className="schedule__table">
                                <thead>
                                    <tr className="schedule__group-name">
                                        <th>{schedule.group}</th>
                                    </tr>
                                </thead>
                                <tbody className="schedule__thead">
                                    <tr>
                                        <th>*</th>
                                        {schedule.time &&
                                            schedule.time.map((time, index) => (
                                                <th
                                                    key={time}
                                                    className="schedule__th"
                                                >
                                                    {index + 1}
                                                </th>
                                            ))}
                                    </tr>
                                    {dayss.map((day, index) => (
                                        <tr>
                                            <th>
                                                {schedule[day] &&
                                                    schedule.days[index]}
                                            </th>
                                            {schedule[day] &&
                                            schedule[day].length > 0 ? (
                                                schedule[day].map((subject) => (
                                                    <td
                                                        onClick={(e) =>
                                                            changeSub(e, subject)
                                                        }
                                                        key={subject._id}
                                                    >
                                                        {subject.subject}
                                                    </td>
                                                ))
                                            ) : (
                                                <td>Предмет</td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                <button className="sign-up__button" onClick={AkdilaysSmartBlock}>
                    <span>Изменить</span>
                </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
