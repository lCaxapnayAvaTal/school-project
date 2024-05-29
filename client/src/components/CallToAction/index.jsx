import React from 'react'
import './CallToAction.scss'
export const CallToAction = () => {
    return (
        <div className='call-to-action'>
            <div className='call-to-action__info'>
                <h2>Хотите поступить?</h2>
                <p>Хотите поступить?</p>
                <button className="call-to-action__button" type="submit">
                    <span>
                        <a href="">Отпрвить заявку</a>
                    </span>
                </button>
            </div>
            <div className='call-to-action__image'>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShd7rqYDVmv8tDkFPNP2UQrzzANkLB8DUYpVf_IazK8g&s" alt="" />
            </div>
        </div>
    )
}
