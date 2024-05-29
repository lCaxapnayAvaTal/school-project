import React, { useEffect, useState } from 'react'
import './DashComments.scss'
import { useSelector } from "react-redux";
import { IoIosClose } from "react-icons/io";
import {HiOutlineExclamationCircle} from "react-icons/hi"
import {FaCheck,FaTimes} from 'react-icons/fa'

export const DashComments = () => {
    const { currentUser } = useSelector((state)=>state.user)
    const [ comments, setComments] = useState([])
    const [showMore, setShowMore] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [commentIdToDelete, setCommentIdToDelete] = useState('')
    useEffect(()=>{
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comment/getcomments`)
                const data = await res.json()
                if(res.ok){
                    setComments(data.comments)
                    if(data.comments.length < 9){
                        setShowMore(false)
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        if(currentUser.isAdmin){
            fetchComments()
        }
    },[currentUser._id])

    const handleShowmore = async (e) => {
        e.preventDefault()
        const startIndex = comments.length;
        try {
            const res = await fetch(
                `/api/comment/getcomments?startIndex=${startIndex}`
            );
            const data = await res.json(); //! Ждем ответ потом конвертируем в data
            if(res.ok){
                setComments((prev)=> [...prev, ...data.comments]);
                if(data.comments.length < 9){ //!если данные которые мы запросили меньше 9 то...
                    setShowMore(false)
                }
            }
        } catch (error) {
            console.log(error.message);            
        }
    }
    const handleDeleteComment = async() => {
        setShowModal(false)
        try {
            const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`,{
                    method: 'DELETE'
                })
            const data = await res.json()
            if(res.ok){
                setComments((prev)=>
                    prev.filter((comment)=>comment._id !== commentIdToDelete)
                )   
                setShowModal(false)
            }else{
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    console.log(comments);
    return (
        <div className='dashposts'>
            {
                currentUser.isAdmin && comments.length > 0 ? (
                    <div className='dashposts__relative'>
                        <table className='dashposts__table'>
                            <thead className='dashposts__thead'>
                                <tr className='dashposts__thead-tr'>
                                    <th className='dashposts__th'>Дата создания</th>
                                    <th className='dashposts__th dashcomment'>Комментарий</th>
                                    <th className='dashposts__th'>Лайки</th>
                                    <th className='dashposts__th'>ID поста</th>
                                    <th className='dashposts__th'>ID пользователя</th>
                                    <th className='dashposts__th'>Удалить</th>
                                </tr>
                            </thead>
                            {
                                comments.map((comment) => (
                                    <tbody key={comment._id} className='dashusers__tbody'>
                                        <tr className='dashposts__tbody-tr'>
                                            <td className='dashposts__tbody-td'>
                                                {new Date(comment.createdAt).toLocaleDateString()}</td>
                                            <td className='dashposts__tbody-td dashcomment'>
                                                {comment.content}
                                            </td>
                                            <td className='dashposts__tbody-td'>
                                                <span>{comment.numberOfLikes}</span>
                                            </td>
                                            <td className='dashposts__tbody-td'>{comment.postId}</td>
                                            <td className='dashposts__tbody-td'>
                                                {comment.userId}    
                                            </td>
                                            <td className='dashposts__tbody-td'>
                                                <span
                                                    onClick={()=>{
                                                        setShowModal(true)
                                                        setCommentIdToDelete(comment._id)
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
                ) : (<p> У вас еще нет комментариев</p>)
            }
            {/* {showModal&&( */}
            <div className={showModal ? `dash-profile__modal-container active` :`dash-profile__modal-container`}>
                <div className="dash-profile__modal">
                    <div className="dash-profile__modal-close">
                        <button onClick={()=>setShowModal(false)}><IoIosClose/></button>
                    </div>
                    <div className="dash-profile__modal-info">
                        <HiOutlineExclamationCircle className="dash-profile__modal-exclamation"/>
                        <h3>Вы уверены что хотите удалить этот комментарий?</h3>
                        <div className="dash-profile__modal-buttons">
                            <button className="dash-profile__modal-delete" onClick={handleDeleteComment}>Да, удалить</button>
                            <button onClick={()=>setShowModal(false)}>Нет</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* )} */}
        </div>
    )
}
