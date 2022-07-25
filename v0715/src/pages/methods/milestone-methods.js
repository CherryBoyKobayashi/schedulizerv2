import { v4 as uuidv4 } from 'uuid';
import Task from '../task';

function addMilestone(project, milestoneName, newColor, userId) {
    let milestoneId = uuidv4();
    let tasks = []
    let taskId = uuidv4();
    tasks.push(new Task(taskId, {"task-name": "タスク１", "start-time":formatDate(new Date(Date.now()), 'yyyy-MM-dd'), "finish-time":formatDate(new Date(Date.now() + 50000000), 'yyyy-MM-dd'), "members": [userId], "priority": "high", "creation-time":formatDate(new Date(Date.now()), 'yyyy-MM-dd'), "creator": userId,  "checkpoints":["Checkpoint1", "check2"], "comments": [""], "description": "私の新しいタスク", "follow-state": "true", "progress": 10}));
    project[milestoneId]= {"milestoneName": milestoneName, "color":newColor, "tasks":tasks}
}

function deleteMilestone(project, milestoneId) {
    for (let task in project[milestoneId].tasks) {
        localStorage.removeItem(project[milestoneId].tasks[task].taskId)
    }
    delete project[milestoneId];
}

function updateMilestone(project, milestoneId, milestoneName, newColor, tasks) {
    project[milestoneId]= {"milestoneName": milestoneName, "color":newColor,"tasks":tasks};
}

function saveMilestone(project) {
    let milestones = JSON.parse(JSON.stringify(project.projectData));
    for(let i=0; i<milestones.length; i++) {
        milestones[i]["tasks"] = Object.values(milestones[i]["tasks"]).map(o => o.taskId);
    }
    localStorage.setItem(project.projectId, JSON.stringify((milestones)));
}

const formatDate = (date, format) => {
    console.log()
    format = format.replace(/yyyy/g, date.getFullYear());
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
    format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3));
    return format
}

export {addMilestone, deleteMilestone, updateMilestone, saveMilestone};