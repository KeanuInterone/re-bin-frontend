import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useImagePrediction } from '../Services/ImagePredictionService';
import { useAuth } from '../Services/AuthContext';
import { useUser } from '../Services/UserContext';

const ImagePredictionSlideUp = ({ imageUrl, onClose, onReward }) => {

    const { setImageToPredict, isPredicting, prediction } = useImagePrediction();
    const { isAuthenticated } = useAuth();
    const { user } = useUser();
    const [hasVerifiedPrediction, setHasVerifiedPrediction] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const labels = ['Plastic', 'Paper/Cardboard', 'Metal', 'Glass', 'Organic', 'Other'];

    useEffect(() => {
        if (!imageUrl) return;
        setImageToPredict(imageUrl);
        setHasVerifiedPrediction(false);
    }, [imageUrl]);

    const verifyPrediction = (isCorrect) => {
        if (isCorrect) {
            // Add points to user
            setIsCorrect(true);
            setHasVerifiedPrediction(true);
        } else {
            // Deduct points from user
            setIsCorrect(false);
            setHasVerifiedPrediction(true);
        }
    }

    const labelImage = (label) => {
        console.log(label);
        setIsCorrect(true);
    }

    return (
        <div className={`prediction-container ${imageUrl ? 'slide-up' : ''}`}>
            {imageUrl && (
                <>
                    <img src={imageUrl} alt="Captured" className="preview-image" />
                    {isPredicting && <div className="loading">♻️</div>}
                    <div className="close-button" onClick={onClose}>&times;</div>
                    {prediction && (
                        <div className='prediction-label-container'>
                            <div className="prediction">
                                {
                                    (!hasVerifiedPrediction || isCorrect) && (
                                        <h2 className='prediction-label'>{prediction.label}</h2>
                                    )
                                }

                                {
                                    (isAuthenticated && user && user.permissions.includes('can_verify_prediction') && !hasVerifiedPrediction) && (
                                        <div className="prediction-verify">
                                            <button className="prediction-verify-button correct" onClick={() => { verifyPrediction(true) }}>Correct</button>
                                            <button className="prediction-verify-button incorrect" onClick={() => { verifyPrediction(false) }}>Incorrect</button>
                                        </div>
                                    )
                                }
                                {
                                    (isAuthenticated && user && user.permissions.includes('can_verify_prediction') && hasVerifiedPrediction && isCorrect) && (
                                        <img className="correct-checkmark" src={"/icons/correct.png"} alt="icon" />
                                    )
                                }
                                {
                                    (isAuthenticated && user && user.permissions.includes('can_verify_prediction') && hasVerifiedPrediction && !isCorrect) && (
                                        <div className='correction-labels-container'>
                                            <p>Select the correct label</p>
                                            <div className='correction-labels'>
                                                {labels.map((label, index) => (
                                                    <button key={index} className="correction-label-button" onClick={() => {labelImage(label)}}>{label}</button>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                }
                            </div>

                            {isAuthenticated && (
                                <div className='user-recycle-buttons'>
                                    {prediction.recyclable ? (
                                        <button className="action-button recycle-button" onClick={onReward}>Recycle</button>
                                    ) : (
                                        <button className="action-button not-recyclable-button" onClick={onClose}>Not Recyclable</button>
                                    )}
                                </div>
                            )}
                            {!isAuthenticated && (
                                <div className='non-user-recycle-buttons'>
                                    <Link className='login-link' to="/login">Login to earn points</Link>
                                    {prediction.recyclable ? (
                                        <button className="action-button recycle-button" onClick={onClose}>Recycle</button>
                                    ) : (
                                        <button className="action-button not-recyclable-button" onClick={onClose}>Not Recyclable</button>
                                    )}
                                </div>
                            )}

                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ImagePredictionSlideUp;