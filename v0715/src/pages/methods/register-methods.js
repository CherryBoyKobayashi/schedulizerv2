import {addUserToDB, deleteUserFromDB} from '../../api/userDB';

async function addUser(username, mail, password) {
    let return_value = await addUserToDB(username, mail, password);
    return return_value;
}

async function deleteUser(username, password) {
    let return_value = await deleteUserFromDB(username, password);
    return return_value;
}

export {addUser, deleteUser}; 