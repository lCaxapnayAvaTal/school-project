import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../pages-style/SignUp.scss";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";
import { OAuth } from "../components/OAuth";

export const SignIn = () => {
    const [formData, setFormData] = useState({});
    // const [errorMessage, setErrorMessage] = useState(null);
    // const [loading, setLoading] = useState(false);
    const {loading, error: errorMessage} = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            return dispatch(signInFailure("Заполните все поля."))
        }
        try {
            dispatch(signInStart());
            const res = await fetch("/api/auth/signin", {
                method: "POST", 
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(formData) 
            });
            const data = await res.json()
            if (data.success === false) {
                dispatch(signInFailure(data.message))
            }
            if (res.ok) {
                dispatch(signInSuccess(data))
                navigate("/");
            }
        } catch (error) {
            dispatch(signInFailure(error.message))
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
                        Это демо-проект. Вы можете войти, используя
                        свой адрес электронной почты и пароль, или с помощью
                        Google.
                    </p>
                </div>
                <div className="sign-up__right">
                    <form onSubmit={handleSubmit}>
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
                                        <span>Загрузка...</span>
                                    </>
                                ) : (
                                    "Войти"
                                )}
                            </span>
                        </button>
                        <OAuth/>
                        
                    </form>
                    <div className="sign-up__have-account">
                        <span>Еще не зарегистрированы?</span>
                        <Link to="/signup">Зарегистрироваться</Link>
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
};
