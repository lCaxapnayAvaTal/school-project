import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Schedule } from "./Schedule";

export const DashStudentSchedule = () => {
    const { currentUser } = useSelector((state) => state.user);

    const [studentSchedule, setstudentSchedule] = useState();

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const res = await fetch(`/api/schedule/getschedules`);
                const data = await res.json();
                console.log(data);
                if (res.ok) {
                    const st = data.filter((s) => s.group === currentUser.student.group);
                    setstudentSchedule(st);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchSchedules();
        
    }, [currentUser._id]);
    console.log(studentSchedule);
    return (
        
        <div className="schedule">
            <div className="schedule__group">
                {studentSchedule ? (
                    studentSchedule.map((schedule) => (
                        <Schedule key={schedule.group} schedule={schedule} />
                    ))
                ) : (
                    <p>Загрузка</p>
                )}
            </div>
        </div>
    );
};
