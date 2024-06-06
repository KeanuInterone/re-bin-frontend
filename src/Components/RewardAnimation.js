import React, { useState, useEffect } from 'react';

const RewardAnimation = ({ onAnimationEnd }) => {
    const [stage, setStage] = useState('pop-up');

    useEffect(() => {
        const timer1 = setTimeout(() => {
            setStage('fade-off');
        }, 1000); // Duration of the pop-up stage

        const timer2 = setTimeout(() => {
            onAnimationEnd();
        }, 2000); // Total duration of the animation (pop-up + fade-off)

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [onAnimationEnd]);

    return <div className={`reward-animation ${stage}`}>+5</div>;
};

export default RewardAnimation;
