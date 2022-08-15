const axios = require('axios').default;

const address = 'http://localhost:3000/';

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

            const new_response = await axios.post(address + 'userDB', postData).catch((err) => {
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

    if (postData != null) {
        const response = axios.post(address + 'userDB', postData)
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
}

async function deleteUserFromDB(username, password) {
    let response_value = 0;
    let postData = {
        username: username,
        password: password,
        delete: true
    };
  
    if (postData != null) {
        const response = await axios.post(address + 'userDB', postData)
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
}

async function getUsersFromDB () {
    let postData = {
    };
  
    if (postData != null) {
        const response = await axios.post(address + 'userDB', postData)
        .then((res) => {
            if (res.status == 200) {
                return res.data;
            }
        })
        .catch((err) => {
            return "error";
        })

        return Array.from(response, (value)=> {return {"value": value, "label": value}});
    }
}

export {addUserToDB, getUserFromDB, deleteUserFromDB, getUsersFromDB}; 