import './loginpage.css'
import React from "react";
import {checkUser} from '../../pages/methods/login-methods';

function LoginPage() { 
    function checkUserHere () {
      event.preventDefault();
      let result_value = checkUser(document.getElementById("username").value, document.getElementById("password").value)
      if (result_value == 1) {
        alert("ログインしました！");
        window.location.reload();
      } else {
        alert("エラーが発生しました！");
      }
    }

    return (
        <>
        <div className="login-wrapper">
        <h1>ログイン</h1>
        <form onSubmit={()=>checkUserHere()}>
          <label>
            <p>ユーザーネーム</p>
            <input type="text" id="username" required/>
          </label>
          <label>
            <p>パスワード</p>
            <input type="password" id="password" required/>
          </label>
          <div>
            <button type="submit">エンター</button>
          </div>
          <a href="/register">新規ユーザーの登録</a>
        </form>
      </div>
      </>
    )
}

export default LoginPage;