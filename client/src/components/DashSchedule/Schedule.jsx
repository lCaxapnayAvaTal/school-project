import React from "react";
import shortid from "shortid";

const dayss = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
];
export const Schedule = ({ schedule }) => {
    return (
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
                                <th key={shortid.generate()} className="schedule__th">
                                    {index + 1}
                                </th>
                            ))}
                    </tr>
                    {
                        dayss.map((day, index)=>(
                            <tr key={shortid.generate()}>
                                <th>{schedule[day]&&schedule.days[index]}</th>
                                {schedule[day] && schedule[day].length > 0 ? (
                                    schedule[day].map((subject) => (
                                        <td onClick={(e)=>
                                            console.log(
                                                subject.subject,
                                                subject.day,
                                                subject.time,
                                                subject.teacherId,
                                                subject.group,
                                                subject.lesson,
                                            )} key={subject._id}>{subject.subject}</td>
                                    ))
                                ) : (
                                    <td>Предмет</td>
                                )}
                            </tr>
                        ))
                    }
                    
                </tbody>
            </table>
        </div>
    );
};
