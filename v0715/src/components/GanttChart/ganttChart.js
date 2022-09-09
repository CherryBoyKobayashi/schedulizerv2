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

let keydown = false

const GanttChart = () => {
    const [view, setView] = useState(ViewMode.Day)
    const [isChecked, setIsChecked] = useState(true)
    const userData = useContext(userDataContext)
    const {projectId} = useParams()
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
    project.sort(function(a,b) {
        if (a.superMilestoneName<b.superMilestoneName){
            return -1;
        } 
        if (a.superMilestoneName>b.superMilestoneName){
            return 1;
        } 
        else {
            return 0;
        }
    })    
    project.sort(function(a,b) {
        if (a.superMilestoneName==b.superMilestoneName) {
            if (a.milestoneName<b.milestoneName){
                return -1;
            } 
            if (a.milestoneName>b.milestoneName){
                return 1;
            } 
            else {
                return 0;
            }
        }
    })
    let superMilestones = []
    for (let m in project) {
        if(superMilestones.indexOf(project[m].superMilestoneName) === -1)
        superMilestones.push(project[m].superMilestoneName)
    }

    function dateHelper(date) {
        let myDate = new Date(date)
        const offset = myDate.getTimezoneOffset()
        myDate = new Date(myDate.getTime() - (offset*60*1000))
        return myDate.toISOString().split('T')[0]
    }
    async function updateProgress(task) {
        project[task.id.substr(0, task.id.indexOf('&'))].tasks[task.id.substr(task.id.indexOf('&')+1)].taskData["progress"] = task.progress
        let taskX = project[task.id.substr(0, task.id.indexOf('&'))].tasks[task.id.substr(task.id.indexOf('&')+1)]
        await updateTask(projectId, userData.projects[projectId].projectData[task.id.substr(0, task.id.indexOf('&'))].milestoneId, taskX, taskX.taskData["task-name"], taskX.taskData["start-time"], taskX.taskData["finish-time"], taskX.taskData["members"], taskX.taskData["priority"], taskX.taskData["creation-time"], taskX.taskData["creator"], taskX.taskData["checkpoints"], taskX.taskData["comments"], taskX.taskData["description"], taskX.taskData["follow-state"], taskX.taskData["progress"])
        setIsOpen(false)
        setTasks(initTasks())
      }
    async function updateMilestoneAndTasks(task) {
        console.log(keydown)
        if(keydown) {
            project[task.id.substr(0, task.id.indexOf('&'))].tasks[task.id.substr(task.id.indexOf('&')+1)].taskData["start-time"] = dateHelper(task["start"])
            project[task.id.substr(0, task.id.indexOf('&'))].tasks[task.id.substr(task.id.indexOf('&')+1)].taskData["finish-time"] = dateHelper(task["end"])    
            keydown = false
        }
        project[task.id.substr(0, task.id.indexOf('&'))].tasks[task.id.substr(task.id.indexOf('&')+1)].taskData["real-start-time"] = dateHelper(task["start"])
        project[task.id.substr(0, task.id.indexOf('&'))].tasks[task.id.substr(task.id.indexOf('&')+1)].taskData["real-finish-time"] = dateHelper(task["end"])
        project[task.id.substr(0, task.id.indexOf('&'))].tasks[task.id.substr(task.id.indexOf('&')+1)].taskData["progress"] = task.progress
        let taskX = project[task.id.substr(0, task.id.indexOf('&'))].tasks[task.id.substr(task.id.indexOf('&')+1)]
        await updateTask(projectId, userData.projects[projectId].projectData[task.id.substr(0, task.id.indexOf('&'))].milestoneId, taskX, taskX.taskData["task-name"], taskX.taskData["start-time"], taskX.taskData["finish-time"], taskX.taskData["members"], taskX.taskData["priority"], taskX.taskData["creation-time"], taskX.taskData["creator"], taskX.taskData["checkpoints"], taskX.taskData["comments"], taskX.taskData["description"], taskX.taskData["follow-state"], taskX.taskData["progress"], taskX.taskData["real-start-time"], taskX.taskData["real-finish-time"])
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
        let finishedTasks = []
        for(let superMilestone in superMilestones) {
            let unfinishedMilestones = []
            let superStartDate = new Date(3022,3,2)
            let superFinishDate = new Date(2020,3,2)
            let superMilestoneProgress = 0
            let superCounter = 0
            for(let milestoneId in project){
                if (project[milestoneId].tasks.length != 0) {
                    if(project[milestoneId].superMilestoneName == superMilestones[superMilestone]){
                        counter++;
                let milestone = project[milestoneId].tasks
                let startDate = new Date(3022,3,2)
                let finishDate = new Date(2020,3,2)
                let milestoneProgress = 0
                let unFinishedTasks = []
                
                for(let taskId in milestone){
                    let task = milestone[taskId].taskData
                    if (task['progress'] == 100) {
                        finishedTasks.push({
                            start: new Date(task['start-time']),
                            end: new Date(task['finish-time']),
                            name: task["task-name"],
                            id: milestoneId + "&" + taskId,
                            progress: task['progress'],
                            type: 'task',
                            project: "完了タスク",
                            styles: { progressColor: "#E8E8E8", progressSelectedColor: '#0900FF' }
                        })
                    } else {
                        let tid
                        if (taskId==0){
                            tid = milestoneId
                        } else {
                            tid = "y" + milestoneId + "&" + (taskId-1)
                        }
                        unFinishedTasks.push({
                            id: "y" + milestoneId + "&" + taskId,
                            start: new Date(task['start-time']),
                            end: new Date(task['finish-time']),
                            name: task["task-name"] + "(予定)",
                            progress: 0,
                            type: 'task',
                            project: milestoneId,
                            dependencies: [tid],
                            styles: { progressColor: '#1a184a', progressSelectedColor: '#1a184a' },
                            isDisabled: true,
                        })
                        unFinishedTasks.push({
                            start: new Date(task['real-start-time']),
                            end: new Date(task['real-finish-time']),
                            name: task["task-name"] + "(実績)",
                            id: milestoneId + "&" + taskId,
                            progress: task['progress'],
                            type: 'task',
                            dependencies: ["y" + milestoneId + "&" + taskId],
                            project: milestoneId,
                            styles: { progressColor: '#3F3ABA', progressSelectedColor: '#0900FF' },
                        })
                    }
                }

                if(unFinishedTasks.length != 0) {
                    for(let taskId in milestone){
                        if (startDate > (new Date(milestone[taskId].taskData['start-time']))) {
                            startDate = (new Date(milestone[taskId].taskData['start-time']))
                        }
                        if (finishDate < (new Date(milestone[taskId].taskData['finish-time']))) {
                            finishDate = (new Date(milestone[taskId].taskData['finish-time']))
                        }
                        if (superStartDate > (new Date(milestone[taskId].taskData['start-time']))) {
                            superStartDate = (new Date(milestone[taskId].taskData['start-time']))
                        }
                        if (superFinishDate < (new Date(milestone[taskId].taskData['finish-time']))) {
                            superFinishDate = (new Date(milestone[taskId].taskData['finish-time']))
                        }
                        milestoneProgress+=parseInt(milestone[taskId].taskData['progress'])
                    }
                    milestoneProgress = milestoneProgress/milestone.length
                    superMilestoneProgress += milestoneProgress
                    superCounter++
                    unfinishedMilestones.push({
                        start: startDate,
                        end: finishDate,
                        name: project[milestoneId].milestoneName,
                        id: milestoneId,
                        progress: milestoneProgress,
                        type: 'project',
                        hideChildren: false,
                        styles: {  backgroundColor: '#d658fc', progressColor: '#612873' }
                    })

                    for (let task in unFinishedTasks) {
                        unfinishedMilestones.push(unFinishedTasks[task])
                    }
                }
                    }
                }
            }

            if(unfinishedMilestones.length != 0) {
                tasks.push({
                    start: superStartDate,
                    end: superFinishDate,
                    name: superMilestones[superMilestone],
                    id: superMilestones[superMilestone],
                    progress: superMilestoneProgress/superCounter,
                    type: 'project',
                    styles: {  backgroundColor: '#fc2803', progressColor: '#731c0d' }
                })

                for (let i in unfinishedMilestones) {
                    tasks.push(unfinishedMilestones[i])
                }
            }
        }
        if(finishedTasks.length != 0){
            let startDate = new Date(3022,3,2)
            let finishDate = new Date(2020,3,2)
            
            for(let task in finishedTasks){
                console.log(startDate > finishedTasks[task].start)
                if (startDate > finishedTasks[task].start) {
                    startDate = finishedTasks[task].start
                }
                if (finishDate < finishedTasks[task].end) {
                    finishDate = finishedTasks[task].end
                }
            }
            tasks.push({
                start: startDate,
                end: finishDate,
                name: "完了タスク",
                id: "完了タスク",
                progress: 100,
                type: 'project',
                hideChildren: true,
                styles: {  backgroundColor: '#731c0d', progressColor: '#731c0d' }
            })
            for (let i in finishedTasks) {
                tasks.push(finishedTasks[i])
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
        let task = JSON.parse(sessionStorage.getItem("updateTask"))
        if (keydown) {
            keydown = false
            return (
                <>
                        <h4 className='textAlignLeft'>プログレス</h4>
                        <div><input defaultValue={task['progress']} type='number' id="taskProgress" /></div>
                        <button className='minWidth' onClick={()=> {task.progress = document.getElementById("taskProgress").value; updateProgress(task)}}>更新</button>
                    </>
            )
        } else {
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
        if (userData.userId == userData.projects[projectId].projectCreator) {
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
    }
    async function handleTaskDelete(task) {//Deleteボタン押下
        if (userData.userId == userData.projects[projectId].projectCreator) {
            const conf = window.confirm("本当に消すでな " + task.name + "を?")
            if (conf) {
                await deleteMilestoneAndTasks(task.index)
                setTasks(tasks.filter(t => !t.id.includes(task.id)))
            }
            setTasks(initTasks())
        }
    }
    const handleProgressChange = async (task) => {
        console.log(task)
        let newTasks = tasks.map(t => (t.id === task.id ? task : t))
        setTasks(newTasks)
        updateMilestoneAndTasks(task)
    }
    const handleDblClick = (task) => {
        if(task.type === 'project') return
        const splitList = task.id.split('&')
        sessionStorage.setItem("updateMilestoneId", splitList[0])
        sessionStorage.setItem("updateTaskId", splitList[1])
        sessionStorage.setItem("updateTask", JSON.stringify(task))
        setIsOpen(true)
    }
    const handleExpanderClick = (task) => {
        setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    }
    document.addEventListener("keyup", function(event) {
        if (event.key == 'Shift') {
          keydown = true
        }
    });
    return (
        <>
            <div className='mainDiv'>
                <Topbar/>
                <Modal isOpen={modalIsOpen} overlayClassName={{base: "overlay-base", afterOpen: "overlay-after", beforeClose: "overlay-before"}} className={{base: "content-base", afterOpen: "content-after", beforeClose: "content-before"}} onRequestClose={() => setIsOpen(false)} closeTimeoutMS={500}>
                    <TaskEditChild/>
                </Modal>
                <div className='ganttChartDiv'>
                    <div className='topDiv'>
                        <button onClick={() => setView(ViewMode.QuarterDay)}>Quarter of Day</button>
                        <button onClick={() => setView(ViewMode.HalfDay)}>Half of Day</button>
                        <button onClick={() => setView(ViewMode.Day)}>Day</button>
                        <button onClick={() => setView(ViewMode.Week)}>Week</button>
                        <button onClick={() => setView(ViewMode.Month)}>Month</button>
                        {sessionStorage.setItem("viewItem", view)}
                        <div className="Switch">
                            <label className="Switch_Toggle">
                                <input type="checkbox" defaultChecked={isChecked} onClick={() => setIsChecked(!isChecked)}/>
                                タスクリストの表示
                            </label>
                        </div>
                    </div>
                    <div className='bottomDiv'>
                        <Gantt tasks={tasks} viewMode={view} onDateChange={handleTaskChange} onDelete={handleTaskDelete} onProgressChange={handleProgressChange} onDoubleClick={handleDblClick} onExpanderClick={handleExpanderClick} listCellWidth={isChecked ? "155px" : ""} columnWidth={columnWidth} locale={new Intl.Locale('ja-Ja')} ganttHeight={bottomDivH - 100} todayColor="#e8f2ae" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default GanttChart