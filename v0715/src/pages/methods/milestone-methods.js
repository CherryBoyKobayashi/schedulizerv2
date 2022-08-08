import { v4 as uuidv4 } from 'uuid';
import { addMilestoneToDB, deleteMilestoneFromDB, updateMilestoneInDB, saveMilestoneToDB } from '../../api/milestoneDB';
import {deleteTask} from '../../api/taskDB';

    async function addMilestone(project, milestoneName, newColor, projectId) {
        let milestoneId = uuidv4();
        let tasks = []
        let response = await addMilestoneToDB(projectId, milestoneId, milestoneName, newColor, tasks);
        if (response == "OK") {
            project[project.length] = {"milestoneId": milestoneId, "milestoneName": milestoneName, "color":newColor, "tasks":tasks}
        }
    }

    async function deleteMilestone(project, milestoneId, projectId) {
        for (let task in project[milestoneId].tasks) {
            if (task != undefined) {
                deleteTask(project[milestoneId].tasks[task].taskId)
            }
        }
        let response = await deleteMilestoneFromDB(projectId, project[milestoneId].milestoneId);
        if (response == "OK") {
            delete project[milestoneId];
        }
    }

    async function updateMilestone(project, milestoneId, milestoneName, newColor, tasks, projectId) {
        let response = await updateMilestoneInDB(projectId, project[milestoneId].milestoneId, milestoneName, newColor, tasks.map((u) => u.taskId));
        if (response == "OK") {
            project[milestoneId]= {"milestoneId": project[milestoneId].milestoneId, "milestoneName": milestoneName, "color":newColor,"tasks":tasks};
        }
    }

    async function saveMilestone(projectId, milestoneObj){
        milestoneObj = milestoneObj.filter(n => n)
        let projectData = JSON.parse(JSON.stringify(milestoneObj))
        for (let i in milestoneObj) {
            projectData[i].tasks = milestoneObj[i].tasks.map((a) => a.taskId);
        }
        saveMilestoneToDB(projectId, projectData);
    }



export {addMilestone, deleteMilestone, updateMilestone, saveMilestone};