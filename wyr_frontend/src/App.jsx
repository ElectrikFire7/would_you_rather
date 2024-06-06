import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './pages/login.jsx';
import Signup from './pages/signup.jsx';
import Home from './pages/home.jsx';
import CreateQuestion from './pages/createquestion.jsx';
import NewInfo from './pages/newInfo.jsx';
import SearchByName from './pages/searchByName.jsx';
import LeaderBoard from './pages/leaderboard.jsx';

const App = () => {
  return (
    <Router>
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/signup' element={<Signup />}/>
            <Route path='/home' element={<Home />} />
            <Route path='/createquestion' element={<CreateQuestion />} />
            <Route path='/newInfo' element={<NewInfo />} />
            <Route path='/searchByName' element={<SearchByName />} />
            <Route path='/leaderboard' element={<LeaderBoard />} />
        </Routes>
    </Router>
  )
}

export default App