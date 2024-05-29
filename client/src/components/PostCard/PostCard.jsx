import React from 'react'
import './PostCard.scss'
import { Link } from 'react-router-dom'

export const PostCard = ({post}) => {
    return (
        <div className='post-card'>
            <Link  className='post-card__image' to={`/post/${post.slug}`}>
                <img src={post.image} alt="post cover" />
            </Link>
            <div className='post-card__info'>
                <p>{post.title}</p>
                <span>{post.category}</span>
                <Link to={`/post/${post.slug}`}>
                    Читать пост
                </Link>
            </div>
        </div>
    )
}
