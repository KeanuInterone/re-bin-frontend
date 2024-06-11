import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useImagePrediction } from '../Services/ImagePredictionService';
import { useAuth } from '../Services/AuthContext';
import { useUser } from '../Services/UserContext';

const ImagePredictionSlideUp = ({ imageUrl, onClose, onReward }) => {

    const { setImageToPredict, isPredicting, prediction } = useImagePrediction();
    const { isAuthenticated } = useAuth();
    const { user } = useUser();

    useEffect(() => {
        if (!imageUrl) return;
        setImageToPredict(imageUrl);
    }, [imageUrl]);

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
                                <h2>{prediction.label}</h2>
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