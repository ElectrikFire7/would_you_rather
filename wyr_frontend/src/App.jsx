import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './pages/login.jsx';
import Signup from './pages/signup.jsx';
import Home from './pages/home.jsx';
import CreateQuestion from './pages/createquestion.jsx';

const App = () => {
  return (
    <Router>
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/signup' element={<Signup />}/>
            <Route path='/home' element={<Home />} />
            <Route path='/createquestion' element={<CreateQuestion />} />
        </Routes>
    </Router>
  )
}

export default App