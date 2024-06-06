import React, {useState, useEffect} from 'react'
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/home.css' 
import {BrowserView, MobileView} from 'react-device-detect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';



const SearchByName = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const username = location.state?.userData?.username ?? "non-user";
    const user_ID = location.state?.userData?.userId ?? "non-user";

    const [questions, setQuestions] = useState([]);
    const [showVotes, setShowVotes] = useState(null);
    const [ownerColors, setOwnerColors] = useState({});
    const [name, setName] = useState('');

    useEffect(() => {
        if (username === "non-user") {
            navigate('/');
        }
    }, [username, navigate]);

    const getUserQuestions = () => {
        axios.get('https://would-you-rather-ku9r.onrender.com/searchByName/', {
            params: {
                username: name
            }
        })
            .then(response => {
                console.log(response.data);
                setQuestions(response.data);
                setOwnerColors(response.data.reduce((acc, question) => {
                    acc[question._id] = getRandomColor();
                    return acc;
                }, {}));
            })
            .catch(error => {
                console.error("error: ", error);
            });
    }

    const vote = (question_id, option) => {
        axios.put('https://would-you-rather-ku9r.onrender.com/vote/', {
            question_id: question_id,
            user_id: user_ID,
            username: username,
            option: option,
        })
        .then(response => {
            console.log('Vote updated');

            setQuestions(prevQuestions => prevQuestions.map(question => {
                if (question._id === question_id) {
                    if (option === 1) {
                        if (question.voted2.includes(username)) {
                            question.voted2 = question.voted2.filter(user => user !== username);
                        }
                        if (!question.voted1.includes(username)) {
                            question.voted1.push(username);
                        }
                    } else if (option === 2) {
                        if (question.voted1.includes(username)) {
                            question.voted1 = question.voted1.filter(user => user !== username);
                        }
                        if (!question.voted2.includes(username)) {
                            question.voted2.push(username);
                        }
                    }
                }
                return question;
            }));
        })
        .catch(error => {
            console.error("error: ", error);
        });
    }

    const deletevote = (question_id) => {
        axios.delete('https://would-you-rather-ku9r.onrender.com/vote/',{
            data: {
                question_id: question_id,
                user_id: user_ID,
                username: username
            }
            })
            .then(response => {
                console.log('Vote updated');
                setQuestions(prevQuestions => prevQuestions.map(question => {
                    if (question._id === question_id) {
                        question.voted1 = question.voted1.filter(user => user !== username);
                        question.voted2 = question.voted2.filter(user => user !== username);
                    }
                    return question;
                }));
            })
            .catch(error => {
                console.error("error: ", error);
            });
    }

    const deleteQuestion = (question_id, user_id) => {
        axios.delete('https://would-you-rather-ku9r.onrender.com/createQuestion/',{
            data: {
                question_id: question_id,
                user_id: user_id
            }
        })
            .then(response => {
                console.log('Question deleted');
                setQuestions(prevQuestions => prevQuestions.filter(question => question._id !== question_id));
            })
            .catch(error => {
                console.error("error: ", error);
            })
    }

    const toggleShowVotes = (question_id) => {
        if(showVotes === null){
            setShowVotes(question_id);
        }
        else if(showVotes === question_id){
            setShowVotes(null);
        }
        else{
            setShowVotes(question_id);
        }
    }

    const colors = ['#FF0000', '#00FF00', '#FFFF00', '#800080', '#FFA500'];

    const getRandomColor = () => {
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };

    const travelCreateQuestion = () => {
        navigate('/createQuestion', {state: { userData: location.state.userData }});
    }

    const travelHome = () => {
        navigate('/home', {state: { userData: location.state.userData }});
    }

    return(
        <><BrowserView>
        <div id='maindiv'>
            <div id='tabs'>
                <button className={`tab-button`} onClick={travelHome} >Home</button>
                <button className={`tab-button`} onClick={travelCreateQuestion}>Create Card</button>
            </div>
            <div id='questioncontainer'>
            <input id='input' type='text' value={name} onChange={(e) => setName(e.target.value)} />
            <button id='searchbutton' onClick={getUserQuestions}><FontAwesomeIcon icon={faSearch} /></button>
            <p id='question'>{questions.length === 0 ? 'No questions by this user' : ''}</p>
            <ul>
                {questions.map(question => (
                    <li id='listitem' key={question._id} className='question-wrapper'>
                        <p id='owner' style={{ color: ownerColors[question._id] }}>{question.anonymous ? "Anonymous-Hippopotamus" : question.ownerUsername}</p>
                        <p id='question'>{question.description}</p>
                        <div id='buttoncontainer'>
                            <button id='button' onClick={() => vote(question._id, 1)} style={{
                                backgroundImage: question.image1 ? `url(data:image/png;base64,${question.image1})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                width: question.image1 ? '250px' : '600px',
                                height: question.image1 ? '250px' : 'auto',
                                color: question.image1 ? 'transparent' : 'white',
                                backgroundColor: question.image1 ? 'transparent' : 'black',
                                border: question.voted1.includes(username) ? '3px solid green': '3px solid rgb(255, 255, 255)',
                                borderRadius: '15px',
                                margin: '10px',
                                padding: '5px',
                                textAlign: 'center',
                                fontFamily: '"copperplate", "copperplate gothic light", fantasy'
                            }}>
                                {question.option1}</button>
                            <button id='button' onClick={() => vote(question._id, 2)} style={{
                                backgroundImage: question.image2 ? `url(data:image/png;base64,${question.image2})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                width: question.image2 ? '250px' : '600px',
                                height: question.image2 ? '250px' : 'auto',
                                color: question.image2 ? 'transparent' : 'white',
                                backgroundColor: question.image2 ? 'transparent' : 'black',
                                border: question.voted2.includes(username) ? '3px solid green': '3px solid rgb(255, 255, 255)',
                                borderRadius: '15px',
                                margin: '10px',
                                padding: '10px',
                                textAlign: 'center',
                                fontFamily: '"copperplate", "copperplate gothic light", fantasy'
                            }}>
                                {question.option2}</button>
                        </div>
                        <button id='deletevote' onClick={() => deletevote(question._id)}>Delete Vote</button>
                        {user_ID === question.owner.toString() && (
                            <button id='deletevote' onClick={() => deleteQuestion(question._id, user_ID)}>Delete Question</button>)
                        }
                        <button id='showvotes' onClick={() => toggleShowVotes(question._id)}>Votes</button>
                        {showVotes === question._id && (
                            <div id='votes'>
                                <div id='votes_list'>
                                <p id='votes1_header'>{question.option1}: {question.voted1.length}</p>
                                <ul>
                                    {question.voted1.map((voter, index) => (
                                        <li key={index}>{voter}</li>
                                    ))}
                                </ul>
                                </div>
                                <div id='votes_list'>
                                <p id='votes2_header'>{question.option2}: {question.voted2.length}</p>
                                <ul>
                                    {question.voted2.map((voter, index) => (
                                        <li key={index}>{voter}</li>
                                    ))}
                                </ul>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            </div>
        </div>
        </BrowserView>
        <MobileView>
        <div id='maindiv'>
            <div id='tabs'>
                <button className={`tab-button`} onClick={travelHome} >Home</button>
                <button className={`tab-button`} onClick={travelCreateQuestion}>CQ</button>
            </div>
            <div id='questioncontainer'>
            <input id='input' type='text' value={name} onChange={(e) => setName(e.target.value)} />
            <button id='searchbutton' onClick={getUserQuestions}><FontAwesomeIcon icon={faSearch} /></button>
            <p id='question'>{questions.length === 0 ? 'No questions by this user' : ''}</p>
            <ul>
                {questions.map(question => (
                    <li id='listitem' key={question._id} className='question-wrapper'>
                        <p id='owner' style={{ color: getRandomColor() }}>{question.anonymous ? "Anonymous-Hippopotamus" : question.ownerUsername}</p>
                        <p id='question'>{question.description}</p>
                        <div id='buttoncontainer'>
                            <button id='button' onClick={() => vote(question._id, 1)} style={{
                                backgroundImage: question.image1 ? `url(data:image/png;base64,${question.image1})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                width: question.image1 ? '125px' : '600px',
                                height: question.image1 ? '125px' : 'auto',
                                color: question.image1 ? 'transparent' : 'white',
                                backgroundColor: question.image1 ? 'transparent' : 'black',
                                border: question.voted1.includes(username) ? '3px solid green': '3px solid rgb(255, 255, 255)',
                                borderRadius: '15px',
                                margin: '10px',
                                padding: '10px',
                                textAlign: 'center',
                                fontFamily: '"copperplate", "copperplate gothic light", fantasy'
                            }}>
                                {question.option1}</button>
                            <button id='button' onClick={() => vote(question._id, 2)} style={{
                                backgroundImage: question.image2 ? `url(data:image/png;base64,${question.image2})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                width: question.image2 ? '125px' : '600px',
                                height: question.image2 ? '125px' : 'auto',
                                color: question.image2 ? 'transparent' : 'white',
                                backgroundColor: question.image2 ? 'transparent' : 'black',
                                border: question.voted2.includes(username) ? '3px solid green': '3px solid rgb(255, 255, 255)',
                                borderRadius: '15px',
                                margin: '10px',
                                padding: '10px',
                                textAlign: 'center',
                                fontFamily: '"copperplate", "copperplate gothic light", fantasy'
                            }}>
                                {question.option2}</button>
                        </div>
                        <button id='deletevote' onClick={() => deletevote(question._id)}>Delete Vote</button>
                        {user_ID === question.owner.toString() && (
                            <button id='deletevote' onClick={() => deleteQuestion(question._id, user_ID)}>Delete Question</button>)
                        }
                        <button id='showvotes' onClick={() => toggleShowVotes(question._id)}>Votes</button>
                        {showVotes === question._id && (
                            <div id='votes'>
                                <div id='votes_list'>
                                <p id='votes1_header'>{question.option1}: {question.voted1.length}</p>
                                <ul>
                                    {question.voted1.map((voter, index) => (
                                        <li key={index}>{voter}</li>
                                    ))}
                                </ul>
                                </div>
                                <div id='votes_list'>
                                <p id='votes2_header'>{question.option2}: {question.voted2.length}</p>
                                <ul>
                                    {question.voted2.map((voter, index) => (
                                        <li key={index}>{voter}</li>
                                    ))}
                                </ul>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            </div>
        </div>
        </MobileView>
        </>
    )
}

export default SearchByName;