import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CreateStudent.scss";

export const CreateStudent = () => {
    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !formData.firstName ||
            !formData.lastName ||
            !formData.email ||
            !formData.password ||
            !formData.group
        ) {
            return setErrorMessage("Заполните все поля.");
        }
        try {
            setLoading(true);
            setErrorMessage(null);

            const res = await fetch("/api/auth/createStudent", {
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
                alert("CreateStudent successful");
                // navigate("/signin");
            }
        } catch (error) {
            setErrorMessage(error.message);
            console.log(error);
            setLoading(false);
        }
    };
    console.log(formData);
    return (
        <div className="create-student">
            <div className="sign-up__container">
                <div className="sign-up__right">
                    <h1>Добавить студента</h1>
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
                            <label>Группа</label>
                            <div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Группа"
                                        onChange={handleChange}
                                        id="group"
                                    />
                                </div>
                            </div>
                        </div>
                        <button className="sign-up__button" type="submit">
                            <span>
                                {loading ? (
                                    <>
                                        <span>Loading...</span>
                                    </>
                                ) : (
                                    "Зарегистрироваться"
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
