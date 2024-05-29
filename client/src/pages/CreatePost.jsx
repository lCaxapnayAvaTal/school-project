import React, { useState } from 'react'
import '../pages-style/CreatePost.scss'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase.js';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';

export const CreatePost = () => {
    const [file, setFile] = useState(null)
    const [imageUploadProgress, setImageUploadProgress] = useState(null)
    const [imageUploadError, setImageUploadError] = useState(null)
    const [formData, setFormData] = useState({})
    const [publishError, setPublishError] = useState(null)
    

    const navigate = useNavigate()
    console.log(formData);
    const hadleUploadImage = async () => {
        try {
            if(!file){
                setImageUploadError('Пожалуйста выберите изображение')
                return;
            }
            setImageUploadError(null)
            const storage = getStorage(app)
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0))
                }, 
                (error) => {
                    setImageUploadError('Ошибка загрузки изображения')
                    setImageUploadProgress(null)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                            setImageUploadProgress(null);
                            setImageUploadError(null);
                            setFormData({...formData, image: downloadUrl})
                    })
                }
            )
        } catch (error) {
            setImageUploadError('Ошибка загрузки изображения')
            setImageUploadProgress(null)
            console.log(error);
        }
    }
    const hadleSubmit = async(e) => { //async because we need to wait for the response from API
        e.preventDefault()
        try {
            const res = await fetch('/api/post/create',{
                method:"POST",
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify(formData)
            })
            //eeee
            const data = await res.json()
            if(!res.ok){
                setPublishError(data.message)
                return
            }
            if(res.ok){
                setPublishError(null)
                navigate(`/post/${data.slug}`)
            }
        } catch (error) {
            setPublishError('Что то пошло не так')
        }
    }
    return (
        <div className='create-post'>
            <h1 className='create-post__h1'>Создать пост</h1>
            <form className='create-post__form' onSubmit={hadleSubmit}>
                <div className='create-post__form-wrapper'>
                    <div className='create-post__title-wrapper'>
                        <div className="dash-profile__input-const">
                            <div className="dash-profile__input">
                                <input type="text" placeholder='Заголовок' required
                                onChange={(e)=>setFormData({...formData, title: e.target.value})}
                                />
                            </div>
                        </div>
                        <select onChange={(e)=>{setFormData({...formData, category: e.target.value})}}>
                            <option value="Math">Математика</option>
                            <option value="английский">Английский</option>
                            <option value="модуль">Модуль</option>
                        </select>

                    </div>
                    <div className='create-post__image-wrapper'>
                        <div className='create-post__input-wrapper'>
                            <label htmlFor="file-input">
                                <div>Выберите файл</div>
                            </label>
                            <input type="file"accept='image/*' id="file-input" 
                                onChange={(e)=>setFile(e.target.files[0])}/>
                        </div>
                        <button className='header__sign-in' 
                        onClick={hadleUploadImage}
                        disabled={imageUploadProgress}
                        >
                            <span>
                                {imageUploadProgress?
                                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`}/>
                                :
                                'Загрузить изображение'}
                                </span>
                        </button>
                    </div>
                    {
                        imageUploadError && (
                            <div className='create-post__error'>{imageUploadError}</div>
                        )
                    }   
                    {
                        formData.image && (
                            <img src={formData.image} alt="upload" />
                        )
                    }
                    <ReactQuill className='placeholder' theme="snow" placeholder='Напишите чтонибудь...' required 
                        onChange={
                            (value)=>{
                                setFormData({...formData, content: value})
                            }
                        }
                    />

                    <button className="sign-up__button" type="submit">
                        <span>Опубликоать</span>
                    </button>
                    {
                        publishError && (
                            <div className='create-post__error'>{publishError}</div>
                        )
                    }
                </div>
            </form>
        </div>
    )
}
