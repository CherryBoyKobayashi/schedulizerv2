import { AiOutlineConsoleSql } from 'react-icons/ai';
import Project from './project';

class User {
  constructor(userId) {
    this.userId = userId;
    this.projects = this.getProjects(userId);
  }

  getProjects(userId) {
    try{
    let projects = [];
    let projectList = Object.keys(JSON.parse(localStorage.getItem(userId)));
    for(let i=0; i<projectList.length; i++) {
        projects[projectList[i]] = new Project(projectList[i], JSON.parse(localStorage[userId])[projectList[i]][0], JSON.parse(localStorage[userId])[projectList[i]][1], JSON.parse(localStorage[userId])[projectList[i]][2]);
    }
    return projects;
  }
  catch{}
  }

  updateUser() {
    localStorage.setItem(this.userId, JSON.stringify(this.projects));
  }
}

export default User;