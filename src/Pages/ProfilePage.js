// src/components/Profile.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Services/AuthContext';
import { useUser } from '../Services/UserContext';

const ProfilePage = () => {
    const { isAuthenticated, signOut } = useAuth();
    const { user, fetchUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (isAuthenticated && !user) {
                await fetchUser();
            }
        };

        fetchUserData();
    }, [isAuthenticated, user, fetchUser]);

    const handleSignOut = () => {
        signOut();
        navigate('/login');
    };

    const getInitials = (user) => {
        const firstName = user.first_name;
        const lastName = user.last_name;
        return firstName.charAt(0) + lastName.charAt(0);
    };

    if (!isAuthenticated || !user) {
        return (
            <div className="profile-container">
                <p>You are not logged in.</p>
                <button onClick={() => navigate('/login')}>Log in</button>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-avatar">
                {getInitials(user)}
            </div>
            <h2>{user.first_name} {user.last_name}</h2>
            <p>Points: {user.points}</p>
            <button onClick={handleSignOut}>Log out</button>
        </div>
    );
};

export default ProfilePage;
