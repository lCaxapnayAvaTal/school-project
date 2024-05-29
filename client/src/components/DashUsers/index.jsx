import React, { useEffect, useState } from 'react'
import './DashUsers.scss'
import { useSelector } from "react-redux";
import { IoIosClose } from "react-icons/io";
import {HiOutlineExclamationCircle} from "react-icons/hi"
import {FaCheck,FaTimes} from 'react-icons/fa'

export const DashUsers = () => {
    const { currentUser } = useSelector((state)=>state.user)
    const [ users, setUsers] = useState([])
    const [showMore, setShowMore] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [userIdToDelete, setUserIdToDelete] = useState('')
    useEffect(()=>{
        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/user/getusers`)
                const data = await res.json()
                if(res.ok){
                    setUsers(data.users)
                    if(data.users.length < 9){
                        setShowMore(false)
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        if(currentUser.isAdmin){
            fetchUsers()
        }
    },[currentUser._id])

    const handleShowmore = async (e) => {
        e.preventDefault()
        const startIndex = users.length;
        try {
            const res = await fetch(
                `/api/user/getusers?startIndex=${startIndex}`
            );
            const data = await res.json(); //! Ждем ответ потом конвертируем в data
            if(res.ok){
                setUsers((prev)=> [...prev, ...data.users]);
                if(data.users.length < 9){ //!если данные которые мы запросили меньше 9 то...
                    setShowMore(false)
                }
            }
        } catch (error) {
            console.log(error.message);            
        }
    }
    const handleDeleteUser = async() => {
        setShowModal(false)
        try {
            const res = await fetch(`/api/user/delete/${userIdToDelete}`,{
                    method: 'DELETE'
                })
            const data = await res.json()
            if(res.ok){
                setUsers((prev)=>prev.filter((user)=>user._id!==userIdToDelete))
                setShowModal(false)
            }else{
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    return (
        <div className='dashposts'>
            {
                currentUser.isAdmin && users.length > 0 ? (
                    <div className='dashposts__relative'>
                        <table className='dashposts__table'>
                            <thead className='dashposts__thead'>
                                <tr className='dashposts__thead-tr'>
                                    <th className='dashposts__th'>дата создания</th>
                                    <th className='dashposts__th'>Фото</th>
                                    <th className='dashposts__th'>Имя</th>
                                    <th className='dashposts__th'>Email</th>
                                    <th className='dashposts__th'>Админ</th>
                                    <th className='dashposts__th'>Удалить</th>
                                </tr>
                            </thead>
                            {
                                users.map((user) => (
                                    <tbody key={user._id} className='dashusers__tbody'>
                                        <tr className='dashposts__tbody-tr'>
                                            <td className='dashposts__tbody-td'>
                                                {new Date(user.createdAt).toLocaleDateString()}</td>
                                            <td className='dashposts__tbody-td'>
                                                <div className='dashposts__image'>
                                                    <img className='dashposts__user-image' src={user.profilePicture} alt={user.username} />

                                                </div>
                                            </td>
                                            <td className='dashposts__tbody-td'>
                                                <span>{user.student.isStudent ? user.student.firstName:user.username || user.teacher.isTeacher && user.teacher.firstName}</span>
                                            </td>
                                            <td className='dashposts__tbody-td'>{user.email}</td>
                                            <td className='dashposts__tbody-td'>{user.isAdmin?(<FaCheck className='dashposts__facheck'/>):(<FaTimes className='dashposts__fatimes'/>)}</td>
                                            <td className='dashposts__tbody-td'>
                                                <span
                                                    onClick={()=>{
                                                        setShowModal(true)
                                                        setUserIdToDelete(user._id)
                                                    }}
                                                    className='dashposts__delete'>Удалить</span>
                                            </td>
                                        </tr>
                                    </tbody >
                                ))
                            }
                        </table>
                        {
                            showMore && (
                                <button onClick={handleShowmore} className='dashposts__showmore'>Показать больше</button>
                            )
                        }
                    </div>
                ) : (<p> У вас еще нет пользователей</p>)
            }
            {/* {showModal&&( */}
            <div className={showModal ? `dash-profile__modal-container active` :`dash-profile__modal-container`}>
                <div className="dash-profile__modal">
                    <div className="dash-profile__modal-close">
                        <button onClick={()=>setShowModal(false)}><IoIosClose/></button>
                    </div>
                    <div className="dash-profile__modal-info">
                        <HiOutlineExclamationCircle className="dash-profile__modal-exclamation"/>
                        <h3>Вы уверены что хотите удалить этого пользователя?</h3>
                        <div className="dash-profile__modal-buttons">
                            <button className="dash-profile__modal-delete" onClick={handleDeleteUser}>Да, удалить</button>
                            <button onClick={()=>setShowModal(false)}>Нет</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* )} */}
        </div>
    )
}
