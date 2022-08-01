import './project.css'
import React, { useState, useContext } from "react";
import Modal from 'react-modal/lib/components/Modal';
import TextField from "@mui/material/TextField";
import {MdEditNote, MdDeleteForever} from "react-icons/md"
import { userDataContext } from '../../index'
import Topbar from '../Topbar/topbar';
import {addProject, deleteProject, updateProject} from '../../pages/methods/project-methods';
import { searchProject } from '../../pages/methods/search-methods';

//子コンポーネント全部中に入れちゃった（てへぺろ）
function Project() {
    const userData = useContext(userDataContext)
    let projects = []
    if (userData.projects != undefined) {
        projects = userData.projects
    }
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    //下二つはModalで使ってるよね～ん
    const [modalIsOpen, setIsOpen] = useState(false)
    const [flag, setFlag] = useState()
    const[results, setResults] = useState(Object.values(projects).map((e => e.projectId)));

    let inputHandler = (e) => {
        var lowerCase = e.target.value.toLowerCase();
        let newResults = searchProject(lowerCase, userData);
        setResults(newResults);
        forceUpdate();
    };

    function logOut() {
        localStorage.removeItem("loggedUserNameForJootoPakuriApp");
        window.location.replace("/");
    }
    async function addProjectDiv() {
        await addProject(userData, document.getElementById("projectName").value, document.getElementById("projectDescription").value);
        setResults(Object.values(userData.projects).map((e => e.projectId)));
        forceUpdate();
    }
    async function deleteProjectHere(projectId) {
        await deleteProject(userData, projectId);
        forceUpdate();
    }
    async function updateProjectHere(projectId) {
        await updateProject(userData, projectId, document.getElementById("projectName").value, document.getElementById("projectDescription").value)
        forceUpdate();
    }

    const ProjectChild = (props) => {
        return (
            <div className='project' id={props.projectId} onClick={() => {window.location.href = '/milestone/' + props.projectId}}>
                <h4>{props.projectName}</h4>
                <div className='description'>{props.projectDescription}</div>
                <div className='other'>
                    <span>{props.projectDate}</span>
                    <button className='borderNone' onClick={(e) => {e.stopPropagation();deleteProjectHere(props.projectId);}}><MdDeleteForever className='transformClass'/></button>
                    <button className='borderNone' onClick={(e) => {OverShow(e, 2, props); sessionStorage.setItem("updateProps", JSON.stringify(props));}}><MdEditNote className='transformClass'/></button>
                </div>
            </div>
        )
    }

    const ProjectInner = () => {
        if(flag === 1) {
            return (
                <>
                    <h4>プロジェクト名</h4>
                    <input type='text' id="projectName"/>
                    <h4>プロジェクト説明</h4>
                    <div>
                        <textarea id="projectDescription"></textarea>
                    </div>
                    <button className='minWidth' onClick={()=>{addProjectDiv(); setIsOpen(false);}}>追加</button>
                </>
            )
        } else if (flag === 2) {
            let props = JSON.parse(sessionStorage.getItem("updateProps"));
            return (
                <>
                    <h4>プロジェクト名</h4>
                    <input type='text' id="projectName" defaultValue={props.projectName} />
                    <h4>プロジェクト説明</h4>
                    <div>
                        <textarea id="projectDescription" defaultValue={props.projectDescription}></textarea>
                    </div>
                    <button className='minWidth' onClick={()=>{updateProjectHere(props.projectId); setIsOpen(false);}}>保存</button>
                </>
            )
        }
    }

    const OverShow = (e, num, props = "") => {
        e.stopPropagation()//遷移させないため（親要素のonClickも反応してしまうから）
        setIsOpen(true)
        setFlag(num)
    }

    if (userData.projects != undefined) {
        return (
            <>
                <Topbar/>
                <Modal isOpen={modalIsOpen} overlayClassName={{base: "overlay-base", afterOpen: "overlay-after", beforeClose: "overlay-before"}} className={{base: "content-base", afterOpen: "content-after", beforeClose: "content-before"}} onRequestClose={() => setIsOpen(false)} closeTimeoutMS={500}>
                    <ProjectInner/>
                </Modal>
                <div className="projectDiv">
                    <div className='projectTop'>
                        <div>
                            <TextField
                            id="outlined-basic"
                            onChange={inputHandler}
                            variant="outlined"
                            fullWidth
                            label="Search"
                            />
                        </div>
                        <div className='userlabel'><span>ログイン中のユーザー:</span>{userData.userId}<button onClick={()=>logOut()}>ロッグアウト</button></div>
                        <button onClick={(e) => {OverShow(e, 1)}}>新規プロジェクト</button>
                    </div>
                    <div className='projectBottom'> 
                        {Object.values(userData.projects)?.filter(project => results.includes(project.projectId)).map((e => <ProjectChild {...e} key={e.projectId}/>)) }
                    </div>
                </div>
            </>
        )
    }
    else {
        return (
            <>
                <Topbar/>
                <Modal isOpen={modalIsOpen} overlayClassName={{base: "overlay-base", afterOpen: "overlay-after", beforeClose: "overlay-before"}} className={{base: "content-base", afterOpen: "content-after", beforeClose: "content-before"}} onRequestClose={() => setIsOpen(false)} closeTimeoutMS={500}>
                    <ProjectInner/>
                </Modal>
                <div className="projectDiv">
                    <div className='projectTop'>
                        <div>
                            <TextField
                            id="outlined-basic"
                            onChange={inputHandler}
                            variant="outlined"
                            fullWidth
                            label="Search"
                            />
                        </div>
                        <div className='userlabel'><span>ログイン中のユーザー:</span>{userData.userId}<button onClick={()=>logOut()}>ロッグアウト</button></div>
                        <button onClick={(e) => {OverShow(e, 1)}}>新規プロジェクト</button>
                    </div>
                </div>
            </>
        )
    }
}

export default Project;