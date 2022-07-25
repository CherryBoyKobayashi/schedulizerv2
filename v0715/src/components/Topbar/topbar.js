import './topbar.css'
import React from "react";
import { useLocation } from 'react-router-dom'
import Nav from '../Nav/nav'


const Topbar = () => {
    const location = useLocation()
    return (
        <div className='topbar'>
            { location.pathname !== '/' && <Nav/>}
        </div>
    )
}

export default Topbar