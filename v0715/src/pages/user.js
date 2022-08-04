import Project from './project';
import {getProjectsFromDB, getProjectDetailsFromDB} from '../api/projectDB.js'

class User {
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
      projects[projectList[i]] = await this.projectBuilder(projectList[i], projectDetails.projectName, projectDetails.projectDescription, projectDetails.projectDate, projectDetails.projectData);
    }
    return projects;
  }
  catch{}
  }

  async projectBuilder(p1, p2, p3, p4, p5) {
    let project = new Project();
    project.projectId = p1;
    project.projectName = p2;
    project.projectDescription = p3;
    project.projectDate = p4;
    project.projectData = await project.getProjectData(p5);
    console.log("A")
    console.log(project)
    return project;
  }
}

export default User;