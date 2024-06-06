import { useState, useEffect } from 'react';

export const useImagePrediction = () => {
    const [imageToPredict, setImageToPredict] = useState(null);
    const [isPredicting, setIsPredicting] = useState(false);
    const [prediction, setPrediction] = useState(null);

    useEffect(() => {
        setPrediction(null);
        if (!imageToPredict) return;

        setIsPredicting(true);

        fetch('https://7s6cwkyq9b.execute-api.ap-southeast-4.amazonaws.com/v1/classify', {
            method: 'POST',
            body: JSON.stringify({ image: imageToPredict }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
        .then(data => {
            setPrediction({
                label: data['prediction'],
                confidence: 0.69,
                recyclable: true
            });
            setIsPredicting(false);
        });

    }, [imageToPredict]);

    return {
        setImageToPredict,
        isPredicting,
        prediction
    };
};