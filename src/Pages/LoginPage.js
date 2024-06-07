import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Services/AuthContext';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await signIn(username, password);
            navigate('/scan');;
        } catch (error) {
            setError(error.message);
        }
    };

    const handleCreateAccount = () => {
        navigate('/signup');
    };

    const handleContinueWithoutLoggingIn = () => {
        navigate('/scan');
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                {error && <p className="error">{error}</p>}
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
                <button type="button" onClick={handleCreateAccount}>Create Account</button>
                <button type="button" onClick={handleContinueWithoutLoggingIn}>Continue without logging in</button>
            </form>
        </div>
    );
};

export default LoginPage;
