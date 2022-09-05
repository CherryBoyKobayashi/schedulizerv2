const axios = require('axios').default;

// const address = '/api/';
const address = 'http://localhost:3000/api/';

async function addMilestoneToDB (projectId, milestoneId, superMilestoneName, milestoneName, newColor, tasks) {
    if(superMilestoneName == undefined){
        superMilestoneName = ""
    }
    let postData = {
        projectId: projectId,
        milestoneId: milestoneId,
        superMilestoneName: superMilestoneName,
        milestoneName: milestoneName,
        color: newColor,
        tasks: tasks
    };
    if (postData != null) {
        const response = await axios.post(address + 'milestoneDB', postData)
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

async function deleteMilestoneFromDB (projectId, milestoneId, userId) {
    let postData = {
        projectId: projectId,
        milestoneId: milestoneId,
        userId: userId
    };
    if (postData != null) {
        const response = await axios.post(address + 'milestoneDB', postData)
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

async function updateMilestoneInDB (projectId, milestoneId, superMilestoneName, milestoneName, newColor, tasks) {
    if(superMilestoneName == undefined){
        superMilestoneName = ""
    }
    let postData = {
        projectId: projectId,
        milestoneId: milestoneId,
        superMilestoneName: superMilestoneName,
        milestoneName: milestoneName,
        color: newColor,
        tasks: tasks
    };
    if (postData != null) {
        const response = await axios.post(address + 'milestoneDB', postData)
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

async function saveMilestoneToDB(projectId, projectData) {
    let postData = {
        projectId: projectId,
        projectData: projectData
    };
    if (postData != null) {
        const response = await axios.post(address + 'milestoneDB', postData)
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

export {addMilestoneToDB, deleteMilestoneFromDB, updateMilestoneInDB, saveMilestoneToDB}; 