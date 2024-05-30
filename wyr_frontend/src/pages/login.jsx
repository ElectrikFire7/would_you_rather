import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/login.css';

const Login = () => {
    const navigate = useNavigate();
    const [curUsername, setUsername] = useState('');
    const [curPassword, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isLoading, setIsLoading] = useState(false); 

    const handleSendCreds = () => {
        setIsLoading(true); 

        axios.post('http://localhost:443/user/login', {username: curUsername, password: curPassword})
            .then( response => {
                console.log('Login successful', response.data);

                navigate('/home', {state: { userData: response.data }});
            })
            .catch( error => {
                console.error("error: ", error);
                setLoginError('wrong creds');
            })
            .finally(() => {
                setIsLoading(false); // Set loading state to false after request completes
            });
    }

    const redirectSignUp = () => {
        navigate('signup');
    }

    return(
        <div id="outer_div">
            <div id="inner_div">
            <img src="..\src\assets\wouldyourather.png"></img>
                <h1>Login</h1>
                <input id="textBar" type='text' placeholder='Username' onChange={e => setUsername(e.target.value)} />
                <input id="textBar" type='password' placeholder='Password' onChange={e => setPassword(e.target.value)} />
                {loginError && <p>{loginError}</p>}
                <button id='login_button' onClick={handleSendCreds} disabled={isLoading}>Login</button>
                <button id='login_button' onClick={redirectSignUp}>Sign Up</button>
            </div>
        </div>
    )
}

export default Login;