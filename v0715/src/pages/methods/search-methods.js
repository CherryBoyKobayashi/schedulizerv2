function searchProject(keyword, userData){
    let results = new Set();
    for (let project in userData.projects) {
        for (let property in userData.projects[project]) {
            if (typeof userData.projects[project][property] == "string") {
                if (userData.projects[project][property].toLowerCase().includes(keyword)) {
                    results.add(project);
                    continue
                }
            }
            else {
                for (let new_property in userData.projects[project][property]) {
                    for (let new_new_property in userData.projects[project][property][new_property]) {
                        if(typeof userData.projects[project][property][new_property][new_new_property] == "string") {
                            if (userData.projects[project][property][new_property][new_new_property].toLowerCase().includes(keyword)) {
                                results.add(project);
                                continue
                            } 
                        } 
                        else {
                            for (let new_new_new_property in userData.projects[project][property][new_property][new_new_property]) {
                                for(let new_new_new_new_property in userData.projects[project][property][new_property][new_new_property][new_new_new_property]) {
                                    if(typeof userData.projects[project][property][new_property][new_new_property][new_new_new_property][new_new_new_new_property] == "string") {
                                        if (userData.projects[project][property][new_property][new_new_property][new_new_new_property][new_new_new_new_property].toLowerCase().includes(keyword)) {
                                            results.add(project);
                                            continue
                                        } 
                                    } 
                                    else {
                                        for (let new_new_new_new_new_property in userData.projects[project][property][new_property][new_new_property][new_new_new_property][new_new_new_new_property]) {
                                            if(typeof userData.projects[project][property][new_property][new_new_property][new_new_new_property][new_new_new_new_property][new_new_new_new_new_property] == "string") {
                                                if (userData.projects[project][property][new_property][new_new_property][new_new_new_property][new_new_new_new_property][new_new_new_new_new_property].toLowerCase().includes(keyword)) {
                                                    results.add(project);
                                                    continue
                                                } 
                                            } 
                                            else {
                                                if (userData.projects[project][property][new_property][new_new_property][new_new_new_property][new_new_new_new_property][new_new_new_new_new_property].toString().toLowerCase().includes(keyword)) {
                                                    results.add(project);
                                                    continue
                                                } 
                                            }
                                        } 
                                    }
                                }
                            }
                        } 
                    }                 
                }
            }
        }
    }
    return Array.from(results);
}

function searchMilestone(keyword, milestoneObj){
    let results = new Set();
    let tasks = new Set();
    for (let milestone in milestoneObj) {
        for (let property in milestoneObj[milestone]) {
            if(typeof milestoneObj[milestone][property] == "string") {
                if (milestoneObj[milestone][property].toLowerCase().includes(keyword)) {
                    results.add(milestone);
                    continue
                } 
            } 
            else {
                for (let new_property in milestoneObj[milestone][property]) {
                    for (let new_new_property in milestoneObj[milestone][property][new_property]) {
                        if(typeof milestoneObj[milestone][property][new_property][new_new_property] == "string") {
                            if (milestoneObj[milestone][property][new_property][new_new_property].toLowerCase().includes(keyword)) {
                                results.add(milestone);
                                continue
                            } 
                        } 
                        else {
                            for (let new_new_new_new_property in milestoneObj[milestone][property][new_property][new_new_property]){
                                if(typeof milestoneObj[milestone][property][new_property][new_new_property][new_new_new_new_property] == "string") {
                                    if (milestoneObj[milestone][property][new_property][new_new_property][new_new_new_new_property].toLowerCase().includes(keyword)) {
                                        results.add(milestone);
                                        continue
                                    } 
                                } 
                                else {
                                    if (milestoneObj[milestone][property][new_property][new_new_property][new_new_new_new_property].toString().toLowerCase().includes(keyword)) {
                                        results.add(milestone);
                                        continue
                                    } 
                                }
                            }
                        }
                    }
                }
            }
        }
        for (let task in milestoneObj[milestone].tasks) {
            for (let property in milestoneObj[milestone].tasks[task]) {
                if(typeof milestoneObj[milestone].tasks[task][property] == "string") {
                    if (milestoneObj[milestone].tasks[task][property].toLowerCase().includes(keyword)) {
                        tasks.add(milestoneObj[milestone].tasks[task].taskId);
                        continue
                    } 
                } 
                else {
                    for (let new_property in milestoneObj[milestone].tasks[task][property]) {
                        if(typeof milestoneObj[milestone].tasks[task][property][new_property] == "string") {
                            if (milestoneObj[milestone].tasks[task][property][new_property].toLowerCase().includes(keyword)) {
                                tasks.add(milestoneObj[milestone].tasks[task].taskId);
                                continue
                            } 
                        } 
                        else {
                            if (milestoneObj[milestone].tasks[task][property][new_property].toString().toLowerCase().includes(keyword)) {
                                tasks.add(milestoneObj[milestone].tasks[task].taskId);
                                continue
                            }
                        }
                    }
                }
            }
        }
    }
    return [Array.from(results), Array.from(tasks)];
}


export {searchProject, searchMilestone}; 