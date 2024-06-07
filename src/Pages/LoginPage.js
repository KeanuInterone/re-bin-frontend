import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Services/AuthContext';
import CanLoad from '../Components/CanLoad';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setIsLoading(true);
            await signIn(username, password);
            setIsLoading(false);
            navigate('/scan');
        } catch (error) {
            setIsLoading(false);
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
            <CanLoad isLoading={isLoading}>
                <form onSubmit={handleSubmit}>
                    <h2 className='login-title'>Login</h2>
                    {error && <p className="error">{error}</p>}
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder='Email'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="login-button" type="submit">Login</button>
                    <button className="create-account-button" type="button" onClick={handleCreateAccount}>Create Account</button>
                    <button className="continue-button" type="button" onClick={handleContinueWithoutLoggingIn}>Continue without logging in</button>
                </form>
            </CanLoad>
        </div>
    );
};

export default LoginPage;
