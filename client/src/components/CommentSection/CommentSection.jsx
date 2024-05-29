import React, { useEffect, useState } from 'react'
import './CommentSection.scss'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Comment } from '../Comment/Comment.jsx'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { IoIosClose } from 'react-icons/io'

export const CommentSection = ({postId}) => {
    const {currentUser} = useSelector(state=>state.user)
    const [comment, setComment] = useState('')
    const [commentError, setCommentError] = useState(null)
    const [comments, setComments] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [commentToDelete, setCommentToDelete] = useState(null)
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault()
        if(comment.length>500){
            alert('Вы не можете добавить больше 500 символов')
            return
        }
        try {
            const res = await fetch('/api/comment/create', {
                method:"POST",
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({content: comment, postId, userId: currentUser._id})
            })
            const data = await res.json()
    
            if(res.ok){
                setComment('')
                setCommentError(null)
                setComments([data,...comments])
            }
            // if(res.ok){
            //     setPublishError(null)
            //     navigate(`/post/${data.slug}`)
            // }
            
        } catch (error) {
            setCommentError(error.message)
        }
    }
    useEffect(()=>{
        try {
            const getComments = async () => {
                const res = await fetch(`/api/comment/getPostComments/${postId}`)
                if(res.ok){
                    const data = await res.json()
                    setComments(data)
                }
            }   
            getComments()
        } catch (error) {
            console.log(error.message);
        }
    },[postId])
    const handleLike = async (commentId) => {
        try {
            if(!currentUser){
                navigate('/signin')
                return;
            }
            const res = await fetch(`/api/comment/likeComment/${commentId}`,{
                method:"PUT"
            });
            if(res.ok){
                const data = await res.json();
                setComments(comments.map((comment) => 
                    comment._id===commentId ? {
                        ...comment,
                        likes: data.likes,
                        numberOfLikes: data.numberOfLikes
                    } : comment

                ))
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    const handleEdit = async (comment, editedContent) =>{ 
        setComments(
            comments.map((c)=>
            c._id === comment._id ? {...c, content: editedContent} : c
            )
        )
    }
    const handleDelete = async (commentId) =>{ 
        setShowModal(false)
        try {
            if(!currentUser){
                navigate('/signin');
                return
            }
            const res = await fetch(`/api/comment/deleteComment/${commentId}`,{
                method: "DELETE"
            })
            if(res.ok){
                const data = await res.json()
                setComments(comments.filter((comment)=>comment._id !== commentId))
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    return (
        <div className='comment-section'>
            {currentUser?
            (
                <div className='comment-section__user-info'>
                    {/* <p>Signed in as:</p> */}
                    <img src={currentUser.profilePicture} alt="" />
                    <Link to={'/dashboard?tab=profile'}>@{currentUser.username}</Link>
                </div>
            ):(
                <div className='comment-section__sign-in'>
                    Вы должны войти чтобы прокоментировать
                    <Link to={'/signin'}>Войти</Link>
                </div>
            )}
            {currentUser&&(
                <form onSubmit={handleSubmit} className='comment-section__form'>
                    <textarea placeholder='Добавить коментарий...' className='comment-section__textarea'
                    onChange={e=>setComment(e.target.value)} value={comment}
                    maxlength={500}
                    ></textarea>
                    <div className='comment-section__under-textarea'>
                        <p>Осталось {500 - comment.length} символов</p>
                        <button className="header__sign-in">
                            <span>Отправить</span>
                        </button>
                    </div>
                    {commentError&&(
                        <div className='comment-section__error'>{commentError}</div>
                    )}
                </form>
            )}
            {comments.length===0?(
                <p>Еще нет комментариев</p>
            ):(
                <div>
                    <div className='comment-section__comments'>
                        <p>Комментарии</p>
                        <div className='comment-section__comments-length'>
                            <p>{comments.length}</p>
                        </div>
                    </div>
                    {comments.map(comment=>(
                        <Comment key={comment._id} 
                        comment={comment} 
                        onLike={handleLike} 
                        onEdit={handleEdit} 
                        onDelete={(commentId)=>{
                            setShowModal(true)
                            setCommentToDelete(commentId)
                        }}/>
                    ))}
                </div>
            )}
            <div className={showModal ? `dash-profile__modal-container active` :`dash-profile__modal-container`}>
                <div className="dash-profile__modal">
                    <div className="dash-profile__modal-close">
                        <button onClick={()=>setShowModal(false)}><IoIosClose/></button>
                    </div>
                    <div className="dash-profile__modal-info">
                        <HiOutlineExclamationCircle className="dash-profile__modal-exclamation"/>
                        <h3>Вы уверены что хотите удалить этот комментарий</h3>
                        <div className="dash-profile__modal-buttons">
                            <button className="dash-profile__modal-delete" onClick={()=>handleDelete(commentToDelete)}>Да, удалить</button>
                            <button onClick={()=>setShowModal(false)}>Нет</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
