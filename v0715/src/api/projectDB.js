const axios = require('axios').default;

function getMilestones(projectId) {
    return JSON.parse(localStorage[projectId]);
}

async function getProjectsFromDB (username) {
    let postData = {
        username: username
    };
  
    const response = axios.post('http://localhost:3000/projectsDB', postData)
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

async function addProjectToDB (userId, projectId, projectName, projectDescription, projectDate, projectData) {
    let postData = {
        userId: userId,
        projectId: projectId,
        projectName: projectName,
        projectDescription: projectDescription,
        projectDate: projectDate,
        projectData: projectData
    };
  
    const response = await axios.post('http://localhost:3000/projectDB', postData)
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

async function getProjectDetailsFromDB (projectId) {
    let postData = {
        projectId: projectId
    };
  
    const response = axios.post('http://localhost:3000/projectDB', postData)
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

async function deleteProjectFromDB(userId, projectId) {
    let postData = {
        userId: userId,
        projectId: projectId
    };
  
    const response = await axios.post('http://localhost:3000/projectDBdelete', postData)
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

async function updateProjectInDB(projectId, newProjectName, newProjectDescription){
    let postData = {
        projectId: projectId,
        projectName: newProjectName,
        projectDescription: newProjectDescription
    };

    const response = await axios.post('http://localhost:3000/projectDB', postData)
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

export {getProjectsFromDB, getProjectDetailsFromDB, addProjectToDB, deleteProjectFromDB, updateProjectInDB, getMilestones}; 