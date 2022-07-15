function getMilestones(projectId) {
    return JSON.parse(localStorage[projectId]);
}

export default getMilestones; 