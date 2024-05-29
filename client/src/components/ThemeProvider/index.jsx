import React from 'react'
import { useSelector } from 'react-redux'
import './ThemeProvider.scss'

export const ThemeProvider = ({children}) => {
    const {theme} = useSelector(state => state.theme)
    return (
        <div className={theme}>
            <div className='theme-provider'>
                {children}
            </div>
        </div>
    )
}
