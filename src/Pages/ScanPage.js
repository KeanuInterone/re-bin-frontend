import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import ReBinLogo from '../Components/ReBinLogo';
import CameraFeed from '../Components/CameraFeed';
import CenterIndicator from "../Components/CenterIndicator";
import ImagePredictionSlideUp from "../Components/ImagePredictionSlideUp";
import RewardAnimation from "../Components/RewardAnimation";
import IconButton from "../Components/IconButton";
import { useAuth } from "../Services/AuthContext";
import { useUser } from "../Services/UserContext";

const ScanPage = () => {

    const [capturedImage, setCapturedImage] = useState(null);
    const [showReward, setShowReward] = useState(false);
    const navigate = useNavigate();
    const { signOut, accessToken } = useAuth();
    const { user, scannedItem } = useUser();

    const handleCapture = (imageDataUrl) => {
        setCapturedImage(imageDataUrl);
    };

    const handleClose = () => {
        setCapturedImage(null);
    };

    const handleReward = () => {
        setCapturedImage(null);
        setShowReward(true);
        scannedItem();
    };

    const handleAnimationEnd = () => {
        setShowReward(false);
    };

    return (
        <div className="app">
            <div className="scan-logo-container">
                <ReBinLogo />
            </div>
            <IconButton
                iconPath="/icons/user_icon.png"
                className="user-icon"
                onPressed={() => {
                    //signOut();
                    navigate('/profile')
                }}
            />
            <CameraFeed onCapture={handleCapture} />
            <CenterIndicator />
            <ImagePredictionSlideUp imageUrl={capturedImage} onClose={handleClose} onReward={handleReward} />
            {showReward && <RewardAnimation onAnimationEnd={handleAnimationEnd} />}
        </div>
    );
};

export default ScanPage;