import './ganttChart.css'
import { useParams } from 'react-router-dom'
import Modal from 'react-modal/lib/components/Modal'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { BsBookmarkCheck, BsCalendarDate } from 'react-icons/bs'
import { MdOutlineSupervisorAccount } from 'react-icons/md'
import Select from 'react-select';
import { BiLabel } from 'react-icons/bi'
import DatePicker from "react-datepicker";
import { Gantt, ViewMode} from 'gantt-task-react'
import "gantt-task-react/dist/index.css"
import React, { useState, useContext, useEffect } from 'react'
import { userDataContext } from '../..'
import Topbar from '../Topbar/topbar'
import {deleteMilestone, saveMilestone} from '../../pages/methods/milestone-methods';
import {updateTask, deleteTaskP} from '../../pages/methods/task-methods';

const GanttChart = () => {
    const [view, setView] = useState(ViewMode.Day)
    const [isChecked, setIsChecked] = useState(true)
    const userData = useContext(userDataContext)
    const {projectId} = useParams()
    console.log(userData)
    const project = userData.projects[projectId].projectData
    const [modalIsOpen, setIsOpen] = useState(false)
    const allMembers = JSON.parse(localStorage.getItem("members"))
    const [, updateState] = useState()
    const forceUpdate = React.useCallback(() => updateState({}), [])
    const [bottomDivH, setBottomDivH] = useState(0)
    let columnWidth = 60
    if (view === ViewMode.Month) columnWidth = 300
    else if (view === ViewMode.Week) columnWidth = 250
    useEffect(() => setBottomDivH(document.querySelector('.bottomDiv').clientHeight))
    window.addEventListener('resize', () => {
        setBottomDivH(document.querySelector('.bottomDiv').clientHeight)
    });

    function dateHelper(date) {
        let myDate = new Date(date)
        const offset = myDate.getTimezoneOffset()
        myDate = new Date(myDate.getTime() - (offset*60*1000))
        return myDate.toISOString().split('T')[0]
    }
    async function updateMilestoneAndTasks(task) {
        project[task.id.substr(0, task.id.indexOf('&'))].tasks[task.id.substr(task.id.indexOf('&')+1)].taskData["start-time"] = dateHelper(task["start"])
        project[task.id.substr(0, task.id.indexOf('&'))].tasks[task.id.substr(task.id.indexOf('&')+1)].taskData["finish-time"] = dateHelper(task["end"])
        project[task.id.substr(0, task.id.indexOf('&'))].tasks[task.id.substr(task.id.indexOf('&')+1)].taskData["progress"] = task.progress
        let taskX = project[task.id.substr(0, task.id.indexOf('&'))].tasks[task.id.substr(task.id.indexOf('&')+1)]
        await updateTask(projectId, userData.projects[projectId].projectData[task.id.substr(0, task.id.indexOf('&'))].milestoneId, taskX, taskX.taskData["task-name"], taskX.taskData["start-time"], taskX.taskData["finish-time"], taskX.taskData["members"], taskX.taskData["priority"], taskX.taskData["creation-time"], taskX.taskData["creator"], taskX.taskData["checkpoints"], taskX.taskData["comments"], taskX.taskData["description"], taskX.taskData["follow-state"], taskX.taskData["progress"])
        setTasks(initTasks())
      }

    async function deleteMilestoneHere(milestoneId) {
        await deleteMilestone(project, milestoneId, projectId, userData.userId);
        forceUpdate();
    }
    async function deleteTaskHere(milestoneId, taskId) {
        await deleteTaskP(project[milestoneId].tasks, taskId, userData.userId);
        await saveMilestoneHere();
        forceUpdate();
    }
    async function deleteMilestoneAndTasks(id) {
        if (tasks[id].type === "project") {
            await deleteMilestoneHere(tasks[id].id)
        } else {
            var taskId = tasks[id].id
            await deleteTaskHere(taskId.substr(0, taskId.indexOf('&')), project[taskId.substr(0, taskId.indexOf('&'))].tasks[taskId.substr(taskId.indexOf('&')+1)].taskId);
        }
    }
    async function saveMilestoneHere() {
        await saveMilestone(projectId, userData.projects[projectId].projectData);
        forceUpdate();
    }

    const initTasks = () => {
        
        const tasks = []
        let counter = 0;
        for(let milestoneId in project){
            if (project[milestoneId].tasks.length != 0) {
                counter++;
                let milestone = project[milestoneId].tasks
                let startDate = new Date(3022,3,2)
                let finishDate = new Date(2020,3,2)
                let milestoneProgress = 0
                for(let taskId in milestone){
                    if (startDate > (new Date(milestone[taskId].taskData['start-time']))) {
                        startDate = (new Date(milestone[taskId].taskData['start-time']))
                    }
                    if (finishDate < (new Date(milestone[taskId].taskData['finish-time']))) {
                        finishDate = (new Date(milestone[taskId].taskData['finish-time']))
                    }
                    milestoneProgress+=milestone[taskId].taskData['progress']
                }
                milestoneProgress = milestoneProgress/milestone.length
                tasks.push({
                    start: startDate,
                    end: finishDate,
                    name: project[milestoneId].milestoneName,
                    id: milestoneId,
                    progress: milestoneProgress,
                    type: 'project',
                    hideChildren: false,
                })
                for(let taskId in milestone){
                    let task = milestone[taskId].taskData
                    tasks.push({
                        start: new Date(task['start-time']),
                        end: new Date(task['finish-time']),
                        name: task["task-name"],
                        id: milestoneId + "&" + taskId,
                        progress: task['progress'],
                        type: 'task',
                        project: milestoneId,
                    })
                }
            }
        }
        if (counter == 0) {
            window.location.replace('/milestone/' + projectId)
        } else {
            return tasks
        }
    }
    const TaskEditChild = () => {
        const milestoneId = sessionStorage.getItem("updateMilestoneId");
        const taskId = sessionStorage.getItem("updateTaskId");
        const taskObj = project[milestoneId].tasks[taskId]
        const startTime = taskObj.taskData['start-time']
        const finishTime = taskObj.taskData['finish-time']
        const [dateRange, setDateRange] = useState([new Date(startTime), new Date(finishTime)])
        const [startDate, endDate] = dateRange;
        const defaultMembers = taskObj.taskData['members'].map((m) => {return {value: m, label: m}})
        const [members, setMembers] = useState(defaultMembers)
        const labels = [{value: 'high', label: 'High'},{value: 'medium', label: 'Medium'},{value: 'low', label: 'Low'}]
        const priority = taskObj.taskData['priority']
        const defaultLabel = labels.find((l) => l.value === priority)
        const [label, setLabels] = useState(defaultLabel)
        const followState = taskObj.taskData['follow-state']
        const [checked, isSetChecked] = useState(followState)
        const checkpoints = taskObj.taskData['checkpoints']
        return (
            <>
                    <div className='milestoneNameDiv'>
                        <span>{project[milestoneId].milestoneName}</span>
                        <input type="checkbox" id="followState" defaultChecked={checked} onChange={(e) => isSetChecked(e.target.checked)}/>
                        <label htmlFor='followState'>{checked ? <AiFillStar/> : <AiOutlineStar/>}</label>
                    </div>
                    <h4 className='textAlignLeft'>タスク名</h4>
                    <div><input defaultValue={taskObj.taskData['task-name']} type='text' id="taskName" /></div>
                    <h4 className='textAlignLeft'>タスク説明</h4>
                    <div><input type="text" id="taskDescription" defaultValue={taskObj.taskData['description']}></input></div>
                    <div>
                        <h4 className='textAlignLeft'><BsCalendarDate className='transformClass2'/>期間設定</h4>
                        <DatePicker selectsRange={true} startDate={startDate} endDate={endDate} onChange={(update) => { setDateRange(update);}} isClearable={true}/>
                        <h4 className='textAlignLeft'><MdOutlineSupervisorAccount className='transformClass2'/>担当者</h4>
                        <Select value={members} isMulti options={allMembers} onChange={setMembers} defaultValue={members} />
                        <h4 className='textAlignLeft'><BiLabel className='transformClass2'/>ラベル</h4>
                        <Select options={labels} onChange={setLabels} defaultValue={label}></Select>
                        <h4 style={{display: 'none'}} className='textAlignLeft'><BsBookmarkCheck className='transformClass2'/>チェックポイント</h4><input style={{display: 'none'}} defaultValue={checkpoints} type='text' id="checkpointName" />
                    </div>
                    {/* <button className='minWidth' onClick={()=> {sessionStorage.setItem("startDate", startDate); sessionStorage.setItem("endDate", endDate); sessionStorage.setItem("newMembers", JSON.stringify(members)); updateTaskHere(milestoneId, taskId, checkpoints, [], label.value); setIsOpen(false);}}>更新</button> */}
                </>
        )
    }
    const [tasks, setTasks] = useState(initTasks())

    const getStartEndDateForProject = (tasks, milestoneId) => {
        const milestoneTasks = tasks.filter((t) => t.project === milestoneId)
        let start = milestoneTasks[0].start
        let end = milestoneTasks[0].end

        for (let i = 0; i < milestoneTasks.length; i++) {
            const task = milestoneTasks[i]
            if (start.getTime() > task.start.getTime()) start = task.start
            if (end.getTime() < task.end.getTime()) end = task.end
        }
        return [start, end]
    }
    async function handleTaskChange(task) {
        let newTasks = tasks.map(t => (t.id === task.id ? task : t))
        if (task.project) {
            const [start, end] = getStartEndDateForProject(newTasks, task.project)
            const project = newTasks[newTasks.findIndex(t => t.id === task.project)]
            if (project.start.getTime() !== start.getTime() || project.end.getTime() !== end.getTime()) {
                const changedProject = { ...project, start, end }
                newTasks = newTasks.map(t => t.id === task.project ? changedProject : t)
            }
        }
        await updateMilestoneAndTasks(task)
    }
    async function handleTaskDelete(task) {//Deleteボタン押下
        const conf = window.confirm("本当に消すでな " + task.name + "を?")
        if (conf) {
            await deleteMilestoneAndTasks(task.index)
            setTasks(tasks.filter(t => !t.id.includes(task.id)))
        }
        setTasks(initTasks())
    }
    const handleProgressChange = async (task) => {
        let newTasks = tasks.map(t => (t.id === task.id ? task : t))
        setTasks(newTasks)
        updateMilestoneAndTasks(task)
    }
    const handleDblClick = (task) => {
        // alert("ダブルクリックされた奴" + task.id)
        if(task.type === 'project') return
        const splitList = task.id.split('&')
        sessionStorage.setItem("updateMilestoneId", splitList[0])
        sessionStorage.setItem("updateTaskId", splitList[1])
        setIsOpen(true)
    }

    const handleSelect = (task, isSelected) => {
        console.log(task.name + " が " + (isSelected ? "選択された" : "選択解除"))
        console.log(isSelected)
    }
    const handleExpanderClick = (task) => {
        setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    }
    return (
        <>
            <div className='mainDiv'>
                <Topbar/>
                <Modal isOpen={modalIsOpen} overlayClassName={{base: "overlay-base", afterOpen: "overlay-after", beforeClose: "overlay-before"}} className={{base: "content-base", afterOpen: "content-after", beforeClose: "content-before"}} onRequestClose={() => setIsOpen(false)} closeTimeoutMS={500}>
                    <TaskEditChild/>
                </Modal>
                <div className='ganttChartDiv'>
                    <div className='topDiv'>
                        {/* <button onClick={() => setView(ViewMode.QuarterDay)}>Quarter of Day</button>
                        <button onClick={() => setView(ViewMode.HalfDay)}>Half of Day</button> */}
                        <button onClick={() => setView(ViewMode.Day)}>Day</button>
                        <button onClick={() => setView(ViewMode.Week)}>Week</button>
                        <button onClick={() => setView(ViewMode.Month)}>Month</button>
                        {sessionStorage.setItem("viewItem", view)}
                        <div className="Switch">
                            <label className="Switch_Toggle">
                                <input type="checkbox" defaultChecked={isChecked} onClick={() => setIsChecked(!isChecked)}/>
                                Show Task List
                            </label>
                        </div>
                    </div>
                    <div className='bottomDiv'>
                        <Gantt tasks={tasks} viewMode={view} onDateChange={handleTaskChange} onDelete={handleTaskDelete} onProgressChange={handleProgressChange} onDoubleClick={handleDblClick} onSelect={handleSelect} onExpanderClick={handleExpanderClick} listCellWidth={isChecked ? "155px" : ""} columnWidth={columnWidth} locale={new Intl.Locale('ja-Ja')}ganttHeight={bottomDivH - 100}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GanttChart