import './project.css'
import React, { memo, useContext, useState } from "react"
import {addProject, updateProject, copyProject} from '../../pages/methods/project-methods'
import { userDataContext } from '../..'

const ProjectInner = memo((props) => {
    const userData = useContext(userDataContext)
    const isNew = props.projectId == undefined
    const isNotCopy = props.projectName == undefined
    const setIsOpen = props.setIsOpen
    const [, updateState] = useState()
    const forceUpdate = React.useCallback(() => updateState({}), [])

    const addProjectDiv = async (e) => {
        const projectName = e.target.querySelector("#projectName").value
        const projectDescription = e.target.querySelector("#projectDescription").value
        e.preventDefault()
        await addProject(userData, projectName, projectDescription)
        setIsOpen(false)
        window.location.reload();
    }
    const updateProjectHere = async (e, projectId) => {
        const projectName = e.target.querySelector("#projectName").value
        const projectDescription = e.target.querySelector("#projectDescription").value
        e.preventDefault()
        await updateProject(userData, projectId, projectName, projectDescription)
        setIsOpen(false)
    }
    const copyProjectDiv = async (e) => {
        const projectName = e.target.querySelector("#projectName").value
        const projectDescription = e.target.querySelector("#projectDescription").value
        e.preventDefault()
        await copyProject(userData, projectName, projectDescription, props.projectData)
        setIsOpen(false)
        window.location.reload();
    }

    return (
        <>
            <form method='post' onSubmit={(e)=>{isNew ? (isNotCopy ? addProjectDiv(e) : copyProjectDiv(e)) : updateProjectHere(e, props.projectId);}}>
                <h4>プロジェクト名</h4>
                <input type='text' id="projectName" className='initInput' defaultValue={isNotCopy ? '' : props.projectName} />
                <h4>プロジェクト説明</h4>
                <div>
                    <textarea id="projectDescription" defaultValue={isNotCopy ? '' : props.projectDescription}></textarea>
                </div>
                <button type='submit' className='btn minWidth'>{isNew? '追加' : '保存'}</button>
            </form>
        </>
    )
})
export default ProjectInner