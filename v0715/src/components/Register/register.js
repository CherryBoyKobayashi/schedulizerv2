import './register.css'
import React from "react";
import {addUser, deleteUser} from '../../pages/methods/register-methods';

function Register() { 
    function registerUser() {
        event.preventDefault();
        if (document.getElementById("password").value != document.getElementById("confirmPassword").value) {
            alert("同じパスワードを入力してください");
        }
        else {
            let return_value = addUser(document.getElementById("username").value, document.getElementById("email").value, document.getElementById("password").value);
            if (return_value == 1) {
                alert("登録しました！");
            } else {
                alert("エラーが発生しました！");
            }
        }
    }
    
    function deleteUserHere() {
        event.preventDefault();
        let return_value = deleteUser(document.getElementById("deleteusername").value, document.getElementById("deletepassword").value)
        if (return_value == 1) {
            alert("削除しました！");
        } else {
            alert("エラーが発生しました！");
        }
    }


    return (
        <>
            <div className="login_link">
                <a href="/">ログインページに戻る</a>
            </div>
            <div className="form">
                <form onSubmit={()=>registerUser()}>
                <div className="form-body">
                    <div className="username">
                    ユーザーネーム <input className="form__input" type="text" id="username" placeholder="ユーザーネーム" required/>
                    </div>
                    <div className="email">
                    メール <input  type="email" id="email" className="form__input" placeholder="メール" required/>
                    </div>
                    <div className="password">
                    パスワード <input className="form__input" type="password"  id="password" placeholder="パスワード" required/>
                    </div>
                    <div className="confirm-password">
                    確認用のパスワード <input className="form__input" type="password" id="confirmPassword" placeholder="確認用のパスワード" required/>
                    </div>
                </div>
                <div className="footer">
                    <input type="submit" value="登録"></input>
                </div>
                </form>
            </div>  
            <div className="form">
                <form onSubmit={()=>deleteUserHere()}>
                <div className="form-body">
                    <div className="username">
                    ユーザーネーム <input className="form__input" type="text" id="deleteusername" placeholder="ユーザーネーム" required/>
                    </div>
                    <div className="password">
                    パスワード <input className="form__input" type="password"  id="deletepassword" placeholder="パスワード" required/>
                    </div>
                </div>
                <div className="footer">
                    <input type="submit" value="ユーザー削除"></input>
                </div>
                </form>
            </div>  
      </>
    )
}

export default Register;