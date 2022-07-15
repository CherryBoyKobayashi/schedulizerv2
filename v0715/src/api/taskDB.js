function getTaskDetails(taskId) {
    return JSON.parse(localStorage[taskId]);
}

export default getTaskDetails; 