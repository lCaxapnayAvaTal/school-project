import React, { useEffect, useState } from 'react'
import {useLocation} from 'react-router-dom'
import { DashSidebar } from '../components/DashSidebar'
import { DashProfile } from '../components/DashProfile'
import '../pages-style/Dashboard.scss'
import { DashPosts } from '../components/DashPosts/DashPosts'
import { DashUsers } from '../components/DashUsers'
import { DashComments } from '../components/DashComments/DashComments'
import { DashboardComponent } from '../components/DashboardComponent/DashboardComponent'
import { DashSchedule } from '../components/DashSchedule/DashSchedule'
import { CreateTeacher } from '../components/CreateTeacher/CreateTeacher'
import { CreateStudent } from '../components/CreateStudent/CreateStudent' 
import { DashTeacherSchedule } from '../components/DashSchedule/DashTeacherSchedule'
import { DashStudentSchedule } from '../components/DashSchedule/DashStudentSchedule'

export const Dashboard = () => {
    const location = useLocation()
    const [tab, setTab] = useState('')
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const tabFromUrl = urlParams.get('tab')
        if(tabFromUrl){
            setTab(tabFromUrl)
        }
    },[location.search])
    return (
        <div className='dash-board'>
            <div className='dashsidebar'>
                {/*//! Sidebar */}
                <DashSidebar/>
            </div>
            
            {/*//! Profile */}
            {tab==='profile' && <DashProfile/>}
            {/*//! Posts */}
            {tab==='posts' && <DashPosts/>}
            {/*//! Users */}
            {tab==='users' && <DashUsers/>}
            {/*//! Comments */}
            {tab==='comments' && <DashComments/>}
            {/*//! Dash */}
            {tab==='dash' && <DashboardComponent/>}

            {/*//! DashSchedule */}
            {tab==='schedule' && <DashSchedule/>}

            {/*//! DashTeacherSchedule */}
            {tab==='teacherschedule' && <DashTeacherSchedule/>}
            {/*//! DashStudentSchedule */}
            {tab==='studentschedule' && <DashStudentSchedule/>}
            
            {/*//! createTeacher */}
            {tab==='createTeacher' && <CreateTeacher/>}
            {/*//! createStudent */}
            {tab==='createStudent' && <CreateStudent/>}
        </div>
    )
}
