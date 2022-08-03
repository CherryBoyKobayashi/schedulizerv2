import {getTaskDetails} from '../api/taskDB';
import Task from './task';

class Project {
    async getProjectData(projectData) {
      try {
        for(let i=0; i<projectData.length; i++) {
          let tasks = [];
          for(let j=0; j<projectData[i].tasks.length; j++) {
            let taskData = await getTaskDetails(projectData[i].tasks[j]);
            tasks.push(new Task(projectData[i].tasks[j], taskData));
          }
          projectData[i].tasks = tasks;
        }
      } catch {
        console.log("No milestone data present!");
      }
      return projectData;
    }
}

export default Project;