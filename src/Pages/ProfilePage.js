// src/components/Profile.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Services/AuthContext';

const ProfilePage = () => {
    const { isAuthenticated, user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = () => {
        signOut();
        navigate('/login');
    };

    if (!isAuthenticated) {
        return (
            <div className="profile-container">
                <p>You are not logged in.</p>
                <button onClick={() => navigate('/login')}>Log in</button>
            </div>
        );
    }

    const getInitials = (user) => {
        const firstName = user.firstName;
        const lastName = user.lastName;
        return firstName.charAt(0) + lastName.charAt(0);
    };

    return (
        <div className="profile-container">
            <div className="profile-avatar">
                {getInitials(user)}
            </div>
            <h2>{user.firstName} {user.lastName}</h2>
            <button onClick={handleSignOut}>Log out</button>
        </div>
    );
};

export default ProfilePage;
