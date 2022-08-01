const axios = require('axios').default;

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
}

export {getTaskDetails, deleteTask}; 