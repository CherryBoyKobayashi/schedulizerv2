import Project from '../project';
import Task from '../task'
import { v4 as uuidv4 } from 'uuid';

function addProject(userData, projectName, projectDescription) {
    let userId = userData.userId;
    let projectId = uuidv4();
    let taskId = uuidv4();
    let tasks = [];
    tasks.push(new Task(taskId, {"task-name": "タスク１", "start-time":formatDate(new Date(Date.now()), 'yyyy-MM-dd'), "finish-time":formatDate(new Date(Date.now() + 50000000), 'yyyy-MM-dd'), "members": [userId], "priority": "high", "creation-time":formatDate(new Date(Date.now()), 'yyyy-MM-dd'), "creator": userId,  "checkpoints":["Checkpoint1"], "comments": [""], "description": "私の新しいタスク", "follow-state": "true", "progress": 10}));
    localStorage.setItem(projectId, JSON.stringify({Milestone1: {"milestoneName": "マイルストーン1", "color": "red", "tasks": tasks}}));
    userData.projects[projectId] = new Project(projectId, projectName, projectDescription, formatDate(new Date(Date.now()), 'yyyy-MM-dd'));
    saveProject(userData)
}
      
function deleteProject(userData, projectId) {
    for (let milestone in userData.projects[projectId].projectData) {
        for( let task in userData.projects[projectId].projectData[milestone].tasks) {
            localStorage.removeItem(userData.projects[projectId].projectData[milestone].tasks[task].taskId)
        }
    }
    delete userData.projects[projectId];
    saveProject(userData);
    localStorage.removeItem(projectId);
}

function updateProject(userData, projectId, newProjectName, newProjectDescription) {
    userData.projects[projectId].projectName = newProjectName;
    userData.projects[projectId].projectDescription = newProjectDescription;
    saveProject(userData);
}

function saveProject(userData) {
    if (Object.keys(userData.projects).length>0) {
        let userId = userData.userId;
        let dataString = '{';
        for(let i=0; i<Object.keys(userData.projects).length-1; i++) {
            let key = Object.keys(userData.projects)[i];
            dataString += '"' + key + '": ["' + userData.projects[key].projectName + '", "' + userData.projects[key].projectDescription + '", "' + userData.projects[key].projectDate + '"], ';
        }
        let key = Object.keys(userData.projects)[Object.keys(userData.projects).length-1];
        dataString += '"' + key + '": ["' + userData.projects[key].projectName + '", "' + userData.projects[key].projectDescription + '", "' + userData.projects[key].projectDate + '"]}';
        localStorage.setItem(userId, dataString);
    } else {
        let userId = userData.userId;
        let dataString = '{}';
        localStorage.setItem(userId, dataString);
    }
}

const formatDate = (date, format) => {
    format = format.replace(/yyyy/g, date.getFullYear());
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
    format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3));
    return format
}

export {addProject, deleteProject, updateProject, saveProject};