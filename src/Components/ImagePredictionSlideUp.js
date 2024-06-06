import React, { useState, useEffect } from 'react';
import { useImagePrediction } from '../Services/ImagePredictionService';

const ImagePredictionSlideUp = ({ imageUrl, onClose, onReward }) => {

    const { setImageToPredict, isPredicting, prediction } = useImagePrediction();

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
                                <p>{(prediction.confidence * 100).toFixed(0)}%</p>
                            </div>
                            {prediction.recyclable ? (
                                <button className="action-button recycle-button" onClick={onReward}>Recycle +5</button>
                            ) : (
                                <button className="action-button not-recyclable-button" onClick={onClose}>Not Recyclable</button>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ImagePredictionSlideUp;