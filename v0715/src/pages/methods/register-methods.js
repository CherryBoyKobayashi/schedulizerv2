import { v4 as uuidv4 } from 'uuid';

function addUser(username, mail, password) {
    let return_value = 0;
    if (localStorage.getItem("X" + username) == null) {
        localStorage.setItem("X" + username, JSON.stringify({mail, password}))
        let members = JSON.parse(localStorage.getItem("members"));
        if (members != null) {
            members.push({value: username, label: username});
        }
        else {
            members = ([{value: username, label: username}]);
        }
        localStorage.setItem("members", JSON.stringify(members));
        init(username);
        return_value = 1;
    }
    return return_value;
}

function deleteUser(username, password) {
    let return_value = 0;
    if (JSON.parse(localStorage.getItem("X" + username)).password == password) {
        localStorage.removeItem("X" + username);
        localStorage.removeItem(username);
        let members = JSON.parse(localStorage.getItem("members"));
        for(let i = 0; i<members.length; i++){ 
            if(members[i].value == username) {
                members.splice(i, 1); 
                break;
            }
        }
        localStorage.setItem("members", JSON.stringify(members));
        return_value = 1;
    }
    return return_value;
}

function init(userId) {
    let projectId = uuidv4();
    let taskId = uuidv4();
    let commentId = uuidv4();
    let projectHolder = {}
    projectHolder[projectId] = ["プロジェクト名１", "私の新しいプロジェクト", formatDate(new Date(Date.now()), 'yyyy-MM-dd')];
    if (localStorage?.userId == null) {
      localStorage.setItem(userId, JSON.stringify(projectHolder));
      localStorage.setItem(projectId, JSON.stringify({Milestone1: {"milestoneName": "マイルストーン1", "color": "red", "tasks": [taskId]}}));
      localStorage.setItem(taskId, JSON.stringify({"task-name": "タスク１", "start-time":formatDate(new Date(Date.now()), 'yyyy-MM-dd'), "finish-time":formatDate(new Date(Date.now() + 90000000), 'yyyy-MM-dd'), "members": [userId], "priority": "high", "creation-time":formatDate(new Date(Date.now()), 'yyyy-MM-dd'), "creator":userId,  "checkpoints":["Checkpoint1", "check2"], "comments": [commentId], "description":"私の新しいタスク", "follow-state":"true", "progress": 10}));
      localStorage.setItem(commentId, JSON.stringify({"creator":userId, "creation-time":formatDate(new Date(Date.now()), 'yyyy-MM-dd'), "members": [userId], "linked-files":["file1"], "description":"No Kobayashi here"}));
    }
  }


const formatDate = (date, format) => {
  format = format.replace(/yyyy/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3));
  return format
}


export {addUser, deleteUser}; 