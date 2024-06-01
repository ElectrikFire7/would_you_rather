import React, {useState, useEffect} from 'react'
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/home.css'
import {BrowserView, MobileView} from 'react-device-detect';

const CreateQuestion = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const username = location.state?.userData?.username ?? "non-user";
    const user_ID = location.state?.userData?.userId ?? "non-user";

    const [description, setDescription] = useState('');
    const [anonymous, setAnonymous] = useState(false);
    const [option1, setOption1] = useState('');
    const [option2, setOption2] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [cerror, setCerror] = useState('');

    useEffect(() => {
        if (username === "non-user") {
            navigate('/');
        }
    }, [username, navigate]);

    const travelHome = () => {
        navigate('/home', {state: { userData: location.state.userData }});
    }

    const createQuestion = () => {
        setIsLoading(true);

        axios.post('https://would-you-rather-ku9r.onrender.com/question/newQuestion', {
            description,
            option1,
            option2,
            anonymous,
            username,
            user_id: user_ID
        })
        .then(() => {
            setIsLoading(false);
            travelHome();
        })
        .catch((error) => {
            console.log(error.message);
            setIsLoading(false);
            setCerror('fill all 3 fields');
        });
    }

    return(
        <>
        <BrowserView>
        <div id='maindiv'>
            <div>
                <button className={`tab-button`} onClick={travelHome} >Home</button>
            </div>
            <div>
                <h1 id='cnq'>Create a new question</h1>
                <div>
                    <label id='label'>Question description:</label>
                    <input id='inputdecription' type='text' value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div>
                    <label id='label'>Option 1:</label>
                    <input id='input' type='text' value={option1} onChange={(e) => setOption1(e.target.value)} />
                </div>
                <div>
                    <label id='label'>Option 2:</label>
                    <input id='input' type='text' value={option2} onChange={(e) => setOption2(e.target.value)} />
                </div>
                <div>
                    <label id='label'>Anonymous:</label>
                    <input type='checkbox' value={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
                </div>
                <button id='createQuestionButton' onClick={createQuestion}>{isLoading ? 'Loading...' : 'Create Question'}</button>
            </div>
            <p id='error'>{cerror}</p>
        </div>
        </BrowserView>
        <MobileView>
        <div id='maindiv'>
            <div>
                <button className={`tab-button`} onClick={() => travelHome()} >Home</button>
            </div>
            <div>
                <h1 id='cnq'>Create a new question</h1>
                <div>
                    <label id='label'>Question description:</label>
                    <input id='mobileinputdecription' type='text' value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div>
                    <label id='label'>Option 1:</label>
                    <input id='input' type='text' value={option1} onChange={(e) => setOption1(e.target.value)} />
                </div>
                <div>
                    <label id='label'>Option 2:</label>
                    <input id='input' type='text' value={option2} onChange={(e) => setOption2(e.target.value)} />
                </div>
                <div>
                    <label id='label'>Anonymous:</label>
                    <input type='checkbox' value={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
                </div>
                <button id='createQuestionButton' onClick={createQuestion}>{isLoading ? 'Loading...' : 'Create Question'}</button>
            </div>
            <p id='error'>{cerror}</p>
        </div>
        </MobileView>
        </>
    )
}

export default CreateQuestion;