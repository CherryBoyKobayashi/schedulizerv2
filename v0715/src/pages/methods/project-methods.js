import Project from '../project';
import { deleteTask } from '../../api/taskDB';
import { v4 as uuidv4 } from 'uuid';
import {addProjectToDB, deleteProjectFromDB, updateProjectInDB} from '../../api/projectDB'

async function addProject(userData, projectName, projectDescription) {
    let userId = userData.userId;
    let projectId = uuidv4();
    let response = await addProjectToDB(userId, projectId, projectName, projectDescription, formatDate(new Date(Date.now()), 'yyyy-MM-dd'), JSON.stringify([{"milestoneId": "Milestone1", "milestoneName": "マイルストーン1", "color": "red", "tasks": []}]));
    if (response == "OK") {
        userData.projects[projectId] = new Project(projectId, projectName, projectDescription, formatDate(new Date(Date.now()), 'yyyy-MM-dd'), JSON.stringify([{Milestone1: {"milestoneId": "Milestone1", "milestoneName": "マイルストーン1", "color": "red", "tasks": []}}]));
    }
}
      
async function deleteProject(userData, projectId) {
    for (let milestone_key in userData.projects[projectId].projectData) {
        for( let task in userData.projects[projectId].projectData[milestone_key].tasks) {
            deleteTask(task.taskId)
        }
    }
    let response = await deleteProjectFromDB(userData.userId, projectId);
    if (response == "OK") {
        delete userData.projects[projectId];
    }
}

async function updateProject(userData, projectId, newProjectName, newProjectDescription) {
    let response = await updateProjectInDB(projectId, newProjectName, newProjectDescription);
    if (response == "OK") {
        userData.projects[projectId].projectName = newProjectName;
        userData.projects[projectId].projectDescription = newProjectDescription;
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

export {addProject, deleteProject, updateProject};