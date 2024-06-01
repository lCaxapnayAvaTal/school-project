import React, { useEffect, useState } from "react";
import "./DashSchedule.scss";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Schedule } from "./Schedule";
import { Group } from "./Group";
import { DashSubjects } from "./DashSubjects";
import shortid from "shortid";

const dayOfTheWeek = [
    {
        time: [
            "8:00 8:45",
            "8:50 9:35",
            "9:40 10:25",
            "10:35 11:20",
            "11:25 12:10",
            "12:15 13:00",
            "13:05 13:50",
        ],
    },
    {
        monday: [
            {
                subject: "Math",
                teacherId: "id",
                time: "8:00 8:45",
            },
            {
                subject: "Module",
                teacherId: "id",
                time: "8:50 9:35",
            },
            {
                subject: "Module",
                teacherId: "id",
                time: "9:40 10:25",
            },
            {
                subject: "English",
                teacherId: "id",
                time: "10:35 11:20",
            },
            {
                subject: "Chemistry",
                teacherId: "id",
                time: "11:25 12:10",
            },
            {
                subject: "Biology",
                teacherId: "id",
                time: "12:15 13:00",
            },
        ],
    },
    {
        tuesday: [
            "Module",
            "Module",
            "Math",
            "Math",
            "Biology",
            "History",
            "Russian language",
        ],
    },
];
const dayInRus = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
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
const daysInRussia = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
];
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
    "английский язык",
];
export const DashSchedule = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [schedules, setSchedules] = useState({});
    const [groups, setGroups] = useState({});
    const [group, setGroup] = useState("");
    const [all, setAll] = useState(true);
    const [formData, setFormData] = useState({});
    const [teachers, setTeachers] = useState([]);
    const [subject, setSubject] = useState();
    const [teacher, setTeacher] = useState(``);
    const [teacherId, setTeacherId] = useState();

    const handleChange = (e) => {
        const obj = {};
        days.forEach((day) => {
            obj[day] = times.map((time, index) => {
                dayInRus.map((rus) => ({
                    time: time,
                    day: day,
                    [e.target.id]: e.target.value.trim(),
                    lesson: index + 1,
                    dayInRus: rus,
                })
                );
            });
        });
        setFormData({ ...obj, [e.target.id]: e.target.value.trim() });
    };
    console.log(formData);
    useEffect(() => {
        if (all) {
            const fetchSchedules = async () => {
                try {
                    const res = await fetch("/api/schedule/getschedules");
                    const data = await res.json();
                    if (res.ok) {
                        setSchedules(data);
                        setGroups(
                            data.map((data) => {
                                return {
                                    group: data.group,
                                    groupId: data._id,
                                };
                            })
                        );
                    }
                } catch (error) {
                    console.log(error.message);
                }
            };
            if (currentUser.isAdmin && all) {
                fetchSchedules();
            }
        }
    }, [currentUser._id, all]);
    useEffect(() => {
        if (!all) {
            const handleClick = async () => {
                try {
                    const res = await fetch(
                        `/api/schedule/getSchedule/${group}`
                    );
                    const data = await res.json();
                    if (res.ok) {
                        setSchedules([data]);
                    }
                } catch (error) {
                    console.log(error.message);
                }
            };
            handleClick();
        }
    }, [group, all]);
    const createSchedule = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/schedule/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                alert("create successful");
            }
        } catch (error) {
            console.log(error);
        }
    };
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
    // subjects.map(s=>teachers.map(teacher=>teacher.teacher.subject.length>1?teacher.teacher.subject.map(sub=>sub==s&&console.log(s,sub)):teacher.teacher.subject==s &&console.log(s,'ddfdsdffdghrertghrfefghgh')))
    return (
        <div className="schedule">
            <div>
                <div className="sign-up__right">
                    <form onSubmit={createSchedule}>
                        <div className="sign-up__username">
                            <div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Группа"
                                        onChange={handleChange}
                                        id="group"
                                    />
                                </div>
                            </div>
                        </div>
                        <button className="header__sign-in">
                            <span>Добавить группу</span>
                        </button>
                    </form>
                </div>
                <div className="schedule__groups">
                    <div
                        className={
                            all
                                ? "schedule__tab-group-name active"
                                : "schedule__tab-group-name"
                        }
                    >
                        <span onClick={() => setAll(true)}>Все</span>
                    </div>
                    {currentUser.isAdmin && schedules.length > 0 ? (
                        groups.map((groupp) => (
                            <Group
                                key={groupp.groupId}
                                groupp={groupp}
                                all={all}
                                group={group}
                                setAll={setAll}
                                setGroup={setGroup}
                            />
                        ))
                    ) : (
                        <p>Загрузка</p>
                    )}
                </div>
                {currentUser.isAdmin && schedules.length > 0 ? (
                    schedules.map((schedule) => (
                        <div
                            className="schedule__group"
                            key={shortid.generate()}
                        >
                            <button className="header__sign-in">
                                <Link to={`/change-schedule/${schedule._id}`}>
                                    <span className="schedule__change">
                                        Изменить
                                    </span>
                                </Link>
                            </button>
                            <Schedule days={days} schedule={schedule} />
                        </div>
                    ))
                ) : (
                    <p>Загрузка</p>
                )}
            </div>
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
                                                      <span className="schedule__teacher-span">{`${teacher.teacher.firstName} ${teacher.teacher.lastName} ${teacher.teacher.thirdName} ${teacher.teacher.distinctiveNumber}`}</span>
                                                  </div>
                                              )
                                      )
                                    : teacher.teacher.subject == s && (
                                          <div
                                              onClick={() => {
                                                  setTeacherId(teacher._id);
                                                  setTeacher(
                                                      `${teacher.teacher.firstName} ${teacher.teacher.lastName}`
                                                  );
                                                  setSubject(s);
                                              }}
                                              className="schedule__teacher"
                                              key={shortid.generate()}
                                          >
                                              <span className="schedule__teacher-span">{`${teacher.teacher.firstName} ${teacher.teacher.lastName} ${teacher.teacher.thirdName} ${teacher.teacher.distinctiveNumber}`}</span>
                                          </div>
                                      )
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
