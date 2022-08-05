import React, { useContext } from "react"
import { useParams } from "react-router-dom"
import { userDataContext } from "../.."
import { addMilestone, saveMilestone, updateMilestone } from "../../pages/methods/milestone-methods"
import ColorPicker from "./colorPicker"

const MilestoneInner1 = (props) => {
    const userData = useContext(userDataContext)
    const {projectId} = useParams()
    const milestoneObj = userData.projects[projectId].projectData
    const bool = Object.values(props).length === 1
    const setIsOpen = props.setIsOpen

    const addMilestoneHere = async () => {
        const milestoneName = document.getElementById("milestoneName").value
        const milestoneColor = document.getElementById("milestoneColor").style.background
        await addMilestone(milestoneObj, milestoneName, milestoneColor, projectId)
        await saveMilestone(projectId, milestoneObj)
        setIsOpen(false)
    }
    const updateMilestoneHere = async (milestoneId, tasks) => {
        const milestoneName = document.getElementById("milestoneName").value
        const milestoneColor = document.getElementById("milestoneColor").style.background
        await updateMilestone(milestoneObj, milestoneId, milestoneName, milestoneColor, tasks, projectId)
        await saveMilestone(projectId, milestoneObj)
        setIsOpen(false)
    }
    return (
        <>
            <h4>マイルストーン名</h4>
            <input type='text' id="milestoneName" defaultValue={bool ? '' : milestoneObj[props.milestoneId].milestoneName} className='initInput'/>
            <h4>マイルストーン色</h4>
            <div className='colorPickDiv'>
                <ColorPicker color={bool ? '' : props.color}/>
            </div>
            <button className='btn minWidth' onClick={()=>{bool ? addMilestoneHere() : updateMilestoneHere(props.milestoneId, props.tasks)}}>
                {bool ? '追加' : '変更'}
            </button>
        </>
    )
}

export default MilestoneInner1