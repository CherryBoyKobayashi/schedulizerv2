import './milestone.css'
import "react-datepicker/dist/react-datepicker.css"
import React, { useContext, useState } from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Modal from 'react-modal/lib/components/Modal'
import {MdEditNote, MdDeleteForever, MdOutlineSupervisorAccount} from "react-icons/md"
import {BsBookmarkCheck, BsCalendarDate} from "react-icons/bs"
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useParams } from 'react-router-dom'
import {BiLabel} from "react-icons/bi"
import DatePicker from "react-datepicker";
import Select, {ActionMeta, OnChangeValue }from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import TextField from "@mui/material/TextField";
import ColorPicker from './colorPicker'
import Topbar from '../Topbar/topbar'
import {addMilestone, deleteMilestone, updateMilestone, saveMilestone} from '../../pages/methods/milestone-methods';
import {addTask, deleteTaskP, updateTask} from '../../pages/methods/task-methods';
import { userDataContext } from '../..'
import { searchMilestone } from '../../pages/methods/search-methods';

Modal.setAppElement("#root");

let keydown = false
document.addEventListener("keydown", function(event) {
    if (event.key == 'Control') {
      keydown = true
    }
});
document.addEventListener("keyup", function(event) {
    if (event.key == 'Control') {
        keydown = false
    }
});

