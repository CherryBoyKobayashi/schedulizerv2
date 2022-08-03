import { v4 as uuidv4 } from 'uuid';
import Task from '../task';
import { addTaskToDB, deleteTask, updateTaskInDB } from '../../api/taskDB';

async function addTask(tasks, taskName, startTime, finishTime, members, priority, userName, checkpoints, description, followState, projectId, milestoneId) {
    let taskId = uuidv4();
    let response = await addTaskToDB(projectId, milestoneId, taskId, taskName, startTime, finishTime, members, priority, formatDate(new Date(Date.now()), 'yyyy-MM-dd'), userName, checkpoints, [""], description, followState, 20);
    if (response == "OK") {
        tasks.push(new Task(taskId, {"task-name": taskName, "start-time":startTime, "finish-time":finishTime, "members": members, "priority": priority, "creation-time":formatDate(new Date(Date.now()), 'yyyy-MM-dd'), "creator":userName,  "checkpoints":checkpoints, "comments": [""], "description":description, "follow-state":followState, "progress": 20}));
    }
}

async function deleteTaskP(tasks, taskId) {
    let response = await deleteTask(taskId);
    if (response == "OK") {
        for( var i = 0; i < tasks.length; i++){
            if (tasks[i]["taskId"] === taskId) {
                tasks.splice(i, 1); 
            }
        }
    }
}

async function updateTask(projectId, milestoneId, task, taskName, startTime, finishTime, members, priority, creationTime, userName, checkpoints, comments, description, followState, progress) {
    let response = await updateTaskInDB(projectId, milestoneId, task.taskId, taskName, startTime, finishTime, members, priority, creationTime, userName, checkpoints, comments, description, followState, progress);
    if (response == "OK") {
        task.taskData = {"task-name": taskName, "start-time":startTime, "finish-time":finishTime, "members": members, "priority": priority, "creation-time":creationTime, "creator":userName,  "checkpoints":checkpoints, "comments": comments, "description":description, "follow-state":followState, "progress": progress};
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

export {addTask, deleteTaskP, updateTask}; 