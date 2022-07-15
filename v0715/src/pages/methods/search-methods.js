function searchProject(keyword, userData){
    let results = [];
    for (let project in userData.projects) {
        if (JSON.stringify(userData.projects[project]).toLowerCase().includes(keyword)) {
            results.push(project)
        }
    }
    return results;
}

function searchMilestone(keyword, milestoneObj){
    let results = [];
    let tasks = []
    for (let milestone in milestoneObj) {
        if (JSON.stringify(milestoneObj[milestone]).toLowerCase().includes(keyword)) {
            results.push(milestone)
        }
        for (let task in milestoneObj[milestone].tasks) {
            if (JSON.stringify(milestoneObj[milestone].tasks[task]).toLowerCase().includes(keyword)) {
                tasks.push(milestoneObj[milestone].tasks[task].taskId)
            }
        }
    }
    return [results, tasks];
}


export {searchProject, searchMilestone}; 