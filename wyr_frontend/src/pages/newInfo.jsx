import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faClock, faCheck, faUser } from '@fortawesome/free-solid-svg-icons';
import '../assets/home.css';

const NewInfo = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const agree = () => {
        navigate('/home', {state: { userData: location.state.userData }});
    }

    return(
        <div id="maindiv">
            <h1 id='question'>Hello There</h1>
            <h2 className='tab-button'><FontAwesomeIcon icon={faGlobe} /> Random Questions</h2>
            <p2 id='label'>Random cards to vote</p2>
            <h3 className='tab-button'><FontAwesomeIcon icon={faClock} /> Latest Questions</h3>
            <p3 id='label'>Latest uploaded cards to vote</p3>
            <h4 className='tab-button'><FontAwesomeIcon icon={faCheck} /> Your Voted Questions</h4>
            <p4 id='label'>Cards where you have voted</p4>
            <h5 className='tab-button'><FontAwesomeIcon icon={faUser}/> My Cards</h5>
            <p5 id='label'>Your created Cards</p5>
            <h6 className='tab-button'>Create Card</h6>
            <p6 id='label'>Create your own card and see other's response</p6>
            <button onClick={agree} id='createQuestionButton'>Agree</button>
        </div>
    )
}

export default NewInfo;