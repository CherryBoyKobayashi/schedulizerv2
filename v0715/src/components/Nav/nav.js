import "./nav.css"
import {BiMenu} from "react-icons/bi"
import {AiOutlineClose} from "react-icons/ai"
import { useParams } from "react-router-dom"

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
    return (
        <>
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
        </>
    )
}

export default Nav;