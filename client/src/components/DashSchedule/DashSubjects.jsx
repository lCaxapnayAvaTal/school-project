import React from 'react'

export const DashSubjects = ({teacher}) => {
    return (
        <li key={teacher._id} className="schedule__teachers-cont">
        <div className="schedule__teacher-name">{`${teacher.teacher.firstName} ${teacher.teacher.lastName}`}</div>

        {teacher.teacher.subject.length>1 ? (
            teacher.teacher.subject.map((s)=>(<div className="schedule__teacher-subject">{s}</div>))
        
        ):<div className="schedule__teacher-subject">{teacher.teacher.subject}</div>}
        
    </li>
    )
}
