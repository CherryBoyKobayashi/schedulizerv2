import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import User from './pages/user'
import LoginPage from './components/LoginPage/loginpage'
import Register from './components/Register/register'
import Project from './components/Project/project'
import Milestone from './components/MileStone/milestone'
import GanttChart from './components/GanttChart/ganttChart'

const root = ReactDOM.createRoot(document.getElementById('root'))
const userId = localStorage.getItem("loggedUserNameForJootoPakuriApp"); //NOT SECURE
let userData = await userBuilder(userId);
let userDataContext = React.createContext()

async function userBuilder(userId) {
  let user = new User();
  user.userId = userId;
  user.projects = await user.getProjects(userId);
  return user;
}


if (userId == null) {
  root.render(
    <>
        <BrowserRouter>
            <userDataContext.Provider value={userData}>
              <Routes>
                <Route exact path='/' element={<LoginPage/>}/>
                <Route exact path='/register' element={<Register/>}/>
              </Routes>
            </userDataContext.Provider>
        </BrowserRouter>
    </>
  );
}
else {
    root.render(
    <>
        <BrowserRouter>
            <userDataContext.Provider value={userData}>
                <Routes>
                  <Route exact path='/' element={<Project/>}/>
                  <Route path='/milestone/:projectId' element={<Milestone/>}/>
                  <Route path='/gantt/:projectId' element={<GanttChart/>}/>
                </Routes>
            </userDataContext.Provider>
        </BrowserRouter>
    </>
  );
}

export {userData, userDataContext}