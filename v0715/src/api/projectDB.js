const axios = require('axios').default;

const adress = 'http://localhost:3000/';

function getMilestones(projectId) {
    return JSON.parse(localStorage[projectId]);
}

async function getProjectsFromDB (username) {
    let postData = {
        username: username
    };
    if (postData != null) {
        const response = axios.post(adress + 'projectsDB', postData)
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

async function addProjectToDB (userId, projectId, projectName, projectDescription, projectDate, projectData) {
    let postData = {
        userId: userId,
        projectId: projectId,
        projectName: projectName,
        projectDescription: projectDescription,
        projectDate: projectDate,
        projectData: projectData
    };
  
    if (postData != null) {
        const response = await axios.post(adress + 'projectDB', postData)
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

async function getProjectDetailsFromDB (projectId) {
    let postData = {
        projectId: projectId
    };
  
    if (postData != null) {
        const response = axios.post(adress + 'projectDB', postData)
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

async function deleteProjectFromDB(userId, projectId) {
    let postData = {
        userId: userId,
        projectId: projectId
    };
  
    if (postData != null) {
        const response = await axios.post(adress + 'projectDBdelete', postData)
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

async function updateProjectInDB(projectId, newProjectName, newProjectDescription){
    let postData = {
        projectId: projectId,
        projectName: newProjectName,
        projectDescription: newProjectDescription
    };

    if (postData != null) {
        const response = await axios.post(adress + 'projectDB', postData)
        .then((res) => {
            if (res.status == 200) {
                return res.data;
            }
        })
        .catch((err) => {
            return "error";
        })
        console.log(response)

        return response;
    }
}

export {getProjectsFromDB, getProjectDetailsFromDB, addProjectToDB, deleteProjectFromDB, updateProjectInDB, getMilestones}; 