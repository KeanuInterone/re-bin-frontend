import { useState, useEffect, useCallback } from 'react';

const recyclables = ['Plastic', 'Paper/Cardboard', 'Metal', 'Glass'];
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
                    recyclable: recyclables.includes(data['prediction'])
                });
                setIsPredicting(false);
            });

    }, [imageToPredict]);

    const correctPredictionLabel = useCallback(async (label) => {
        setPrediction({
            label: label,
            recyclable: recyclables.includes(label)
        });
    }, [setPrediction]);

    const sendExampleToServer = useCallback(async (accessToken, label) => {
        if (!imageToPredict) return;

        fetch('https://hj87134x4d.execute-api.ap-southeast-4.amazonaws.com/v1/labeled-image', {
            method: 'POST',
            body: JSON.stringify({ access_token: accessToken, label: label, image: imageToPredict }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(data => {
                // Nothing to do here
            });
    }, [imageToPredict, prediction]);

    return {
        setImageToPredict,
        correctPredictionLabel,
        sendExampleToServer,
        isPredicting,
        prediction
    };
};