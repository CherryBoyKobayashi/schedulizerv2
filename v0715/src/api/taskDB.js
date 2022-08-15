const axios = require('axios').default;

const address = 'http:// ip-172-31-80-127.ec2.internal:3000/';

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

    if (postData != null) {
        const response = await axios.post(address + 'taskDB', postData)
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
}

async function getTaskDetails(taskId, userId) {
    let postData = {
        taskId: taskId,
        userId: userId
    };
  
    if (postData != null) {
        const response = await axios.post(address + 'taskDB', postData)
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
}

async function deleteTask(taskId,userId) {
    let postData = {
        taskId: taskId,
        userId: userId,
        delete: true
    };
  
    if (postData != null) {
        const response = await axios.post(address + 'taskDB', postData)
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
  
    if (postData != null) {
        const response = await axios.post(address + 'taskDB', postData)
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
}

export {getTaskDetails, deleteTask, addTaskToDB, updateTaskInDB}; 