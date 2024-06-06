import React, {useState, useEffect} from 'react'
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom'; 
import {BrowserView, MobileView} from 'react-device-detect';
import '../assets/leaderboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRankingStar } from '@fortawesome/free-solid-svg-icons';

const Leaderboard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const username = location.state?.userData?.username ?? "non-user";
    const user_ID = location.state?.userData?.userId ?? "non-user";

    const [leaderboard, setLeaderboard] = useState([]);
    const [userRank, setUserRank] = useState(null);
    const [userPoints, setUserPoints] = useState(null);

    useEffect(() => {
        if (username === "non-user") {
            navigate('/');
        }
    }, [username, navigate]);

    const travelHome = () => {
        navigate('/home', {state: { userData: location.state.userData }});
    }

    const fetchusers = () => {
        axios.get('http://localhost:443/leaderBoard/')
        .then((response) => {
            setLeaderboard(response.data);
            const currentUserIndex = response.data.findIndex(user => user._id === user_ID);
            if (currentUserIndex !== -1) {
                setUserRank(currentUserIndex + 1);
                setUserPoints(response.data[currentUserIndex].score);
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        fetchusers();
    }, [user_ID, username, userRank, userPoints]);

    return (
        <>
            <BrowserView>
                <div id='maindiv'>
                    <div id='tabs'>
                        <button className='tab-button' onClick={travelHome}>Home</button>
                    </div>
                    <div id='leaderboard'>
                        <h1>Leaderboard</h1>
                        <div className='scrollable-table'>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Username</th>
                                        <th>Score</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {leaderboard.slice(0, 8).map((user, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{user.username}</td>
                                            <td>{user.score}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className='scrollable-table'>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Username</th>
                                        <th>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        <tr>
                                            <td>{userRank}</td>
                                            <td>{username}</td>
                                            <td>{userPoints}</td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </BrowserView>
            <MobileView>
                <div id='maindiv'>
                    <div id='tabs'>
                        <button className='tab-button' onClick={travelHome}>Home</button>
                    </div>
                    <div id='leaderboard'>
                        <h1>Leaderboard</h1>
                        <div className='scrollable-table'>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Username</th>
                                        <th>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboard.slice(0, 8).map((user, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{user.username}</td>
                                            <td>{user.score}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </MobileView>
        </>
    );
};


export default Leaderboard;