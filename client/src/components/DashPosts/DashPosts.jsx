import React, { useEffect, useState } from 'react'
import './DashPosts.scss'
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IoIosClose } from "react-icons/io";
import {HiOutlineExclamationCircle} from "react-icons/hi"


export const DashPosts = () => {
    const { currentUser } = useSelector((state)=>state.user)
    const [ userPosts, setUserPosts] = useState([])
    const [showMore, setShowMore] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [postIdToDelete, setPostIdToDelete] = useState('')
    console.log(userPosts);
    useEffect(()=>{
        const fetchPosts = async () => {
            try {
                const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`)
                const data = await res.json()
                if(res.ok){
                    setUserPosts(data.posts)
                    if(data.posts.length < 9){
                        setShowMore(false)
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        if(currentUser.isAdmin){
            fetchPosts()
        }
    },[currentUser._id])

    const handleShowmore = async (e) => {
        e.preventDefault()
        const startIndex = userPosts.length;
        try {
            const res = await fetch(
                `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
            );
            const data = await res.json(); //! Ждем ответ потом конвертируем в data
            if(res.ok){
                setUserPosts((prev)=> [...prev, ...data.posts]);
                if(data.posts.length < 9){ //!если данные которые мы запросили меньше 9 то...
                    setShowMore(false)
                }
            }
        } catch (error) {
            console.log(error.message);            
        }
    }
    const handleDeletePost = async() => {
        setShowModal(false)
        console.log(postIdToDelete);
        console.log(currentUser._id);
        try {
            console.log('ddddddddddddddd');
            const res = await fetch(
                `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
                {
                method: 'DELETE'
            })
            console.log(res);
            const data = await res.json()
            if(!res.ok){
                console.log(data.message);
                alert(data.message)
            }else{
                setUserPosts((prev)=>prev.filter((post)=>post._id!==postIdToDelete))
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    return (
        <div className='dashposts'>
            {
                currentUser.isAdmin && userPosts.length > 0 ? (
                    <div className='dashposts__relative'>
                        <table className='dashposts__table'>
                            <thead className='dashposts__thead'>
                                <tr className='dashposts__thead-tr'>
                                    <th className='dashposts__th'>дата обновлена</th>
                                    <th className='dashposts__th'>Изображение</th>
                                    <th className='dashposts__th'>Заголовок</th>
                                    <th className='dashposts__th'>Категория</th>
                                    <th className='dashposts__th'>Удалить</th>
                                    <th className='dashposts__th'><span>Редактировать</span></th>
                                </tr>
                            </thead>

                            {
                                userPosts.map((post) => (
                                    <tbody key={post._id} className='dashposts__tbody'>
                                        <tr className='dashposts__tbody-tr'>
                                            <td className='dashposts__tbody-td'>
                                                {new Date(post.updatedAt).toLocaleDateString()}</td>
                                            <td className='dashposts__tbody-td'>
                                                <Link to={`/post/${post.slug}`}>
                                                    <img src={post.image} alt="" />
                                                </Link>
                                            </td>
                                            <td className='dashposts__tbody-td'>
                                                <Link to={`/post/${post.slug}`} className='dashposts__post-slug'><span></span>{post.title}</Link>
                                            </td>
                                            <td className='dashposts__tbody-td'>{post.category}</td>
                                            <td className='dashposts__tbody-td'>
                                                <Link>
                                                    <span
                                                    onClick={()=>{
                                                        setShowModal(true)
                                                        setPostIdToDelete(post._id)
                                                    }}
                                                    className='dashposts__delete'>Удалить</span>
                                                    </Link>
                                            </td>
                                            <td className='dashposts__tbody-td'>
                                                <Link to={`/update-post/${post._id}`}>
                                                    <span className='dashposts__change'>Изменить</span>
                                                    </Link>
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
                ) : (
                    <p> У вас еще нет постов
                    </p>
                )
            }
            <div className={showModal ? `dash-profile__modal-container active` :`dash-profile__modal-container`}>
                <div className="dash-profile__modal">
                    <div className="dash-profile__modal-close">
                        <button onClick={()=>setShowModal(false)}><IoIosClose/></button>
                    </div>
                    <div className="dash-profile__modal-info">
                        <HiOutlineExclamationCircle className="dash-profile__modal-exclamation"/>
                        <h3>Вы уверены что хотите удалить этот пост?</h3>
                        <div className="dash-profile__modal-buttons">
                            <button className="dash-profile__modal-delete" onClick={handleDeletePost}>Да, удалить</button>
                            <button onClick={()=>setShowModal(false)}>Нет</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