const Milestone = () => {
    const userData = useContext(userDataContext)
    const {projectId} = useParams()
    if (userData.projects[projectId] == undefined) {
        window.location.replace('/')
    }
    const milestoneObj = userData.projects[projectId].projectData
    const [modalIsOpen, setIsOpen] = useState(false)
    const [flag, setFlag] = useState()
    const [, updateState] = useState()
    const forceUpdate = React.useCallback(() => updateState({}), [])
    const allMembersData = JSON.parse(sessionStorage.getItem("members"))
    const allMembers = Array.from(allMembersData.map(a => a.username), (value)=> {return {"value": value, "label": value}});
    const allGroups = Array.from(new Set(allMembersData.map(a => a.group)), (value)=> {return {"value": value, "label": value}});
    const [results, setResults] = useState(Object.keys(milestoneObj))
    const [dispTasks, setDispTasks] = useState((Object.values(milestoneObj).map(e => e.tasks)).flat().map(e=>e.taskId))
    let superMilestones = []
    for (let m in milestoneObj) {
        if(superMilestones.indexOf(milestoneObj[m].superMilestoneName) === -1)
        superMilestones.push(milestoneObj[m].superMilestoneName)
    }
    superMilestones = Array.from(superMilestones.sort().filter((e) => e !=""), (value)=> {return {"value": value, "label": value}})
    milestoneObj.sort(function(a,b) {
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
    milestoneObj.sort(function(a,b) {
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

    let inputHandler = (e) => {
        var lowerCase = e.target.value.toLowerCase();
        let [newResults, newTasks] = searchMilestone(lowerCase, milestoneObj);
        setResults(newResults)
        setDispTasks(newTasks)
        forceUpdate();
    };

    //Milestone methods
    async function addMilestoneHere(superMilestoneName) {
        await addMilestone(milestoneObj, superMilestoneName, document.getElementById("milestoneName").value, sessionStorage.getItem("milestoneColor"), projectId);
        setResults(Object.keys(milestoneObj))
        setDispTasks((Object.values(milestoneObj).map(e => e.tasks)).flat().map(e=>e.taskId))
        forceUpdate();
    }
    async function deleteMilestoneHere(milestoneId) {
        await deleteMilestone(milestoneObj, milestoneId, projectId, userData.userId);
        forceUpdate();
    }
    async function updateMilestoneHere(milestoneId, tasks, superMilestoneName) {
        await updateMilestone(milestoneObj, milestoneId, superMilestoneName, document.getElementById("milestoneName").value, sessionStorage.getItem("milestoneColor"), tasks, projectId)
        forceUpdate();
    }
    async function saveMilestoneHere() {
        await saveMilestone(projectId, milestoneObj);
        forceUpdate();
    }


    //Task methods
    function dateHelper(date) {
        let myDate = new Date(date)
        const offset = myDate.getTimezoneOffset()
        myDate = new Date(myDate.getTime() - (offset*60*1000))
        return myDate.toISOString().split('T')[0];
    }
    async function addTaskHere(milestoneId, checkpoints, label) {
        let startDate = sessionStorage.getItem("startDate");
        let endDate = sessionStorage.getItem("endDate");
        let xmembers = JSON.parse(sessionStorage.getItem("newMembers"))
        if(xmembers.length == undefined) {
            xmembers = [xmembers]
        }
        await addTask(userData.projects[projectId].projectData[milestoneId].tasks, document.getElementById("taskName").value, dateHelper(startDate), dateHelper(endDate), xmembers.map(o => o.value), label, userData.userId, checkpoints, document.getElementById("taskDescription").value, document.getElementById("followState").checked, projectId, userData.projects[projectId].projectData[milestoneId].milestoneId);
        setDispTasks((Object.values(milestoneObj).map(e => e.tasks)).flat().map(e=>e.taskId))
        forceUpdate();
    }
    async function deleteTaskHere(milestoneId, taskId) {
        await deleteTaskP(userData.projects[projectId].projectData[milestoneId].tasks, taskId, userData.userId);
        forceUpdate();
    }
    async function updateTaskHere(milestoneId, taskIndex, checkpoints, comments, label) {
        let startDate = sessionStorage.getItem("startDate");
        let endDate = sessionStorage.getItem("endDate");
        await updateTask(projectId, userData.projects[projectId].projectData[milestoneId].milestoneId, userData.projects[projectId].projectData[milestoneId].tasks[taskIndex], document.getElementById("taskName").value, dateHelper(startDate), dateHelper(endDate), JSON.parse(sessionStorage.getItem("newMembers")).map(o => o.value), label, Date.now(), userData.projects[projectId].projectData[milestoneId].tasks[taskIndex].taskData["creator"], checkpoints, comments, document.getElementById("taskDescription").value, document.getElementById("followState").checked, userData.projects[projectId].projectData[milestoneId].tasks[taskIndex].taskData["progress"])
        forceUpdate()
    }

    const MilestoneInner1 = () => {
        let superMilestoneName;
        function handleChange (newValue) {
            superMilestoneName = newValue.value;
        };
        function handleCreate (value) {
            superMilestones.push({"value": value, "label": value})
        };
        if(flag === 1) {
            return (
                <>
                    <h4>所属大工程名</h4>
                    <CreatableSelect isClearable onChange={handleChange} onCreateOption={handleCreate} options={superMilestones} />
                    <h4>マイルストーン名</h4>
                    <input type='text' id="milestoneName"/>
                    <h4>マイルストーン色</h4>
                    <div className='colorPickDiv'>
                        <ColorPicker />
                    </div>
                    <button className='minWidth' onClick={()=>{addMilestoneHere(superMilestoneName); setIsOpen(false);}}>追加</button>
                </>
            )
        } else if (flag === 2) {
            let milestoneId = JSON.parse(sessionStorage.getItem("updateMilestone"))[0];
            let newColor = JSON.parse(sessionStorage.getItem("updateMilestone"))[1];
            let tasks = JSON.parse(sessionStorage.getItem("updateMilestone"))[2];
            return (
                <>
                    <h4>所属大工程名</h4>
                    <CreatableSelect isClearable onChange={handleChange} onCreateOption={handleCreate} options={superMilestones} defaultValue={superMilestones.find(element => element.value == milestoneObj[milestoneId].superMilestoneName)}/>
                    <h4>マイルストーン名</h4>
                    <input type='text' id="milestoneName" defaultValue={milestoneObj[milestoneId].milestoneName}/>
                    <h4>マイルストーン色</h4>
                    <div className='colorPickDiv'>
                        <ColorPicker color={newColor} />
                    </div>
                    <button className='minWidth' onClick={()=>{updateMilestoneHere(milestoneId, tasks, superMilestoneName); setIsOpen(false);}}>変更</button>
                </>
            )
        }
    }
    const MilestoneInner2 = () => {
        let milestoneId = sessionStorage.getItem("updateMilestoneId");
        let taskIndex = sessionStorage.getItem("updateTaskIndex");
        let checkpoints = [];
        let [startTime, finishTime, defaultMembers] = [null, null, []];
        let defaultGroups = [];
        try {
            let updateTask = JSON.parse(sessionStorage.getItem("updateTask"));
            startTime = new Date(updateTask.taskData["start-time"]);
            finishTime = new Date(updateTask.taskData["finish-time"]);
            for(var i = 0; i < updateTask.taskData["members"].length; i++) {
                defaultMembers.push({value: updateTask.taskData["members"][i], label: updateTask.taskData["members"][i]});
                if(defaultGroups.indexOf(allMembersData.find(element => element.username == updateTask.taskData["members"][i]).group) === -1) {
                    defaultGroups.push(allMembersData.find(element => element.username == updateTask.taskData["members"][i]).group);
                }
            }         
        } catch {
            startTime = new Date();
            finishTime = new Date();
            defaultMembers = allMembers.filter((e) => e.label==userData.userId);
            defaultGroups.push(allMembersData.filter((e) => e.username==userData.userId)[0].group)
        }
        const [dateRange, setDateRange] = useState([new Date(startTime), new Date(finishTime)]);
        const [startDate, endDate] = dateRange;
        const [members, setMembers] = useState(defaultMembers)
        const [groups, setGroups] = useState(Array.from(defaultGroups, (value)=> {return {"value": value, "label": value}}))
        const labels = [{value: 'high', label: 'High'},{value: 'medium', label: 'Medium'},{value: 'low', label: 'Low'}]
        const defaultLabel = {value: 'medium', label: 'Medium'}
        const [label, setLabels] = useState(defaultLabel)
        let updateTask = JSON.parse(sessionStorage.getItem("updateTask"))
        let initChecked = flag === 4 ? updateTask.taskData["follow-state"] : false
        const [checked, isSetChecked] = useState(initChecked)
        if (flag === 3) {
            return (
                <>
                    <div className='milestoneNameDiv'>
                        <span>{milestoneObj[milestoneId].milestoneName}</span>
                        <input type="checkbox" id="followState" defaultChecked={checked} onChange={(e) => isSetChecked(e.target.checked)}/>
                        <label htmlFor='followState'>{checked ? <AiFillStar/> : <AiOutlineStar/>}</label>
                    </div>
                    <h4 className='textAlignLeft'>タスク名</h4>
                    <div><input type='text' id="taskName"/></div>
                    <h4 className='textAlignLeft'>タスク説明</h4>
                    <div><input type="text" id="taskDescription" defaultValue="Task description"></input></div>
                    <div className='nazoDiv'>
                    <h4 className='textAlignLeft'><BsCalendarDate className='transformClass2'/>期間設定</h4>
                    <DatePicker selectsRange={true} startDate={startDate} endDate={endDate} onChange={(update) => {setDateRange(update);}} isClearable={true}/>
                    <h4 className='textAlignLeft'><MdOutlineSupervisorAccount className='transformClass2'/>担当者</h4>
                    <h6 className='textAlignLeft'>グループ名</h6>
                    <Select value={groups} isMulti options={allGroups} onChange={setGroups} defaultValue={groups} />
                    <h6 className='textAlignLeft'>メンバー</h6>
                    <Select value={members} isMulti options={Array.from(allMembersData.filter((m) => groups.map(e => e.value).includes(m.group)).map(a => a.username), (value)=> {return {"value": value, "label": value}})} onChange={setMembers} defaultValue={members} />
                    <h4 className='textAlignLeft'><BiLabel className='transformClass2'/>ラベル</h4>
                    <Select options={labels} onChange={setLabels}  defaultValue={defaultLabel}></Select>
                    <h4 className='textAlignLeft' style={{display: 'none'}}><BsBookmarkCheck className='transformClass2'/>チェックポイント</h4>
                    <input defaultValue="Checkpoint 1" style={{display: 'none'}} type='text' id="checkpointName" />
                </div>
                <button className='minWidth' onClick={()=> {sessionStorage.setItem("startDate", startDate); sessionStorage.setItem("endDate", endDate); sessionStorage.setItem("newMembers", JSON.stringify(members)); addTaskHere(milestoneId, checkpoints, label.value); setIsOpen(false);}}>追加</button>
            </>
            )
        }
        if (flag === 4) {
            if(userData.userId == userData.projects[projectId].projectCreator) {
                if (keydown) {
                    return (
                        <>
                            <div className='milestoneNameDiv'>
                                <span>{milestoneObj[milestoneId].milestoneName}</span>
                                <input type="checkbox" id="followState" defaultChecked={checked} onChange={(e) => isSetChecked(e.target.checked)}/>
                                <label htmlFor='followState'>{checked ? <AiFillStar/> : <AiOutlineStar/>}</label>
                            </div>
                            <h4 className='textAlignLeft'>タスク名</h4>
                            <div><input defaultValue={updateTask.taskData["task-name"]} type='text' id="taskName" /></div>
                            <h4 className='textAlignLeft'>タスク説明</h4>
                            <div><input type="text" id="taskDescription" defaultValue={updateTask.taskData["description"]}></input></div>
                            <div>
                                <h4 className='textAlignLeft'><BsCalendarDate className='transformClass2'/>期間設定</h4>
                                <DatePicker selectsRange={true} startDate={startDate} endDate={endDate} onChange={(update) => {setDateRange(update);}} isClearable={true} />
                                <h4 className='textAlignLeft'><MdOutlineSupervisorAccount className='transformClass2'/>担当者</h4>
                                <h6 className='textAlignLeft'>グループ名</h6>
                                <Select value={groups} isMulti options={allGroups} onChange={setGroups} defaultValue={groups} />
                                <h6 className='textAlignLeft'>メンバー</h6>
                                <Select value={members} isMulti options={Array.from(allMembersData.filter((m) => groups.map(e => e.value).includes(m.group)).map(a => a.username), (value)=> {return {"value": value, "label": value}})} onChange={setMembers} defaultValue={members} />
                                <h4 className='textAlignLeft'><BiLabel className='transformClass2'/>ラベル</h4>
                                <Select options={labels} onChange={setLabels}  defaultValue={labels.find((l) => l.value === updateTask.taskData["priority"])}></Select>
                                <h4 className='textAlignLeft' style={{display: 'none'}}><BsBookmarkCheck className='transformClass2'/>チェックポイント</h4><input style={{display: 'none'}} defaultValue={updateTask.taskData["checkpoints"]} type='text' id="checkpointName" />
                            </div>
                            <button className='minWidth' onClick={()=> {sessionStorage.setItem("startDate", startDate); sessionStorage.setItem("endDate", endDate); sessionStorage.setItem("newMembers", JSON.stringify(members)); addTaskHere(milestoneId, checkpoints, label.value); setIsOpen(false);}}>追加</button>
                        </>
                    )
                } else {
                    return (
                        <>
                            <div className='milestoneNameDiv'>
                                <span>{milestoneObj[milestoneId].milestoneName}</span>
                                <input type="checkbox" id="followState" defaultChecked={checked} onChange={(e) => isSetChecked(e.target.checked)}/>
                                <label htmlFor='followState'>{checked ? <AiFillStar/> : <AiOutlineStar/>}</label>
                            </div>
                            <h4 className='textAlignLeft'>タスク名</h4>
                            <div><input defaultValue={updateTask.taskData["task-name"]} type='text' id="taskName" /></div>
                            <h4 className='textAlignLeft'>タスク説明</h4>
                            <div><input type="text" id="taskDescription" defaultValue={updateTask.taskData["description"]}></input></div>
                            <div>
                                <h4 className='textAlignLeft'><BsCalendarDate className='transformClass2'/>期間設定</h4>
                                <DatePicker selectsRange={true} startDate={startDate} endDate={endDate} onChange={(update) => {setDateRange(update);}} isClearable={true} />
                                <h4 className='textAlignLeft'><MdOutlineSupervisorAccount className='transformClass2'/>担当者</h4>
                                <h6 className='textAlignLeft'>グループ名</h6>
                                <Select value={groups} isMulti options={allGroups} onChange={setGroups} defaultValue={groups} />
                                <h6 className='textAlignLeft'>メンバー</h6>
                                <Select value={members} isMulti options={Array.from(allMembersData.filter((m) => groups.map(e => e.value).includes(m.group)).map(a => a.username), (value)=> {return {"value": value, "label": value}})} onChange={setMembers} defaultValue={members} />
                                <h4 className='textAlignLeft'><BiLabel className='transformClass2'/>ラベル</h4>
                                <Select options={labels} onChange={setLabels}  defaultValue={labels.find((l) => l.value === updateTask.taskData["priority"])}></Select>
                                <h4 className='textAlignLeft' style={{display: 'none'}}><BsBookmarkCheck className='transformClass2'/>チェックポイント</h4><input style={{display: 'none'}} defaultValue={updateTask.taskData["checkpoints"]} type='text' id="checkpointName" />
                            </div>
                            <button className='minWidth' onClick={()=> {sessionStorage.setItem("startDate", startDate); sessionStorage.setItem("endDate", endDate); sessionStorage.setItem("newMembers", JSON.stringify(members)); updateTaskHere(milestoneId, taskIndex, checkpoints, updateTask.taskData["comments"], label.value); setIsOpen(false);}}>更新</button>
                        </>
                    )
                }
            } else {
                return (
                    <>
                        <div className='milestoneNameDiv'>
                            <span>{milestoneObj[milestoneId].milestoneName}</span>
                            <input type="checkbox" id="followState" defaultChecked={checked} onChange={(e) => isSetChecked(e.target.checked)}/>
                            <label htmlFor='followState'>{checked ? <AiFillStar/> : <AiOutlineStar/>}</label>
                        </div>
                        <h4 className='textAlignLeft'>タスク名</h4>
                        <div><input defaultValue={updateTask.taskData["task-name"]} type='text' id="taskName" /></div>
                        <h4 className='textAlignLeft'>タスク説明</h4>
                        <div><input type="text" id="taskDescription" defaultValue={updateTask.taskData["description"]}></input></div>
                        <div>
                            <h4 className='textAlignLeft'><BsCalendarDate className='transformClass2'/>期間設定</h4>
                            <DatePicker selectsRange={true} startDate={startDate} endDate={endDate} onChange={(update) => {setDateRange(update);}} isClearable={true} />
                            <h4 className='textAlignLeft'><MdOutlineSupervisorAccount className='transformClass2'/>担当者</h4>
                            <h6 className='textAlignLeft'>グループ名</h6>
                            <Select value={groups} isMulti options={allGroups} onChange={setGroups} defaultValue={groups} />
                            <h6 className='textAlignLeft'>メンバー</h6>
                            <Select value={members} isMulti options={Array.from(allMembersData.filter((m) => groups.map(e => e.value).includes(m.group)).map(a => a.username), (value)=> {return {"value": value, "label": value}})} onChange={setMembers} defaultValue={members} />
                            <h4 className='textAlignLeft'><BiLabel className='transformClass2'/>ラベル</h4>
                            <Select options={labels} onChange={setLabels}  defaultValue={labels.find((l) => l.value === updateTask.taskData["priority"])}></Select>
                            <h4 className='textAlignLeft' style={{display: 'none'}}><BsBookmarkCheck className='transformClass2'/>チェックポイント</h4><input style={{display: 'none'}} defaultValue={updateTask.taskData["checkpoints"]} type='text' id="checkpointName" />
                        </div>
                    </>
                    )
            }
        }

    }
    const MilestoneChild = ({color, tasks, milestoneId}) => {
        if(userData.userId == userData.projects[projectId].projectCreator) {
            return (
                <>
                    <Droppable droppableId={milestoneId}>
                        {(provided) => (
                            <div className='milestone'>
                                <div className='colorDiv' style={{backgroundColor: color}}></div>
                                <div className='infoDiv'>
                                    <span className='milestoneName'>{milestoneObj[milestoneId].milestoneName}</span>
                                    <div className='editDiv'>
                                        <button className='borderNone' onClick={() => {deleteMilestoneHere(milestoneId)}}><span ><MdDeleteForever className='transformClass'/></span></button>
                                        <button className='borderNone' onClick={() => {sessionStorage.setItem("updateMilestone", JSON.stringify([milestoneId, color, Object.values(tasks)])); OverShow(2)}}><span ><MdEditNote className='transformClass'/></span></button>
                                    </div>
                                </div>
                                <div className='taskAddDiv'>
                                    <button onClick={() => {OverShow(3); sessionStorage.setItem("updateMilestoneId", milestoneId)}}>新規タスク追加</button>
                                </div>
                                <div className='tasksDiv'  {...provided.droppableProps} ref={provided.innerRef}>
                                {Object.values(tasks).map((e, i) => <TaskChild key={e.taskId} {...e} milestoneId={milestoneId} index={i}/>)}
                                </div>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </>
            )
        } else {
            return (
                <>
                    <Droppable droppableId={milestoneId}>
                        {(provided) => (
                            <div className='milestone'>
                                <div className='colorDiv' style={{backgroundColor: color}}></div>
                                <div className='infoDiv'>
                                    <span className='milestoneName'>{milestoneObj[milestoneId].milestoneName}</span>    
                                </div>
                                <div className='taskAddDiv'>
                                </div>
                                <div className='tasksDiv'  {...provided.droppableProps} ref={provided.innerRef}>
                                {Object.values(tasks).map((e, i) => <TaskChild key={e.taskId} {...e} milestoneId={milestoneId} index={i}/>)}
                                </div>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </>
            )
        }
    }
    // タスクDivよね～ん
    const TaskChild = (props) => {
        if(userData.userId == userData.projects[projectId].projectCreator) {
            if (dispTasks.includes(props.taskId)) {
                return (
                    <Draggable draggableId={props.taskId} index={props.index} >
                    {(provided, snapshot) =>(
                        <div className='task' onClick={() => {sessionStorage.setItem("updateTask", JSON.stringify(props)); sessionStorage.setItem("updateMilestoneId", props.milestoneId); sessionStorage.setItem("updateTaskIndex", props.index);OverShow(4)}} ref={provided.innerRef} snapshot={snapshot} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <span>{props.taskData['task-name']}</span>
                            <div className='editDiv'>
                                <button className='borderNone' onClick={(e) => {e.stopPropagation(); deleteTaskHere(props.milestoneId, props.taskId);}}><MdDeleteForever className='transformClass'/></button>
                            </div>
                        </div>
                    )}
                    </Draggable>
                )
            }
            else {
                return (
                    <Draggable draggableId={props.taskId} index={props.index} >
                        {(provided, snapshot) =>(
                            <div className='task'  onClick={() => {sessionStorage.setItem("updateTask", JSON.stringify(props)); sessionStorage.setItem("updateMilestoneId", props.milestoneId); sessionStorage.setItem("updateTaskIndex", props.index);OverShow(4)}} ref={provided.innerRef} snapshot={snapshot} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <span style={{color: "#E8E8E8"}}>{props.taskData['task-name']}</span>
                                <div className='editDiv'>
                                    <button className='borderNone'  style={{color: "#E8E8E8"}} onClick={(e) => {e.stopPropagation(); deleteTaskHere(props.milestoneId, props.taskId);}}><MdDeleteForever className='transformClass'/></button>
                                </div>
                            </div>
                        )}
                    </Draggable>
                )
            }
        } else {
            if (dispTasks.includes(props.taskId)) {
                return (
                    <Draggable draggableId={props.taskId} index={props.index} >
                    {(provided, snapshot) =>(
                        <div className='task' onClick={() => {sessionStorage.setItem("updateTask", JSON.stringify(props)); sessionStorage.setItem("updateMilestoneId", props.milestoneId); sessionStorage.setItem("updateTaskIndex", props.index);OverShow(4)}} ref={provided.innerRef} snapshot={snapshot} {...provided.dragHandleProps}>
                            <span>{props.taskData['task-name']}</span>
                            <div className='editDiv'>
                            </div>
                        </div>
                    )}
                    </Draggable>
                )
            }
            else {
                return (
                    <Draggable draggableId={props.taskId} index={props.index} >
                        {(provided, snapshot) =>(
                            <div className='task'  onClick={() => {sessionStorage.setItem("updateTask", JSON.stringify(props)); sessionStorage.setItem("updateMilestoneId", props.milestoneId); sessionStorage.setItem("updateTaskIndex", props.index);OverShow(4)}} ref={provided.innerRef} snapshot={snapshot} {...provided.dragHandleProps}>
                                <span style={{color: "#E8E8E8"}}>{props.taskData['task-name']}</span>
                                <div className='editDiv'>
                                </div>
                            </div>
                        )}
                    </Draggable>
                )
            }
        }
    }
    // Modalを表示する時に使ってるよね～ん
    const OverShow = (num) => {
        setIsOpen(true)
        setFlag(num)
    }
    const onDragEnd = (result) => {
        const { destination } = result;
        if (!destination) {
            return;
        }
        let [removed] = milestoneObj[result.source.droppableId].tasks.splice(result.source.index, 1);
        milestoneObj[result.destination.droppableId].tasks.splice(result.destination.index, 0, removed);
        saveMilestoneHere();
    }
    if(userData.userId == userData.projects[projectId].projectCreator) {
        return (
            <>
                <div className='mainDiv'>
                    <Topbar/>
                    <Modal isOpen={modalIsOpen} overlayClassName={{base: "overlay-base", afterOpen: "overlay-after", beforeClose: "overlay-before"}} className={{base: "content-base", afterOpen: "content-after", beforeClose: "content-before"}} onRequestClose={() => setIsOpen(false)} closeTimeoutMS={500}>
                        { flag === 1 && <MilestoneInner1/>}
                        { flag === 2 && <MilestoneInner1/>}
                        { flag === 3 && <MilestoneInner2/>}
                        { flag === 4 && <MilestoneInner2/>}
                    </Modal>
                    <div className='milestoneDiv'>
                        <div className='topDiv'>
                            <div>
                                <TextField
                                id="outlined-basic"
                                onChange={inputHandler}
                                variant="outlined"
                                label="Search"
                                />
                            </div>
                            <button onClick={() => {OverShow(1)}}>新規マイルストーン</button>
                        </div>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <div className='bottomDiv'>
                                {Object.entries(milestoneObj).filter(milestone => results.includes(milestone[0])).map((e, i) => <MilestoneChild key={e[0]} {...e[1]} milestoneId={e[0]}/>)}
                            </div>
                        </DragDropContext>
                    </div>
                </div>
            </>
        )
    } else {
        return (
            <>
                <div className='mainDiv'>
                    <Topbar/>
                    <Modal isOpen={modalIsOpen} overlayClassName={{base: "overlay-base", afterOpen: "overlay-after", beforeClose: "overlay-before"}} className={{base: "content-base", afterOpen: "content-after", beforeClose: "content-before"}} onRequestClose={() => setIsOpen(false)} closeTimeoutMS={500}>
                        { flag === 1 && <MilestoneInner1/>}
                        { flag === 2 && <MilestoneInner1/>}
                        { flag === 3 && <MilestoneInner2/>}
                        { flag === 4 && <MilestoneInner2/>}
                    </Modal>
                    <div className='milestoneDiv'>
                        <div className='topDiv'>
                            <div>
                                <TextField
                                id="outlined-basic"
                                onChange={inputHandler}
                                variant="outlined"
                                label="Search"
                                />
                            </div>
                        </div>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <div className='bottomDiv'>
                                {Object.entries(milestoneObj).filter(milestone => results.includes(milestone[0])).map((e, i) => <MilestoneChild key={e[0]} {...e[1]} milestoneId={e[0]}/>)}
                            </div>
                        </DragDropContext>
                    </div>
                </div>
            </>
        )
    }
}

export default Milestone