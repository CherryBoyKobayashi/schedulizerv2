import './register.css'
import React from "react"
import {addUser, deleteUser} from '../../pages/methods/register-methods'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
    const navigate = useNavigate()

    const registerUser = async (e) => {
        const registerDatas = {}
        e.target.querySelectorAll('input').forEach((input) => registerDatas[input.id] = input.value)
        e.preventDefault()
        if (registerDatas.password !== registerDatas.confirmPassword) {
            alert("同じパスワードを入力してください")
            return
        }
        let return_value = await addUser(registerDatas.username, registerDatas.email, registerDatas.password, registerDatas.group)
        if (return_value === 1) {
            alert("登録しました！")
            navigate('/')
        } else {
            alert("エラーが発生しました！")
        }
    }

    const deleteUserHere = async (e) => {
        e.preventDefault()
        const return_value = await deleteUser(document.getElementById("deleteusername").value, document.getElementById("deletepassword").value)
        if (return_value === 1) {
            alert("削除しました！")
        } else {
            alert("エラーが発生しました！")
        }
    }


    return (
        <>
            <div className='registerDiv'>
                <h2>新規登録</h2>
                <div className="form">
                    <form onSubmit={(e)=>registerUser(e)}>
                        <div className="form-body">
                            <div className="username">
                                <span>ユーザーネーム</span>
                                <span>
                                    <input className="form__input" type="text" id="username" placeholder="ユーザーネーム" required/>
                                </span>
                            </div>
                            <div className="email">
                                <span>メール</span>
                                <span>
                                    <input  type="email" id="email" className="form__input" placeholder="メール" required/>
                                </span>
                            </div>
                            <div className="password">
                                <span>パスワード</span>
                                <span>
                                    <input className="form__input" type="password"  id="password" placeholder="パスワード" required/>
                                </span>
                            </div>
                            <div className="confirm-password">
                                <span>確認用のパスワード</span>
                                <span>
                                    <input className="form__input" type="password" id="confirmPassword" placeholder="確認用のパスワード" required/>
                                </span>
                            </div>
                            <div className="confirm-password">
                                <span>所属グループ</span>
                                <span>
                                    <input className="form__input" type="text" id="group" placeholder="所属グループ" required/>
                                </span>
                            </div>
                        </div>
                    <div className="footer">
                        <button className='btn' type="submit">登録</button>
                    </div>
                    </form>
                </div>
                <div className="form">
                    <h2>ユーザ削除</h2>
                    <form onSubmit={(e)=>deleteUserHere(e)}>
                    <div className="form-body">
                        <div className="username">
                            <span>ユーザーネーム</span>
                            <span>
                                <input className="form__input" type="text" id="deleteusername" placeholder="ユーザーネーム" required/>
                            </span>
                        </div>
                        <div className="password">
                            <span>パスワード</span>
                            <span>
                                <input className="form__input" type="password"  id="deletepassword" placeholder="パスワード" required/>
                            </span>
                        </div>
                    </div>
                    <div className="footer">
                        <button className='btn' type="submit">ユーザー削除</button>
                    </div>
                    </form>
                </div>
                <Link to={'/'}>ログインページに戻る</Link>
            </div>
        </>
    )
}

export default Register;