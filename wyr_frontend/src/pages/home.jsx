import React, {useState, useEffect} from 'react'
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/home.css' 
import {BrowserView, MobileView} from 'react-device-detect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faClock, faCheck, faUser } from '@fortawesome/free-solid-svg-icons';



const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const username = location.state?.userData?.username ?? "non-user";
    const user_ID = location.state?.userData?.userId ?? "non-user";

    const [questions, setQuestions] = useState([]);
    const [showVotes, setShowVotes] = useState(null);
    const [tab, setTab] = useState('random');

    useEffect(() => {
        if (username === "non-user") {
            navigate('/');
        }
    }, [username, navigate]);

    const fetchRandom = () => {
        axios.get('https://would-you-rather-backend.vercel.app/question/randomquestions', {
            params: {
                user_id: user_ID,
            },
        })
            .then( response => {
                console.log('Random questions fetched', response.data);
                setQuestions(response.data);
            })
            .catch( error => {
                console.error("error: ", error);
            });
    }

    const fetchLatest = () => {
        axios.get('https://would-you-rather-backend.vercel.app/question/latestsquestions', {
            params: {
                user_id: user_ID,
            },
        })
            .then( response => {
                console.log('Latest questions fetched', response.data);
                setQuestions(response.data);
            })
            .catch( error => {
                console.error("error: ", error);
            });
    }

    const fetchMyQuestions = () => {
        axios.get('https://would-you-rather-backend.vercel.app/question/myquestions', {
            params: {
                user_id: user_ID,
            },
        })
            .then( response => {
                console.log('My questions fetched', response.data);
                setQuestions(response.data);
            })
            .catch( error => {
                console.error("error: ", error);
            });
    }

    const fetchVotedQuestions = () => {
        axios.get('https://would-you-rather-backend.vercel.app/question/votedquestions', {
            params: {
                user_id: user_ID,
            },
        })
            .then( response => {
                console.log('Voted questions fetched', response.data);
                setQuestions(response.data);
            })
            .catch( error => {
                console.error("error: ", error);
            });
    }

    const vote = (question_id, option) => {
        axios.put('https://would-you-rather-backend.vercel.app/vote/',{
                question_id: question_id,
                user_id: user_ID,
                username: username,
                option: option,
        })
            .then( response => {
                console.log('Vote updated');
                if (tab === 'random') {
                    fetchRandom();
                } 
                else if (tab === 'latest'){
                    fetchLatest();
                }
                else if(tab === 'voted'){
                    fetchVotedQuestions();
                }
                else{
                    fetchMyQuestions();
                }
        })
            .catch( error => {
                console.error("error: ", error);
        });
    }

    const deletevote = (question_id) => {
        axios.delete('https://would-you-rather-backend.vercel.app/vote/',{
            data: {
                question_id: question_id,
                user_id: user_ID,
                username: username
            }
        })
            .then(response => {
                console.log('Vote updated');
                if (tab === 'random') {
                    fetchRandom();
                } 
                else if (tab === 'latest'){
                    fetchLatest();
                }
                else if(tab === 'voted'){
                    fetchVotedQuestions();
                }
                else{
                    fetchMyQuestions();
                }
            })
            .catch(error => {
                console.error("error: ", error);
            });
    }

    useEffect(() => {
        if (tab === 'random') {
            fetchRandom();
        } 
        else if (tab === 'latest'){
            fetchLatest();
        }
        else if(tab === 'voted'){
            fetchVotedQuestions();
        }
        else{
            fetchMyQuestions();
        }
    }, [tab, username, user_ID]);

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

    return(
        <><BrowserView>
        <div id='maindiv'>
            <div id='tabs'>
                <button className={`tab-button ${tab === 'random' ? 'active' : ''}`} onClick={() => setTab('random')} disabled={tab === 'random'}><FontAwesomeIcon icon={faGlobe} /> Random Questions</button>
                <button className={`tab-button ${tab === 'latest' ? 'active' : ''}`} onClick={() => setTab('latest')} disabled={tab === 'latest'}><FontAwesomeIcon icon={faClock} /> Latest Questions</button>
                <button className={`tab-button ${tab === 'voted' ? 'active' : ''}`} onClick={() => setTab('voted')} disabled={tab === 'voted'}><FontAwesomeIcon icon={faCheck} /> Voted Questions</button>
                <button className={`tab-button ${tab === 'myquestions' ? 'active' : ''}`} onClick={() => setTab('myquestions')} disabled={tab === 'myquestions'}><FontAwesomeIcon icon={faUser} /> My Questions</button>
                <button className={`tab-button`} onClick={travelCreateQuestion}>Create Question</button>
            </div>
            <div id='questioncontainer'>
            <p id='question'>{questions.length === 0 ? 'No questions in this category for you' : ''}</p>
            <ul>
                {questions.map(question => (
                    <li id='listitem' key={question._id} className='question-wrapper'>
                        <p id='owner' style={{ color: getRandomColor() }}>{question.anonymous ? "Anonymous-Hippopotamus" : question.ownerUsername}</p>
                        <p id='question'>{question.description}</p>
                        <div id='buttoncontainer'>
                            <button id='button' onClick={() => vote(question._id, 1)}>{question.option1}</button>
                            <button id='button' onClick={() => vote(question._id, 2)}>{question.option2}</button>
                        </div>
                        <button id='deletevote' onClick={() => deletevote(question._id)}>Delete Vote</button>
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
                <button className={`tab-button ${tab === 'random' ? 'active' : ''}`} onClick={() => setTab('random')} disabled={tab === 'random'} ><FontAwesomeIcon icon={faGlobe} /></button>
                <button className={`tab-button ${tab === 'latest' ? 'active' : ''}`} onClick={() => setTab('latest')} disabled={tab === 'latest'}><FontAwesomeIcon icon={faClock} /></button>
                <button className={`tab-button ${tab === 'voted' ? 'active' : ''}`} onClick={() => setTab('voted')} disabled={tab === 'voted'}><FontAwesomeIcon icon={faCheck} /></button>
                <button className={`tab-button ${tab === 'myquestions' ? 'active' : ''}`} onClick={() => setTab('myquestions')} disabled={tab === 'myquestions'}><FontAwesomeIcon icon={faUser} /></button>
                <button className={`tab-button`} onClick={travelCreateQuestion}>CQ</button>
            </div>
            <div id='questioncontainer'>
            <p id='question'>{questions.length === 0 ? 'No questions in this category for you' : ''}</p>
            <ul>
                {questions.map(question => (
                    <li id='listitem' key={question._id} className='question-wrapper'>
                        <p id='owner' style={{ color: getRandomColor() }}>{question.anonymous ? "Anonymous-Hippopotamus" : question.ownerUsername}</p>
                        <p id='question'>{question.description}</p>
                        <div id='buttoncontainer'>
                            <button id='button' onClick={() => vote(question._id, 1)}>{question.option1}</button>
                            <button id='button' onClick={() => vote(question._id, 2)}>{question.option2}</button>
                        </div>
                        <button id='deletevote' onClick={() => deletevote(question._id)}>Delete Vote</button>
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

export default Home;