import getMilestones from '../api/projectDB';
import getTaskDetails from '../api/taskDB';
import getCommentDetails from '../api/commentDB';
import Task from './task';
import Comment from './comment';


class Project {
    constructor(projectId, projectName, projectDescription, projectDate) {
      this.projectId = projectId;
      this.projectName = projectName;
      this.projectDescription = projectDescription;
      this.projectDate = projectDate;
      this.projectData = this.getProjectData(projectId);
    }

    getProjectData(projectId) {
      let projectData = "";
      try {
        projectData = getMilestones(projectId);
        for(let i=0; i<Object.keys(projectData).length; i++) {
          let key = Object.keys(projectData)[i];
          let tasks = [];
          for(let j=0; j<projectData[key].tasks.length; j++) {
            tasks.push(new Task(projectData[key].tasks[j], this.getTaskData(projectData[key].tasks[j])));
          }
          projectData[key].tasks = tasks;
        }
      } catch {
        console.log("No milestone data present!")
      }

      return projectData;
    }

    getTaskData(taskId) {
      let taskData = getTaskDetails(taskId);
      let comments = [];
      for(let i=0; i<taskData.comments.length; i++) {
          comments[taskData.comments[i]] = new Comment(taskData.comments[i], this.getCommentData(taskData.comments[i]));
      }
      taskData.comments = comments;
      return taskData;
    }

    getCommentData(commentId) {
      let commentData = getCommentDetails(commentId);
      return commentData;
    }

}

export default Project;