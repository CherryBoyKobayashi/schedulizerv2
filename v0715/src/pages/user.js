import Project from './project';
import {getProjectsFromDB, getProjectDetailsFromDB} from '../api/projectDB.js'

class User {
  constructor(userId) {
    this.init(userId)
  }

  async init(userId) {
    this.userId = userId;
    this.projects = [];
    this.projects = await this.getProjects(userId);
  }

  async getProjects(userId) {
    try{
    let projects = [];
    let projectList = [];
    let projectResponse = await getProjectsFromDB(userId);
    if (projectResponse != "no value") {
      projectList = projectResponse.projects
    }

    for(let i=0; i<projectList.length; i++) {
      let projectDetails = await getProjectDetailsFromDB(projectList[i]);
      projects[projectList[i]] = new Project(projectList[i], projectDetails.projectName, projectDetails.projectDescription, projectDetails.projectDate, projectDetails.projectData);
    }
    return projects;
  }
  catch{}
  }

  // updateUser() {
  //   localStorage.setItem(this.userId, JSON.stringify(this.projects));
  // }
}

export default User;