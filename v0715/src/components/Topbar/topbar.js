import './topbar.css'
import React, { useContext } from "react"
import { useLocation } from 'react-router-dom'
import Nav from '../Nav/nav'
import { userDataContext } from '../..'


const Topbar = () => {
    const location = useLocation()
    const userData = useContext(userDataContext)

    const logOut = () => {
        sessionStorage.removeItem("loggedUserNameForJootoPakuriApp")
        window.location.replace("/")
    }

    return (
        <div className='topbar'>
            <div className='userlabel'>
                <span>ログイン中のユーザー:{userData.userId}</span>
                <button className='btn' onClick={()=>logOut()}>ログアウト</button>
            </div>
            { location.pathname !== '/' && <Nav/>}
        </div>
    )
}

export default Topbar