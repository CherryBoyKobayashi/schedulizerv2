import './project.css'
import React, { useState, useContext, useEffect, useRef } from "react"
import Modal from 'react-modal/lib/components/Modal'
import TextField from "@mui/material/TextField"
import {MdEditNote, MdDeleteForever} from "react-icons/md"
import { userDataContext } from '../../index'
import Topbar from '../Topbar/topbar'
import {deleteProject} from '../../pages/methods/project-methods'
import { searchProject } from '../../pages/methods/search-methods'
import { useNavigate } from 'react-router-dom'
import ProjectInner from './projectInner'

const Project = () => {
    const userData = useContext(userDataContext)
    const [modalIsOpen, setIsOpen] = useState(false)
    const projectProps = useRef()
    const [results, setResults] = useState(Object.values(userData.projects).map((e => e.projectId)))
    useEffect(() => {
        setResults(Object.values(userData.projects).map((p => p.projectId)))
    }, [modalIsOpen])

    const inputHandler = (e) => {
        const lowerCase = e.target.value.toLowerCase()
        const newResults = searchProject(lowerCase, userData)
        setResults(newResults)
    }
    const deleteProjectHere = async (projectId) => {
        await deleteProject(userData, projectId)
        setResults(Object.values(userData.projects).map((p => p.projectId)))
    }
    const OverShow = (e, props) => {
        e.stopPropagation()
        e.target.id === 'newProjectBtn' ? projectProps.current = null : projectProps.current = props
        setIsOpen(true)
    }

    const ProjectChild = (props) => {
        const navigate = useNavigate()
        return (
            <div className='project' id={props.projectId} onClick={() => {navigate('/milestone/' + props.projectId)}}>
                <h4>{props.projectName}</h4>
                <div className='description'>{props.projectDescription}</div>
                <div className='other'>
                    <span>{props.projectDate}</span>
                    <button className='borderNone' onClick={(e) => {e.stopPropagation(); deleteProjectHere(props.projectId);}}>
                        <MdDeleteForever className='transformClass'/>
                    </button>
                    <button className='borderNone' onClick={(e) => {OverShow(e, props)}}>
                        <MdEditNote className='transformClass'/></button>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className='mainDiv'>
                <Topbar/>
                <Modal isOpen={modalIsOpen} overlayClassName={{base: "overlay-base", afterOpen: "overlay-after", beforeClose: "overlay-before"}} className={{base: "content-base", afterOpen: "content-after", beforeClose: "content-before"}} onRequestClose={() => setIsOpen(false)} closeTimeoutMS={500}>
                    <ProjectInner {...projectProps.current} setIsOpen={setIsOpen}/>
                </Modal>
                <div className="projectDiv">
                    <div className='projectTop'>
                        <div>
                            <TextField
                            id="outlined-basic"
                            onChange={inputHandler}
                            variant="outlined"
                            fullWidth
                            label="Search"
                            />
                        </div>
                        <button onClick={(e) => {OverShow(e)}} className='btn' id='newProjectBtn'>新規プロジェクト</button>
                    </div>
                    <div className='projectBottom'>
                        {Object.values(userData.projects)?.filter(project => results.includes(project.projectId)).map(((e, i) => <ProjectChild {...e} key={e.projectId}/>)) }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Project;