import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useImagePrediction } from '../Services/ImagePredictionService';
import { useAuth } from '../Services/AuthContext';
import { useUser } from '../Services/UserContext';

const ImagePredictionSlideUp = ({ imageUrl, onClose, onReward }) => {

    const { setImageToPredict, correctPredictionLabel, sendExampleToServer, isPredicting, prediction } = useImagePrediction();
    const { isAuthenticated, accessToken } = useAuth();
    const { user } = useUser();
    const userCanVerifyPrediction = isAuthenticated && user && user.permissions?.includes('can_verify_prediction');
    const [showPredictionLabel, setShowPredictionLabel] = useState(false);
    const [showCorrectIncorrectButtons, setShowCorrectIncorrectButtons] = useState(userCanVerifyPrediction);
    const [showCheckmark, setShowCheckmark] = useState(false);
    const [showSelectCorrectLabelContainer, setShowSelectCorrectLabelContainer] = useState(false);
    const labels = ['Plastic', 'Paper/Cardboard', 'Metal', 'Glass', 'Organic', 'Other'];

    useEffect(() => {
        if (!imageUrl) return;
        setImageToPredict(imageUrl);
        setShowPredictionLabel(true);
        setShowCorrectIncorrectButtons(userCanVerifyPrediction);
        setShowCheckmark(false);
        setShowSelectCorrectLabelContainer(false);
    }, [imageUrl]);

    const verifyPrediction = (isCorrect) => {
        if (isCorrect) {
            setShowCorrectIncorrectButtons(false);
            setShowCheckmark(true);
            sendExampleToServer(accessToken, prediction.label);
        } else {
            setShowPredictionLabel(false);
            setShowCorrectIncorrectButtons(false);
            setShowSelectCorrectLabelContainer(true);
        }
    }

    const labelImage = (label) => {
        correctPredictionLabel(label);
        setShowPredictionLabel(true);
        setShowSelectCorrectLabelContainer(false);
        setShowCheckmark(true);
        sendExampleToServer(accessToken, label);
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
                                    (showPredictionLabel) && (
                                        <h2 className='prediction-label'>{prediction.label}</h2>
                                    )
                                }

                                {
                                    (showCorrectIncorrectButtons) && (
                                        <div className="prediction-verify">
                                            <button className="prediction-verify-button correct" onClick={() => { verifyPrediction(true) }}>Correct</button>
                                            <button className="prediction-verify-button incorrect" onClick={() => { verifyPrediction(false) }}>Incorrect</button>
                                        </div>
                                    )
                                }
                                {
                                    (showCheckmark) && (
                                        <img className="correct-checkmark" src={"/icons/correct.png"} alt="icon" />
                                    )
                                }
                                {
                                    (showSelectCorrectLabelContainer) && (
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