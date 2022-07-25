function checkUser(username, password) {
    let return_value = 0;
    let user = JSON.parse(localStorage.getItem("X" + username));
    if (user != null) {
        if(user.password == password) {
            localStorage.setItem("loggedUserNameForJootoPakuriApp", username);
            return_value = 1;
        }
    }
    return return_value;
}


export {checkUser}; 