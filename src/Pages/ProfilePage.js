import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Services/AuthContext';
import { useUser } from '../Services/UserContext';
import IconButton from '../Components/IconButton';
import ReBinLogo from '../Components/ReBinLogo';

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
            <div className="profile-container no-user">
                <IconButton
                    iconPath="/icons/back_arrow.png"
                    className="back-icon"
                    onPressed={() => navigate('/scan')} />
                <div className='profile-logo-container'>
                    <ReBinLogo />
                </div>
                <p className='login-message'>You are not logged in. Log in to earn points.</p>
                <button className="profile-login-button" onClick={() => navigate('/login')}>Log in</button>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <IconButton
                iconPath="/icons/back_arrow.png"
                className="back-icon"
                onPressed={() => navigate('/scan')} />
            <div className="profile-avatar">
                {getInitials(user)}
            </div>
            <h2>{user.first_name} {user.last_name}</h2>
            <p>Points: {user.points}</p>
            <button className="profile-log-out-button" onClick={handleSignOut}>Log out</button>
        </div>
    );
};

export default ProfilePage;
