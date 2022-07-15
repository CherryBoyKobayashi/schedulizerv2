import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

ReactDOM.render(
    <h1>Hello from js</h1>,
  );

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import Account from './components/Account/account';
// import Milestone from './components/MileStone/milestone';
// import Project from './components/Project/project';
// import Setting from './components/Setting/setting';
// import './index.css'
// import User from './pages/user';
// import GanttChart from './components/GanttChart/ganttChart'
// import TedukuriGantt from './components/TedukuriGantt/tedukuriGantt'
// import Error from './components/Error/error';

// //Sample code
// const userId = "userId";
// init(userId);
// export const userData = new User(userId)
// export const userDataContext = React.createContext()

// //Comment methods
// // addComment(userData.projects.projectId1.projectData.Milestone1.tasks.task1.taskData, userData.userId, ["ミコラ", "小林"], ["file1", "filet2"], "NEW COMMENT");
// // deleteComment(userData.projects.projectId1.projectData.Milestone1.tasks.task1.taskData.comments, "comment1");
// // updateComment(userData.projects.projectId1.projectData.Milestone1.tasks.task2.taskData.comments, "comment1", userData.userId, "2021-10-10", ["ミコラ", "小林"], ["file1", "filet2"], "NEW COMMENT");
// // saveComment(userData.projects.projectId1.projectData.Milestone1.tasks.task2.taskData.comments.comment1);

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//     <>
//         <BrowserRouter>
//             <userDataContext.Provider value={userData}>
//                 <Routes>
//                   <Route path='/' element={<Project/>}/>
//                   <Route path='/milestone/:projectId' element={<Milestone/>}/>
//                   <Route path='/gantt/:projectId' element={<GanttChart/>}/>
//                   <Route path='/account' element={<Account/>}/>
//                   <Route path='/setting' element={<Setting/>}/>
//                   <Route path='/tedukuri' element={<TedukuriGantt/>}/>
//                   <Route path='*' element={<Error/>}></Route>
//                 </Routes>
//             </userDataContext.Provider>
//         </BrowserRouter>
//     </>
// );


// function init(userId) {
//     if (localStorage?.userId == null) {
//       localStorage.setItem(userId, '{"projectId1": ["ProjectName1", "New Project", "2021-10-10"], "projectId2": ["ProjectName2", "Another New Project", "2022-10-10"], "projectId3": ["ProjectName2", "Another New Project", "2001-01-01"]}');
//       for(let i=1; i<4; i++) {
//         localStorage.setItem("projectId" + i, JSON.stringify({Milestone1: {"milestoneName": "Milestone1", "color": "red", "tasks": ["task1" + i, "task2" + i, "task3" + i]}, Milestone2: {"milestoneName": "Milestone2", "color": "green", "tasks": ["task4" + i, "task5" + i, "task6" + i]}, Milestone3: {"milestoneName": "Milestone3", "color": "violet", "tasks": ["task7" + i, "task8" + i, "task9" + i]}}));
//         for(let j=1; j<10; j++) {
//           localStorage.setItem("task" + j + i, JSON.stringify({"task-name": "task" + j + i, "start-time":"2022-03-04", "finish-time":"2022-04-04", "members": ["小林", "ミコラ"], "priority": "high", "creation-time":"2022-03-01", "creator":"ミコラ",  "checkpoints":["check1", "check2"], "comments": ["comment1", "comment2"], "description":"Super-Project smth smth", "follow-state":"true", "progress": 50}));
//         }
//       }
//       for(let i=1; i<3; i++) {
//         localStorage.setItem("comment" + i, JSON.stringify({"creator":"ミコラ", "creation-time":"2022-04-04-20-00-01", "members": ["小林", "薦野"], "linked-files":["file1", "file2"], "description":"Kobayashi is hentai."}));
//       }
//       localStorage.setItem("members", JSON.stringify([{value: "ミコラ", label: "ミコラ"},{value: "小林", label: "小林"},{value: "小山", label: "小山"},{value: "薦野", label: "薦野"}]));
//     }
//   }