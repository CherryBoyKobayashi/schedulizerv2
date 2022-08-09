import express from 'express'
import { LowSync, JSONFileSync } from 'lowdb'
import winston from 'winston'
import expressWinston from 'express-winston'

const app = express()
app.use(express.json())
const adapter = new JSONFileSync('./db.json')
const db = new LowSync(adapter)

app.use(expressWinston.logger({
  level: "info",
  format: winston.format.simple(),
  transports: [
      new winston.transports.Console()
  ],
  meta: false,
  metaField: null,
  msg: "HTTP {{ req.method }} {{ req.url }}",
  expressFormat: true
}));

app.post('/userDB', async (req, res) => {
  try {
    await db.read()
    db.data ||= { users: [] }
    const {users} = db.data
    if (req.body.username != undefined) {
      let user = users.find((u) => u.username == req.body.username)
      if(user != undefined) {
        if(user.password == req.body.password) {
          if(req.body.delete == true) {
            db.data.users = db.data.users.filter(data => data.username != user.username)
            let deleteProjects = db.data.user_projects.filter(data => data.username == user.username)
            deleteProjects = deleteProjects[0].projects
            db.data.projects = db.data.projects.filter(data => !deleteProjects.includes(data.projectId))
            db.data.user_projects = db.data.user_projects.filter(data => data.username != user.username)
            db.data.tasks = db.data.tasks.filter(data => data.creator != user.username)
            await db.write()
            res.sendStatus(200);
          } else {
            res.send(user);
          }
        }
        else {
          res.sendStatus(401);
        }
      }
      else {
        if (req.body.mail == undefined) {
          res.sendStatus(204);
        } else {
          const {users} = db.data
          users.push(req.body)
          const {user_projects} = db.data
          user_projects.push({username: req.body.username, projects: []})
          await db.write()
          res.sendStatus(200)
        }
      }
    }
    else {
      res.send(users.map(a => a.username))
    }
  } catch {
    res.sendStatus(500);
  }
})

app.post('/projectDB', async (req, res) => {
  try {
    await db.read()
    db.data ||= { projects: [] }
    if(req.body.username != undefined) {
      if(req.body.additional == true) {
        let additionalTasks = db.data.tasks.filter(task => task.members.includes(req.body.username) && task.creator != req.body.username)
        additionalTasks = additionalTasks.map(task => task.taskId)
        let additionalProjects = []
        for (let project in db.data.projects) {
          for(let milestone in db.data.projects[project].projectData) {
            for (let task in db.data.projects[project].projectData[milestone].tasks) {
              if (additionalTasks.includes(db.data.projects[project].projectData[milestone].tasks[task])) {
                additionalProjects.push(db.data.projects[project].projectId)
                break
              }
            }
          }
        }
        res.send(additionalProjects)
      } else {
        const {user_projects} = db.data
        let user_project = user_projects.find((u) => u.username == req.body.username)
        if(user_project != undefined) {
          res.send(user_project);
        }
        else {
          res.sendStatus(204)
        }
      }
    } else {
      const {projects} = db.data
      let project = projects.find((u) => u.projectId == req.body.projectId)
      if(project != undefined) {
        if ((req.body.delete == true)) {
          if(db.data.projects.filter(data => data.projectId == project.projectId && data.projectCreator == req.body.userId).length != 0) {
            db.data.projects = db.data.projects.filter(data => data.projectId != project.projectId || data.projectCreator != req.body.userId)
            db.data ||= { user_projects: [] }
            const {user_projects} = db.data
            let user_project = user_projects.find((u) => u.username == req.body.userId)
            user_project.projects = user_project.projects.filter(data => data != req.body.projectId)
            await db.write()
            res.sendStatus(200);
          } else {
            res.sendStatus(204);
          }
        } else {
          if (req.body.projectName == undefined) {
            res.send(project);
          } else {
            project.projectName = req.body.projectName;
            project.projectDescription = req.body.projectDescription;
            await db.write()
            res.sendStatus(200)
          }
        }
      }
      else {
        if (req.body.userId == undefined) {
          res.send(204);
        } else {
          db.data ||= { user_projects: [] }
          const {user_projects} = db.data
          let user_project = user_projects.find((u) => u.username == req.body.userId)
          user_project.projects.push(req.body.projectId)
          let pproject = req.body;
          delete pproject.userId;
          pproject.projectData = JSON.parse(pproject.projectData)
          const {projects} = db.data
          projects.push(pproject)
          await db.write()
          res.sendStatus(200)
        }
      }
    }
  } catch {
    res.sendStatus(500);
  }
})

