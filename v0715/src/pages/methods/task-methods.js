import { v4 as uuidv4 } from 'uuid';
import Task from '../task';

function addTask(tasks, taskName, startTime, finishTime, members, priority, userName, checkpoints, description, followState) {
    let taskId = uuidv4();
    tasks.push(new Task(taskId, {"task-name": taskName, "start-time":startTime, "finish-time":finishTime, "members": members, "priority": priority, "creation-time":formatDate(new Date(Date.now()), 'yyyy-MM-dd'), "creator":userName,  "checkpoints":checkpoints, "comments": [""], "description":description, "follow-state":followState, "progress": 20}));
    saveTask(tasks[tasks.length-1])
}

function deleteTask(tasks, taskId) {
    for( var i = 0; i < tasks.length; i++){
        if (tasks[i]["taskId"] === taskId) {
            localStorage.removeItem(tasks[i]["taskId"])
            tasks.splice(i, 1); 
        }
    }
}

function updateTask(task, taskName, startTime, finishTime, members, priority, creationTime, userName, checkpoints, comments, description, followState, progress) {
    task.taskData = {"task-name": taskName, "start-time":startTime, "finish-time":finishTime, "members": members, "priority": priority, "creation-time":creationTime, "creator":userName,  "checkpoints":checkpoints, "comments": comments, "description":description, "follow-state":followState, "progress": progress};
    saveTask(task)
}

function saveTask(task) {
    localStorage.setItem(task.taskId, JSON.stringify(task.taskData));
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

export {addTask, deleteTask, updateTask, saveTask}; 