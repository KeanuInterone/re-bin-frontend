import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignUpPage';
import ConfirmSignUpPage from './Pages/ConfirmSignUpPage';
import ScanPage from './Pages/ScanPage';
import ProfilePage from './Pages/ProfilePage';
import { useAuth } from './Services/AuthContext';
import { useUser } from './Services/UserContext';
import './App.css';

const App = () => {
    const { isAuthenticated } = useAuth();
    const { user, fetchUser } = useUser();

    useEffect(() => {
        const fetchUserData = async () => {
            if (isAuthenticated && !user) {
                await fetchUser();
            }
        };

        fetchUserData();
    }, [isAuthenticated, user, fetchUser]);

    return (
        <div className='app'>
            <Router>
                <div>
                    <Routes>
                        <Route
                            path="/"
                            element={isAuthenticated ? <Navigate to="/scan" /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/login"
                            element={isAuthenticated ? <Navigate to="/scan" /> : <LoginPage />}
                        />
                        <Route
                            path="/signup"
                            element={isAuthenticated ? <Navigate to="/scan" /> : <SignUpPage />}
                        />
                        <Route
                            path="/confirm-sign-up"
                            element={isAuthenticated ? <Navigate to="/scan" /> : <ConfirmSignUpPage />}
                        />
                        <Route
                            path="/scan"
                            element={<ScanPage />}
                        />
                        <Route
                            path="/profile"
                            element={<ProfilePage />}
                        />
                    </Routes>
                </div>
            </Router>
        </div>
    );
};

export default App;
