import React, { useState } from "react";
import ReBinLogo from '../Components/ReBinLogo';
import CameraFeed from '../Components/CameraFeed';
import CenterIndicator from "../Components/CenterIndicator";
import ImagePredictionSlideUp from "../Components/ImagePredictionSlideUp";
import RewardAnimation from "../Components/RewardAnimation";

const ScanPage = ({ user }) => {

    const [capturedImage, setCapturedImage] = useState(null);
    const [showReward, setShowReward] = useState(false);

    const handleCapture = (imageDataUrl) => {
        setCapturedImage(imageDataUrl);
    };

    const handleClose = () => {
        setCapturedImage(null);
    };

    const handleReward = () => {
        setCapturedImage(null);
        setShowReward(true);
    };

    const handleAnimationEnd = () => {
        setShowReward(false);
    };

    return (
        <div className="app">
            <ReBinLogo />
            <CameraFeed onCapture={handleCapture}/>
            <CenterIndicator />
            <ImagePredictionSlideUp imageUrl={capturedImage} onClose={handleClose} onReward={handleReward}/>
            {showReward && <RewardAnimation onAnimationEnd={handleAnimationEnd} />}
        </div>
    );
};

export default ScanPage;