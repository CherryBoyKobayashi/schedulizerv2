import Project from '../project';
import { deleteTask } from '../../api/taskDB';
import { addTask } from './task-methods';
import { v4 as uuidv4 } from 'uuid';
import {addProjectToDB, deleteProjectFromDB, updateProjectInDB} from '../../api/projectDB'

async function addProject(userData, projectName, projectDescription) {
    let userId = userData.userId;
    let projectId = uuidv4();
    let response = await addProjectToDB(userId, projectId, projectName, projectDescription, formatDate(new Date(Date.now()), 'yyyy-MM-dd'), JSON.stringify([{"milestoneId": "Milestone1", "milestoneName": "マイルストーン1", "color": "red", "tasks": []}]));
    if (response == "OK") {
        userData.projects[projectId] = await projectBuilder(projectId, projectName, projectDescription, formatDate(new Date(Date.now()), 'yyyy-MM-dd'), [{"milestoneId": "Milestone1", "milestoneName": "マイルストーン1", "color": "red", "tasks": []}]);
    }
}
async function copyProject(userData, projectName, projectDescription, projectData) {
    let newProjectData = []
    let userId = userData.userId;
    let projectId = uuidv4();
    for(let milestone in projectData) {
        let newMilestone = JSON.parse(JSON.stringify(projectData[milestone]))
        newMilestone.milestoneId = uuidv4();
        for (let task in newMilestone.tasks) {
            let newTaskId = uuidv4();
            newMilestone.tasks[task].taskId = newTaskId;
            newMilestone.tasks[task].taskData.taskId = newTaskId;
        }
        newProjectData.push(newMilestone)
    }
    let DBData = JSON.parse(JSON.stringify(newProjectData))
    for (let data in DBData) {
        DBData[data].tasks = DBData[data].tasks.map(e=>e.taskId)
    }
    let response = await addProjectToDB(userId, projectId, projectName, projectDescription, formatDate(new Date(Date.now()), 'yyyy-MM-dd'), JSON.stringify(DBData));
    if (response == "OK") {
        for (let milestone in newProjectData) {
            let newMilestone = JSON.parse(JSON.stringify(newProjectData[milestone]))
            let newTasks = []
            for (let task in newMilestone.tasks) {
                await addTask(newTasks, newMilestone.tasks[task].taskData["task-name"], newMilestone.tasks[task].taskData["start-time"], newMilestone.tasks[task].taskData["finish-time"], newMilestone.tasks[task].taskData["members"], newMilestone.tasks[task].taskData["priority"], userId, newMilestone.tasks[task].taskData["checkpoints"], newMilestone.tasks[task].taskData["description"], newMilestone.tasks[task].taskData["follow-state"], projectId, newMilestone.milestoneId, newMilestone.tasks[task].taskId)
            }
            newMilestone.tasks = newTasks
            newProjectData[milestone] = newMilestone
        }
        for (let data in newProjectData) {
            newProjectData[data].tasks = newProjectData[data].tasks.map(e=>e.taskId)
        }
        userData.projects[projectId] = await projectBuilder(projectId, projectName, projectDescription, formatDate(new Date(Date.now()), 'yyyy-MM-dd'), newProjectData);
    }
}
async function deleteProject(userData, projectId) {
    for (let milestone_key in userData.projects[projectId].projectData) {
        if (milestone_key != undefined) {
            for( let task in userData.projects[projectId].projectData[milestone_key].tasks) {
                if (userData.projects[projectId].projectData[milestone_key].tasks[task] != undefined) {
                    let userId = userData.userId
                    if(userData.projects[projectId].projectCreator == userData.userId) {
                        userId = userData.projects[projectId].projectData[milestone_key].tasks[task].taskData.creator
                    }
                    deleteTask(userData.projects[projectId].projectData[milestone_key].tasks[task].taskId, userId)
                }
            }
        }
        for( let task in userData.projects[projectId].projectData[milestone_key].tasks) {
            deleteTask(task.taskId, userData.userId)
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

async function projectBuilder(p1, p2, p3, p4, p5) {
    console.log(p5)
    let project = new Project();
    project.projectId = p1;
    project.projectName = p2;
    project.projectDescription = p3;
    project.projectDate = p4;
    project.projectData = await project.getProjectData(p5);
    return project;
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

export {addProject, deleteProject, updateProject, copyProject};