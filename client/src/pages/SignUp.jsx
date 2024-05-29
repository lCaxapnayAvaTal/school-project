import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../pages-style/SignUp.scss";
import { OAuth } from "../components/OAuth";

export const SignUp = () => {
    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.email || !formData.password) {
            return setErrorMessage("Заполните все поля.");
        }
        try {
            setLoading(true);
            setErrorMessage(null);
            // const res = await axios.post("http://localhost:9753/api/auth/signup", {
            //     body: JSON.stringify(formData) 
            // });

            const res = await fetch("/api/auth/signup", {
                method: "POST", 
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(formData) 
            });

            const data = await res.json()

            if (data.success === false) {
                return setErrorMessage(data.message);
            }
            setLoading(false);
            if (res.ok) {
                navigate("/signin");
            }
        } catch (error) {
            setErrorMessage(error.message);
            console.log(error);
            setLoading(false);
        }
    };
    return (
        <div className="sign-up">
            <div className="sign-up__container">
                <div className="sign-up__left">
                    <Link to="/" className="header__link">
                        <span className="header__link-span">№ 87</span>
                        Лицей
                    </Link>
                    <p className="sign-up__paragraph">
                        Это демо-проект. Вы можете зарегистрироваться, используя
                        свой адрес электронной почты и пароль, или с помощью
                        Google.
                    </p>
                </div>
                <div className="sign-up__right">
                    <form onSubmit={handleSubmit}>
                        <div className="sign-up__username">
                            <label>Ваш никнейм</label>
                            <div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Имя"
                                        onChange={handleChange}
                                        id="username"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="sign-up__email">
                            <label>Ваш имейл</label>
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
                            <label>Ваш пароль</label>
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
                        <OAuth/>
                    </form>
                    <div className="sign-up__have-account">
                        <span>Уже есть аккаунт?</span>
                        <Link to="/signin">Войти</Link>
                    </div>
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
}
