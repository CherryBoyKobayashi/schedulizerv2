import {getTaskDetails} from '../api/taskDB';
import Task from './task';

class Project {
    constructor(projectId, projectName, projectDescription, projectDate, projectData) {
      this.init(projectId, projectName, projectDescription, projectDate, projectData)
    }

    async init(projectId, projectName, projectDescription, projectDate, projectData) {
      this.projectId = projectId;
      this.projectName = projectName;
      this.projectDescription = projectDescription;
      this.projectDate = projectDate;
      this.projectData = await this.getProjectData(projectData);
    }
    
    async getProjectData(projectData) {
      try {
        for(let i=0; i<projectData.length; i++) {
          let key = Object.keys(projectData[i]);
          let tasks = [];
          for(let j=0; j<projectData[i][key].tasks.length; j++) {
            let taskData = await getTaskDetails(projectData[i][key].tasks[j]);
            tasks.push(new Task(projectData[i][key].tasks[j], taskData));
          }
          projectData[i][key].tasks = tasks;
        }
      } catch {
        console.log("No milestone data present!");
      }
      return projectData;
    }
}

export default Project;