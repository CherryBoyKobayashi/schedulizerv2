import './loginpage.css'
import React from "react"
import {getUserFromDB} from '../../api/userDB'
import { Link } from 'react-router-dom'

const LoginPage = () => {
    const checkUserHere = async (e) => {
      e.preventDefault()
      const result_value = await getUserFromDB(document.getElementById("username").value, document.getElementById("password").value)
      if (result_value != "error" && result_value != "no value") {
        sessionStorage.setItem("loggedUserNameForJootoPakuriApp", result_value.username)
        alert("ログインしました！")
        window.location.reload()
      } else {
        alert("エラーが発生しました！")
      }
    }
    const Bubble = () => {
      return (
        <div className="bubble">
          {[...Array(5)].map((_, i) => <span key={'bubbleSpan' + i}/>)}
        </div>
      )
    }

    return (
        <>
          {[...Array(3)].map((_, i) => {return <Bubble key={'bubble' + i}/>})}
          <div className="login-wrapper">
            <h2>Login Page</h2>
            <form onSubmit={(e)=>checkUserHere(e)}>
              <label>
                <h4>ユーザーネーム</h4>
                <input type="text" id="username" required/>
              </label>
              <label>
                <h4>パスワード</h4>
                <input type="password" id="password" required/>
              </label>
              <div className='submitBtnDiv'>
                <button className='btn' type="submit">エンター</button>
              </div>
              <Link to={'/register'}>新規ユーザーの登録/ユーザ削除</Link>
            </form>
          </div>
      </>
    )
}

export default LoginPage;