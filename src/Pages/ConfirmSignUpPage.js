import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Services/AuthContext';

const ConfirmSignUpPage = () => {
    const [confirmationCode, setConfirmationCode] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';
    const { confirmSignUp } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await confirmSignUp(email, confirmationCode);
            navigate('/login');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="confirm-sign-up-container">
            <form onSubmit={handleSubmit}>
                <h2>Confirm Sign Up</h2>
                {error && <p className="error">{error}</p>}
                <div>
                    <label>Confirmation Code:</label>
                    <input
                        type="text"
                        value={confirmationCode}
                        onChange={(e) => setConfirmationCode(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Confirm</button>
            </form>
        </div>
    );
};

export default ConfirmSignUpPage;
