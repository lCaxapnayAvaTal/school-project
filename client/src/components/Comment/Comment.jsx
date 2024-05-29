import moment from 'moment'
import React, { useEffect, useState } from "react";
import "./Comment.scss";
import {FaThumbsUp} from 'react-icons/fa';
import { useSelector } from 'react-redux';

export const Comment = ({ comment, onLike, onEdit, onDelete }) => {
    const {currentUser} = useSelector(state => state.user)
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`);
                const data = await res.json();
                if (res.ok) {
                    setUser(data)
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        getUser();
    }, [comment]);
    const handleEdit = async () => {
        setIsEditing(true)
        setEditedContent(comment.content)
    }
    const handleSave = async () => {
        try {
            const res = await fetch(`/api/comment/editComment/${comment._id}`,{
                method: "PUT",
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    content: editedContent
                })
            })
            const data = await res.json()
            if(res.ok){
                setIsEditing(false)
                onEdit(comment, editedContent)
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    return (
        <div className="comment">
            <div className="comment__image">
                <img src={user.profilePicture} alt={user.username} />
            </div>
            <div className="comment__info">
                <div className="comment__user-data">
                    <span>{user?`@${user.username}`:'анонимный пользователь'}</span>
                    <span>{moment(comment.createdAt).fromNow()}</span>
                </div>
                {isEditing?(
                    <div className='comment__change-container'>
                        <textarea className='comment__textarea' value={editedContent} onChange={(e)=>setEditedContent(e.target.value)} maxlength={500}></textarea>
                        <div className='comment__change-buttons'>
                            <button className='comment__change-save' onClick={handleSave}><span>Сохранить</span></button>
                            <button className='header__sign-in' onClick={()=>setIsEditing(false)}><span>Отмена</span></button>
                        </div>
                    </div>
                        
                    ):(
                        <div>
                            <p className='comment__content'>{comment.content}</p>
                            <div className='comment__edit-container'>
                                <button className={currentUser && comment.likes.includes(currentUser._id)?`comment__like active` : `comment__like`} onClick={()=>onLike(comment._id)}>
                                    <FaThumbsUp/>
                                </button>
                                <p className='comment__like-count'>
                                    {
                                        comment.numberOfLikes > 0 && comment.numberOfLikes + ' ' + (comment.numberOfLikes === 1 ? "лайк" : "лайков" )
                                    }
                                </p>
                                {
                                    currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                                        <>
                                            <button onClick={handleEdit} className='comment__like-change'>
                                                Изменить
                                            </button>
                                            <button className='comment__like-delete' onClick={()=>onDelete(comment._id)}>
                                                Удалить
                                            </button>
                                        </>

                                    ) 
                                }
                            </div>

                        </div>
                    )}
            </div>
        </div>
    )
};
