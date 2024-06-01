import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CreateTeacher.scss";

const times = [
    "8:00 8:45",
    "8:50 9:35",
    "9:40 10:25",
    "10:35 11:20",
    "11:25 12:10",
    "12:15 13:00",
    "13:05 13:50",
];
const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
];

export const CreateTeacher = () => {
    const [formData, setFormData] = useState({});
    const [formDataa, setFormDataa] = useState({});
    const [teacherSchedule, setteacherSchedule] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const handleChange = (e) => {
        const obj = {};
        days.forEach((day) => {
            obj[day] = times.map((time, index) => ({
                time: time,
                day: day,
                lesson: index + 1,
            }));
        });
        e.target.id == 'subject' ? (
            
            setFormData({ ...obj, ...formData, [e.target.id]: e.target.value.trim().split(' '), })
        ): setFormData({ ...obj, ...formData, [e.target.id]: e.target.value.trim()})
    };
    console.log(formData);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !formData.firstName ||
            !formData.lastName ||
            !formData.email ||
            !formData.password ||
            !formData.subject
        ) { return setErrorMessage("Заполните все поля."); }

        try {
            setLoading(true);
            setErrorMessage(null);

            const res = await fetch("/api/auth/createTeacher", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            
            if (data.success === false) {
                return setErrorMessage(data.message);
            }
            setLoading(false);
            if (res.ok) {
                alert("createTeacher successful");
                // navigate("/signin");
            }
        } catch (error) {
            setErrorMessage(error.message);
            console.log(error);
            setLoading(false);
        }
    };
    return (
        <div className="create-teacher">
            <div className="sign-up__container">
                <div className="sign-up__right">
                    <h1>Добавить учителя</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="sign-up__username">
                            <label>Имя</label>
                            <div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Имя"
                                        onChange={handleChange}
                                        id="firstName"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="sign-up__username">
                            <label>Фамилия</label>
                            <div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Фамилия"
                                        onChange={handleChange}
                                        id="lastName"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="sign-up__username">
                            <label>Отчество</label>
                            <div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Отчество"
                                        onChange={handleChange}
                                        id="thirdName"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="sign-up__email">
                            <label>Имейл</label>
                            <div>
                                <div>
                                    <input
                                        type="email"
                                        placeholder="name@gmail.com"
                                        onChange={handleChange}
                                        id="email"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="sign-up__password">
                            <label>Пароль</label>
                            <div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Пароль"
                                        onChange={handleChange}
                                        id="password"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="sign-up__password">
                            <label>Предмет</label>
                            <div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Предмет"
                                        onChange={handleChange}
                                        id="subject"
                                    />
                                </div>
                            </div>
                        </div>
                        <button className="sign-up__button" type="submit">
                            <span>
                                {loading ? (
                                    <>
                                        <span>Загрузка...</span>
                                    </>
                                ) : (
                                    "Зарегистрировать"
                                )}
                            </span>
                        </button>
                    </form>

                    {errorMessage && (
                        <div className="sign-up__error">
                            <div>
                                <span>{errorMessage}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
