import "./nav.css"
import React, { useContext, useState } from 'react'
import { useParams } from "react-router-dom"
import {BiMenu} from "react-icons/bi"
import {AiOutlineClose} from "react-icons/ai"
import { userDataContext } from '../..'

const navClick = () => {
    const nav = document.querySelector(".nav")
    const openIcon = document.querySelector(".open-nav .open")
    const closeIcon = document.querySelector(".open-nav .close")
    nav.classList.toggle("active")
    openIcon.classList.toggle("active")
    closeIcon.classList.toggle("active")
}

const Nav = () => {
    const {projectId} = useParams();
    const userData = useContext(userDataContext);
    if(userData.projects[projectId].projectData != undefined) {
        let counter = 0
        if (Object.keys(userData.projects[projectId].projectData).length != 0) {
            for (let milestone in userData.projects[projectId].projectData) {
                if(userData.projects[projectId].projectData[milestone].tasks?.length != 0) {
                    counter ++;
                }
            }
        }
        if (Object.keys(userData.projects[projectId].projectData).length == 0 || counter == 0) {
            return (
                <>
                    <div className="toggleDiv">
                        <div className="nav">
                            <ul>
                                <a href="/">project</a>
                                <a href={'/milestone/' + projectId}>milestone</a>
                            </ul>
                        </div>
                        <div className="open-nav" onClick={navClick}>
                            <BiMenu id="m" className="open"/>
                            <AiOutlineClose id="m" className="close"/>
                        </div>
                    </div>
                </>
            )
    } else {
        return (
            <>
                <div className="toggleDiv">
                    <div className="nav">
                        <ul>
                            <a href="/">project</a>
                            <a href={'/milestone/' + projectId}>milestone</a>
                            <a href={'/gantt/' + projectId}>gantt chart</a>
                        </ul>
                    </div>
                    <div className="open-nav" onClick={navClick}>
                        <BiMenu id="m" className="open"/>
                        <AiOutlineClose id="m" className="close"/>
                    </div>
                </div>
            </>
        )
    }
    }
}

export default Nav;