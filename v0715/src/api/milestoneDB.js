const axios = require('axios').default;

async function addMilestoneToDB (projectId, milestoneId, milestoneName, newColor, tasks) {
    let postData = {
        projectId: projectId,
        milestoneId: milestoneId,
        milestoneName: milestoneName,
        color: newColor,
        tasks: tasks
    };
  
    const response = await axios.post('http://localhost:3000/milestoneDB', postData)
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

async function deleteMilestoneFromDB (projectId, milestoneId) {
    let postData = {
        projectId: projectId,
        milestoneId: milestoneId
    };
  
    const response = await axios.post('http://localhost:3000/milestoneDB', postData)
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

async function updateMilestoneInDB (projectId, milestoneId, milestoneName, newColor, tasks) {
    let postData = {
        projectId: projectId,
        milestoneId: milestoneId,
        milestoneName: milestoneName,
        color: newColor,
        tasks: tasks
    };
  
    const response = await axios.post('http://localhost:3000/milestoneDB', postData)
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

async function saveMilestoneToDB(projectId, projectData) {
    let postData = {
        projectId: projectId,
        projectData: projectData
    };
  
    const response = await axios.post('http://localhost:3000/milestoneDB', postData)
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

export {addMilestoneToDB, deleteMilestoneFromDB, updateMilestoneInDB, saveMilestoneToDB}; 