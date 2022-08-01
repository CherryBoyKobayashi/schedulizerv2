const axios = require('axios').default;

async function addUserToDB(username, mail, password) {
    let return_value = 0;
    const response = await getUserFromDB(username, password)
    if (response == "no value") {
        try {
            let postData = {
                username: username,
                mail: mail,
                password: password
            };

            const new_response = await axios.post('http://localhost:3000/userDB', postData).catch((err) => {
                return "error";
            })

            if (new_response.data == "OK") {
                return_value = 1;
            }
        } catch {
        }
    }
    return return_value;
}

async function getUserFromDB (username, password) {
    let postData = {
        username: username,
        password: password
    };
  
    const response = axios.post('http://localhost:3000/userDB', postData)
    .then((res) => {
        if (res.status == 200) {
            return res.data;
        }
        else {
            return "no value";
        }
    })
    .catch((err) => {
        return "error";
    })

    return response;
}

async function deleteUserFromDB(username, password) {
    let response_value = 0;
    let postData = {
        username: username,
        password: password
    };
  
    const response = await axios.post('http://localhost:3000/userDBdelete', postData)
    .then((res) => {
        if (res.status == 200) {
            response_value = 1;
            return res.data;
        }
        else {
            return "no value";
        }
    })
    .catch((err) => {
        return "error";
    })

    return response_value;
}

export {addUserToDB, getUserFromDB, deleteUserFromDB}; 