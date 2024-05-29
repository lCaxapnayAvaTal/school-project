import React from "react";
import "./Footer.scss";
import { Link } from "react-router-dom";
import {
    BsFacebook,
    BsInstagram,
    BsTwitter,
    BsGithub,
    BsWhatsapp,
} from "react-icons/bs";
export const Footer = () => {
    return (
        <footer className="footer">
            <div>
                <div className="footer__container">
                    <div className="footer__header-link">
                        <Link to="/" className="header__link">
                            <span className="header__link-span">№ 87</span>
                            Лицей
                        </Link>
                    </div>
                    <div className="footer__items-wrapper">
                        <div>
                            <h2>О нас</h2>
                            <ul>
                                <li>100 Проектов</li>
                                <li>87 Лицей</li>
                            </ul>
                        </div>
                        <div>
                            <h2>Следите за нами</h2>
                            <ul>
                                <li>Instagram</li>
                                <li>Whatsap</li>
                            </ul>
                        </div>
                        <div>
                            <h2>Легальный</h2>
                            <ul>
                                <li>Политика конфиденциальности</li>
                                <li>Условия использования</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="footer__hr" />
                <div className="footer__bottom">
                    <div className="footer__copyright">
                        © {new Date().getFullYear()}
                        <Link to="/">87-Лицей</Link>
                    </div>
                    <div className="footer__social-media">
                        <div>
                            <Link>
                                <BsFacebook />
                            </Link>
                        </div>
                        <div>
                            <Link>
                                <BsInstagram />
                            </Link>
                        </div>
                        <div>
                            <Link>
                                <BsTwitter />
                            </Link>
                        </div>
                        <div>
                            <Link>
                                <BsGithub />
                            </Link>
                        </div>
                        <div>
                            <Link>
                                <BsWhatsapp />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
