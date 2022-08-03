const axios = require('axios').default;

async function addTaskToDB (projectId, milestoneId, taskId, taskName, startTime, finishTime, members, priority, creationTime, userName, checkpoints, comments, description, followState, progress) {
    let postData = {
        projectId: projectId,
        milestoneId: milestoneId,
        taskId: taskId,
        "task-name": taskName,
        "start-time": startTime,
        "finish-time": finishTime,
        members: members,
        priority: priority,
        "creation-time": creationTime,
        creator: userName,
        checkpoints: checkpoints,
        comments: comments,
        description: description,
        "follow-state": followState,
        progress: progress
    };

    const response = await axios.post('http://localhost:3000/taskDB', postData)
    .then((res) => {
        if (res.status == 200) {
            return res.data;
        }
    })
    .catch((err) => {
        return "error";
    })

    return response;
}

async function getTaskDetails(taskId) {
    let postData = {
        taskId: taskId
    };
  
    const response = await axios.post('http://localhost:3000/tasksDB', postData)
    .then((res) => {
        if (res.status == 200) {
            return res.data;
        }
        else {
            return "no value";
        }
    })
    .catch((err) => {
        return "error";
    })

    return response;
}

async function deleteTask(taskId) {
    let postData = {
        taskId: taskId
    };
  
    const response = await axios.post('http://localhost:3000/tasksDBdelete', postData)
    .then((res) => {
        if (res.status == 200) {
            return res.data;
        }
    })
    .catch((err) => {
        return "error";
    })

    return response
}

async function updateTaskInDB(projectId, milestoneId, taskId, taskName, startTime, finishTime, members, priority, creationTime, userName, checkpoints, comments, description, followState, progress) {
    let postData = {
        projectId: projectId,
        milestoneId: milestoneId,
        taskId: taskId,
        "task-name": taskName,
        "start-time": startTime,
        "finish-time": finishTime,
        members: members,
        priority: priority,
        "creation-time": creationTime,
        creator: userName,
        checkpoints: checkpoints,
        comments: comments,
        description: description,
        "follow-state": followState,
        progress: progress
    };
  
    const response = await axios.post('http://localhost:3000/taskDB', postData)
    .then((res) => {
        if (res.status == 200) {
            return res.data;
        }
    })
    .catch((err) => {
        return "error";
    })

    return response;
}

export {getTaskDetails, deleteTask, addTaskToDB, updateTaskInDB}; 