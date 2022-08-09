import Project from './project';
import {getProjectsFromDB, getProjectDetailsFromDB, getAdditionalProjectsFromDB} from '../api/projectDB.js'

class User {
  async getProjects(userId) {
    try{
    let projects = [];
    let projectList = [];
    let additionalProjectList = [];
    let projectResponse = await getProjectsFromDB(userId);
    if (projectResponse != "no value") {
      projectList = projectResponse.projects
    }
    let additionalProjectResponse = await getAdditionalProjectsFromDB(userId);
    if (additionalProjectResponse != "no value") {
      additionalProjectList = additionalProjectResponse
    }

    for(let i=0; i<projectList.length; i++) {
      let projectDetails = await getProjectDetailsFromDB(projectList[i]);
      projects[projectList[i]] = await this.projectBuilder(projectList[i], projectDetails.projectName, projectDetails.projectDescription, projectDetails.projectDate, projectDetails.projectData, userId);
    }
    for(let i=0; i<additionalProjectList.length; i++) {
      let projectDetails = await getProjectDetailsFromDB(additionalProjectList[i]);
      projects[additionalProjectList[i]] = await this.projectBuilder(additionalProjectList[i], projectDetails.projectName, projectDetails.projectDescription, projectDetails.projectDate, projectDetails.projectData, userId);
    }
    console.log(additionalProjectResponse)
    return projects;
  }
  catch{}
  }

  async projectBuilder(p1, p2, p3, p4, p5, p6) {
    console.log(p6)
    let project = new Project();
    project.projectId = p1;
    project.projectName = p2;
    project.projectDescription = p3;
    project.projectDate = p4;
    project.projectData = await project.getProjectData(p5, p6);
    return project;
  }
}

export default User;