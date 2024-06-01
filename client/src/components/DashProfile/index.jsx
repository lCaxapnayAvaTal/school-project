import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import './DashProfile.scss'
import { useRef } from "react";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from "../../firebase.js";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { 
    updateStart, 
    updateSuccess, 
    updateFailure, 
    deleteUserStart, 
    deleteUserSuccess, 
    deleteUserFailure, 
    signoutSuccess 
} from "../../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import {HiOutlineExclamationCircle} from "react-icons/hi"
import { IoIosClose } from "react-icons/io";
import { Link } from "react-router-dom";


export const DashProfile = () => {
    const {currentUser, error, loading} = useSelector(state => state.user)
    const [imageFile, setImageFile] = useState(false)
    const [imageFileUrl, setImageFileUrl] = useState(false)
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(false)
    const [imageFileUploadError, setImageFileUploadError] = useState(false)
    const [imageFileUploading, setImageFileUploading] = useState(false)
    const [updateUserSuccess, setUpdateUserSuccess] = useState(false)
    const [updateUserError, setUpdateUserError] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({})
    const filePickerRef = useRef()
    const dispatch = useDispatch()
    const hadleImageChange = (e) => {
        const file = e.target.files[0]
        if(file){
            setImageFile(file)
            setImageFileUrl(URL.createObjectURL(file))
        }
    }


    useEffect(() => {
        if(imageFile){
            uploadImage()
        }
    },[imageFile])

    const uploadImage = async () => {
        setImageFileUploading(true)
        setImageFileUploadError(false)
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, imageFile)
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setImageFileUploadProgress(progress.toFixed(0))
            },
            (error) => {
                setImageFileUploadError('Не удалось загрузить изображение (файл должен быть меньше 2MB)')
                setImageFileUploadProgress(false)
                setImageFile(false)
                setImageFileUrl(false)
                setImageFileUploading(false)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL)=> {
                    setImageFileUrl(downloadURL);
                    setFormData({...formData, profilePicture: downloadURL});
                })
                setImageFileUploading(false)
            }
        )
    }
    const handleChange = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value})
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setUpdateUserError(false)
        setUpdateUserSuccess(false)
        if(Object.keys(formData).length === 0){
            setUpdateUserError('Нет изменений')
            return;
        }
        if(imageFileUploading){
            setUpdateUserError('Пожалуйста подождите пока картинка загрузится')
            return;
        }
        try {
            dispatch(updateStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                // withCredentials: 'include',
                // withCredentials: true
                
            });
            const data = await res.json();
            if(!res.ok){
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message)
            }else{
                dispatch(updateSuccess(data))
                setUpdateUserSuccess("Профиль пользователя обновлен успешно")
            }
        } catch (error) {
            dispatch(updateFailure(error.message))
            setUpdateUserError(error.message)
        }
    }
    const hadleDeleteUser = async () => {
        setShowModal(false)
        try {
            dispatch(deleteUserStart())
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE'
            });
            const data = await res.json()
            if(!res.ok){
                dispatch(deleteUserFailure(data.message))
            }else{
                dispatch(deleteUserSuccess(data)) 
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message))
        }
    }
    const handleSignout = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST',
            });
            const data = await res.json()
            if(!res.ok){
                console.log(data.message);
            }else(
                dispatch(signoutSuccess())
            )
        } catch (error) {
            console.log(error.message);
        }
    }
    return (
        <div className="dash-profile">
            <h1 className="dash-profile__h1">Profile</h1>
            <form onSubmit={handleSubmit} className="dash-profile__form">
                <input type="file" accept="image/*" onChange={hadleImageChange} ref={filePickerRef} className="dash-profile__file-input"/>
                <div className="dash-profile__image" onClick={() => filePickerRef.current.click()}>
                    {imageFileUploadProgress && (
                    <CircularProgressbar 
                        value={imageFileUploadProgress || 0} 
                        text={`${imageFileUploadProgress}%`}
                        strokeWidth={5}
                        styles={{
                            root:{
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                left: 0
                            },
                            path:{
                                stroke: `rgba(62,152,199, ${imageFileUploadProgress/100})`
                            }
                        }}
                    />
                    )}
                    <img src={imageFileUrl || currentUser.profilePicture} alt="user" className={
                        imageFileUploadProgress&&imageFileUploadProgress<100 ? `dash-profile__image-progress-active` : ''} />
                </div>
                {imageFileUploadError && <p className="dash-profile__img-error">{imageFileUploadError}</p>}
                
                <div className="dash-profile__input-const">
                    <div className="dash-profile__input">
                        <input type="text" id="username" placeholder="username" defaultValue={currentUser.student.isStudent ? currentUser.student.firstName:currentUser.username || currentUser.teacher.isTeacher && currentUser.teacher.firstName} onChange={handleChange} />
                    </div>
                </div>
                <div className="dash-profile__input-const">
                    <div className="dash-profile__input">
                        <input type="email" id="email" placeholder="email" defaultValue={currentUser.email} onChange={handleChange} />
                    </div>
                </div>
                <div className="dash-profile__input-const">
                    <div className="dash-profile__input">
                        <input type="text" id="password" placeholder="password" onChange={handleChange} />
                    </div>
                </div>
                <button className="dash-profile__update" disabled={loading||imageFileUploading}>
                    <span>
                        {loading ? 'Загрузка...' : 'Обновить'}
                        </span>
                </button>
                {currentUser.isAdmin && (
                    <Link to={'/create-post'} className="dash-profile__create-post">
                        <button >
                            <span>
                                Создать пост
                            </span>
                        </button>
                    </Link>
                )}
            </form>

            <div className="dash-profile__deleteandsignout">
                <span onClick={()=> setShowModal(true)}>Удалить аккаунт</span>
                <span onClick={handleSignout}>Выйти</span>
            </div>
            {
                updateUserSuccess &&
                <div className="dash-profile__update-success">{updateUserSuccess}</div>
            }
            {
                updateUserError &&
                <div className="dash-profile__update-error">{updateUserError}</div>
            }
            {
                error &&
                <div className="dash-profile__update-error">{error}</div>
            }
            <div className={showModal ? `dash-profile__modal-container active` :`dash-profile__modal-container`}>
                <div className="dash-profile__modal">
                    <div className="dash-profile__modal-close">
                        <button onClick={()=>setShowModal(false)}><IoIosClose/></button>
                    </div>
                    <div className="dash-profile__modal-info">
                        <HiOutlineExclamationCircle className="dash-profile__modal-exclamation"/>
                        <h3>Вы уверены что хотите удалить свой аккаунт?</h3>
                        <div className="dash-profile__modal-buttons">
                            <button className="dash-profile__modal-delete" onClick={hadleDeleteUser}>Да, удалить</button>
                            <button onClick={()=>setShowModal(false)}>Нет</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
