import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/login.css';
import wouldYouRatherImage from '../assets/wouldyourather.png';

const signup = () => {
    const navigate = useNavigate();
    const [curUsername, setUsername] = useState('');
    const [curPassword, setPassword] = useState('');
    const [signupError, setSignupError] = useState('');
    const [isLoading, setIsLoading] = useState(false); 

    const handleSendCreds = () => {
        setIsLoading(true); 

        axios.post('https://would-you-rather-ku9r.onrender.com/user/signin', {username: curUsername, password: curPassword})
            .then( response => {
                console.log('Signup successful', response.data);

                navigate('/home', {state: { userData: response.data }});
            })
            .catch( error => {
                console.error("error: ", error);
                setSignupError('wrong creds');
            })
            .finally(() => {
                setIsLoading(false); // Set loading state to false after request completes
            });
    }

    const redirectSignUp = () => {
        navigate('/');
    }

    return(
        <div id="outer_div">
            <div id="inner_div">
            <img src={wouldYouRatherImage} alt='Would You Rather'/>
                <h1>Login</h1>
                <input id="textBar" type='text' placeholder='Username' onChange={e => setUsername(e.target.value)} />
                <input id="textBar" type='password' placeholder='Password' onChange={e => setPassword(e.target.value)} />
                {signupError && <p id='error'>{loginError}</p>}
                <button id='login_button' onClick={handleSendCreds} disabled={isLoading}>{isLoading ? 'Loading...' : 'Sign Up'}</button>
                <button id='login_button' onClick={redirectSignUp}>Login Page</button>
            </div>
        </div>
    )
}

export default signup;