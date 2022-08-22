import './project.css'
import React, { memo, useContext, useState } from "react"
import {addProject, updateProject} from '../../pages/methods/project-methods'
import { userDataContext } from '../..'

const ProjectInner = memo((props) => {
    const userData = useContext(userDataContext)
    const bool = Object.keys(props).length === 1
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
    return (
        <>
            <form method='post' onSubmit={(e)=>{bool ? addProjectDiv(e) : updateProjectHere(e, props.projectId);}}>
                <h4>プロジェクト名</h4>
                <input type='text' id="projectName" className='initInput' defaultValue={bool ? '' : props.projectName} />
                <h4>プロジェクト説明</h4>
                <div>
                    <textarea id="projectDescription" defaultValue={bool ? '' : props.projectDescription}></textarea>
                </div>
                <button type='submit' className='btn minWidth'>{bool ? '追加' : '保存'}</button>
            </form>
        </>
    )
})
export default ProjectInner