app.post('/milestoneDB', async (req, res) => {
  try {
    await db.read()
    db.data ||= { projects: [] }
    const {projects} = db.data
    let project = projects.find((u) => u.projectId == req.body.projectId)
    if(project != undefined) {
      if(req.body.projectData != undefined) {
        project.projectData = req.body.projectData
        await db.write()
        res.sendStatus(200)
      } else {
        if(project.projectData != undefined) {
          if (project.projectData.filter(data => data.milestoneId == req.body.milestoneId).length != 0) {
            if (req.body.milestoneName != undefined){
              delete req.body.projectId;
              let milestone = project.projectData.filter(data => data.milestoneId == req.body.milestoneId)[0]
              milestone.milestoneName = req.body.milestoneName;
              milestone.color = req.body.color;
              milestone.tasks = req.body.tasks;
              await db.write()
              res.sendStatus(200)
            } else {
              if (project.projectData.filter(data => data.milestoneId != req.body.milestoneId) != null) {
                if(project.projectCreator == req.body.userId) {
                  project.projectData = project.projectData.filter(data => data.milestoneId != req.body.milestoneId)
                  await db.write()
                  res.sendStatus(200)
                }
              }
            }
          } else {
            delete req.body.projectId;
            project.projectData.push(req.body)
            await db.write()
            res.sendStatus(200)
          }
        }
      }
    }
    else {
      if (req.body.userId == undefined) {
        res.send(204);
      }
    }
  } catch {
    res.sendStatus(500);
  }
})

app.post('/taskDB', async (req, res) => {
  try {
    await db.read()
    if(req.body.userId != undefined) {
      if (req.body.delete == true) {
        db.data ||= { tasks: [] }
        const {tasks} = db.data
        let task = tasks.find((u) => u.taskId == req.body.taskId)
        if(task != undefined && task.creator == req.body.userId) {
          db.data.tasks = db.data.tasks.filter(data => data.taskId != task.taskId)
          await db.write()
          res.sendStatus(200);
        }
        else {
          res.sendStatus(204)
        }
      } else {
        db.data ||= { tasks: [] }
        const {tasks} = db.data
        let task = tasks.find((u) => u.taskId == req.body.taskId && u.members.includes(req.body.userId))
        if(task != undefined) {
          res.send(task);
        }
        else {
          res.sendStatus(204)
        }
      }
    }
    else {
      db.data ||= { projects: [] }
      const {projects} = db.data
      let project = projects.find((u) => u.projectId == req.body.projectId)
      let milestone = project.projectData.filter(data => data.milestoneId == req.body.milestoneId)[0]
      let t = milestone.tasks.filter(data => data == req.body.taskId)
      let {tasks} = db.data
      if (t.length == 0) {
        milestone.tasks.push(req.body.taskId);
        delete req.body.projectId;
        delete req.body.milestoneId;
        tasks.push(req.body);
        await db.write();
      }
      else {
        delete req.body.projectId;
        delete req.body.milestoneId;
        db.data.tasks = db.data.tasks.map(obj => [req.body].find(o => o.taskId == obj.taskId) || obj)
        await db.write();
      }
      res.sendStatus(200);
    }
  } catch {
    res.sendStatus(500);
  }
})

app.listen(3000, () => {
  console.log('listening on port 3000')
})