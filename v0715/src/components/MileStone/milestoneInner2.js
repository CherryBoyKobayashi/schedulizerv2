
import React, { memo, useContext, useState } from "react"
import Select from 'react-select'
import { AiFillStar, AiOutlineStar } from "react-icons/ai"
import { BiLabel } from "react-icons/bi"
import { BsBookmarkCheck, BsCalendarDate } from "react-icons/bs"
import { MdOutlineSupervisorAccount } from "react-icons/md"
import { useParams } from "react-router-dom"
import { userDataContext } from "../.."
import DatePicker from "react-datepicker"
import './milestone.css'
import "react-datepicker/dist/react-datepicker.css"
import { addTask } from "../../pages/methods/task-methods"
import { saveMilestone } from "../../pages/methods/milestone-methods"

const MilestoneInner2 = memo((props) => {
    const userData = useContext(userDataContext)
    const {projectId} = useParams()
    const milestoneObj = userData.projects[projectId].projectData
    const bool = Object.values(props).length === 1
    const setIsOpen = props.setIsOpen

    console.log(userData)
    console.log('ddddddd')
    console.log(props)
    const milestoneId = props.milestoneId
    const taskIndex = props.index
    const taskObj = bool ? null : milestoneObj[milestoneId].tasks[taskIndex].taskData
    console.log('ddd')
    console.log(taskObj)

    const startTime = bool ? new Date() : new Date(taskObj['start-time'])
    const finishTime = bool ? new Date() : new Date(taskObj['finish-time'])
    const [dateRange, setDateRange] = useState([new Date(startTime), new Date(finishTime)])
    const [startDate, endDate] = dateRange
    const allMembers = JSON.parse(localStorage.getItem("members"))
    const defaultMember = bool ? allMembers[0] : allMembers.find((h) => h.value === taskObj['members'][0])
    const [members, setMembers] = useState(defaultMember)
    const labels = [{value: 'high', label: 'High'}, {value: 'medium', label: 'Medium'}, {value: 'low', label: 'Low'}]
    const defaultLabel = bool ? {value: 'medium', label: 'Medium'} : labels.filter((l) => l.value === taskObj["priority"])
    const [label, setLabels] = useState(defaultLabel)
    const initChecked = bool ? false : taskObj['follow-state']
    const [checked, isSetChecked] = useState(initChecked)

    function dateHelper(date) {
        let myDate = new Date(date)
        const offset = myDate.getTimezoneOffset()
        myDate = new Date(myDate.getTime() - (offset*60*1000))
        return myDate.toISOString().split('T')[0];
    }
    const addTaskHere = async () => {
        //milestoneId, checkpoints, label
        // let startDate = sessionStorage.getItem("startDate");
        // let endDate = sessionStorage.getItem("endDate");
        // console.log(members)
        // let xmembers = JSON.parse(sessionStorage.getItem("newMembers"))
        // if(xmembers.length == undefined) {
        //     xmembers = [xmembers]
        // }
        const tasks = userData.projects[projectId].projectData[milestoneId].tasks
        console.log(tasks)
        const taskName = document.getElementById("taskName").value
        const taskDescription = document.getElementById("taskDescription").value
        const followState = document.getElementById("followState").checked
        await addTask(tasks, taskName, dateHelper(startDate), dateHelper(endDate), members.map(o => o.value), label, userData.userId, checkpoints, taskDescription, followState, projectId, milestoneId)
        await saveMilestone(projectId, milestoneObj)
    }
    return (
        <>
            <div className='milestoneNameDiv'>
                <span>{bool ? '' : milestoneObj[milestoneId].milestoneName}</span>
                <input className='initInput' type="checkbox" id="followState" defaultChecked={checked} onChange={(e) => isSetChecked(e.target.checked)}/>
                <label htmlFor='followState'>{checked ? <AiFillStar/> : <AiOutlineStar/>}</label>
            </div>
            <h4 className='textAlignLeft'>タスク名</h4>
            <div><input className='initInput' type='text' id="taskName"/></div>
            <h4 className='textAlignLeft'>タスク説明</h4>
            <div>
                <input className='initInput' type="text" id="taskDescription" defaultValue=""/>
            </div>
            <div className='nazoDiv'>
                <h4 className='textAlignLeft'><BsCalendarDate className='transformClass2'/>期間設定</h4>
                <DatePicker selectsRange={true} startDate={startDate} endDate={endDate} onChange={(update) => {setDateRange(update);}} isClearable={true} className='initInput'/>
                <h4 className='textAlignLeft'><MdOutlineSupervisorAccount className='transformClass2'/>担当者</h4>
                <Select value={members} isMulti options={allMembers} onChange={setMembers} defaultValue={members} />
                <h4 className='textAlignLeft'><BiLabel className='transformClass2'/>ラベル</h4>
                <Select options={labels} onChange={setLabels}  defaultValue={defaultLabel}></Select>
                <h4 className='textAlignLeft' style={{display: 'none'}}><BsBookmarkCheck className='transformClass2'/>チェックポイント</h4>
                <input defaultValue="Checkpoint 1" style={{display: 'none'}} type='text' id="checkpointName" />
            </div>
            <button className='btn minWidth' onClick={()=> {sessionStorage.setItem("startDate", startDate); sessionStorage.setItem("endDate", endDate); sessionStorage.setItem("newMembers", JSON.stringify(members)); addTaskHere(); setIsOpen(false);}}>追加</button>
        </>
    )
})


export default MilestoneInner2