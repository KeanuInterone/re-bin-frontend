import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScanPage from './Pages/ScanPage';
import './App.css';

const App = () => {

    return (
        <div className='app'>
            <Router>
                <div>
                    <Routes>
                        <Route exact path="/" element={<ScanPage />} />
                    </Routes>
                </div>
            </Router>
        </div>
    );
};

export default App;
