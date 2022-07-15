import Project from '../project';
import { v4 as uuidv4 } from 'uuid';

function addProject(userData, projectName, projectDescription) {
    let projectId = uuidv4();
    let taskId = uuidv4();
    localStorage.setItem(projectId, JSON.stringify({Milestone1: {"milestoneName": "Milestone1", "color": "red", "tasks": [taskId]}}));
    localStorage.setItem(taskId, JSON.stringify({"task-name": "task1", "start-time":"2022-03-04", "finish-time":"2022-04-04", "members": ["小林", "ミコラ"], "priority": "high", "creation-time":"2022-03-01", "creator":"ミコラ",  "checkpoints":["check1", "check2"], "comments": ["comment1", "comment2"], "description":"Super-Project smth smth", "follow-state":"true"}))
    userData.projects[projectId] = new Project(projectId, projectName, projectDescription, formatDate(new Date(Date.now()), 'yyyy-MM-dd'));
    saveProject(userData);
}

function deleteProject(userData, projectId) {
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
    console.log(Object.keys(userData.projects).length);
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
        localStorage.removeItem(userData.userId);
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