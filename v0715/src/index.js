import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import User from './pages/user'
import Project from './components/Project/project'
import Milestone from './components/MileStone/milestone'
import GanttChart from './components/GanttChart/ganttChart'

// //Sample code
const userId = "userId"
init(userId)
export const userData = new User(userId)
export const userDataContext = React.createContext()

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <>
        <BrowserRouter>
            <userDataContext.Provider value={userData}>
                <Routes>
                  <Route path='/' element={<Project/>}/>
                  <Route path='/milestone/:projectId' element={<Milestone/>}/>
                  <Route path='/gantt/:projectId' element={<GanttChart/>}/>
                </Routes>
            </userDataContext.Provider>
        </BrowserRouter>
    </>
);

function init(userId) {
    if (localStorage?.userId == null) {
      localStorage.setItem(userId, '{"projectId1": ["ProjectName1", "New Project", "2021-10-10"], "projectId2": ["ProjectName2", "Another New Project", "2022-10-10"], "projectId3": ["ProjectName2", "Another New Project", "2001-01-01"]}');
      for(let i=1; i<4; i++) {
        localStorage.setItem("projectId" + i, JSON.stringify({Milestone1: {"milestoneName": "Milestone1", "color": "red", "tasks": ["task1" + i, "task2" + i, "task3" + i]}, Milestone2: {"milestoneName": "Milestone2", "color": "green", "tasks": ["task4" + i, "task5" + i, "task6" + i]}, Milestone3: {"milestoneName": "Milestone3", "color": "violet", "tasks": ["task7" + i, "task8" + i, "task9" + i]}}));
        for(let j=1; j<10; j++) {
          localStorage.setItem("task" + j + i, JSON.stringify({"task-name": "task" + j + i, "start-time":"2022-03-04", "finish-time":"2022-04-04", "members": ["小林", "ミコラ"], "priority": "high", "creation-time":"2022-03-01", "creator":"ミコラ",  "checkpoints":["check1", "check2"], "comments": ["comment1", "comment2"], "description":"Super-Project smth smth", "follow-state":"true", "progress": 50}));
        }
      }
      for(let i=1; i<3; i++) {
        localStorage.setItem("comment" + i, JSON.stringify({"creator":"ミコラ", "creation-time":"2022-04-04-20-00-01", "members": ["小林", "薦野"], "linked-files":["file1", "file2"], "description":"Kobayashi is hentai."}));
      }
      localStorage.setItem("members", JSON.stringify([{value: "ミコラ", label: "ミコラ"},{value: "小林", label: "小林"},{value: "小山", label: "小山"},{value: "薦野", label: "薦野"}]));
    }
  }