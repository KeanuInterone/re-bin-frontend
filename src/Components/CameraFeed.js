import React, { useEffect, useRef, useState } from 'react';
import ScanButton from './ScanButton';

const CameraFeed = ({ onCapture }) => {
    const videoRef = useRef(null);
    const [error, setError] = useState(null);
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState('');

    useEffect(() => {
        const getDevices = async () => {
            try {
                // Request camera permissions
                await navigator.mediaDevices.getUserMedia({ video: true });

                // Enumerate devices
                const deviceInfos = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = deviceInfos.filter(device => device.kind === 'videoinput');

                setDevices(videoDevices);

                if (videoDevices.length > 0) {
                    // Find the back camera
                    const backCamera = videoDevices.find(device => device.label.toLowerCase().includes('back'));
                    if (backCamera && backCamera.deviceId) {
                        setSelectedDeviceId(backCamera.deviceId);
                    } else if (videoDevices[0].deviceId) {
                        setSelectedDeviceId(videoDevices[0].deviceId);
                    } else {
                        console.error('No valid deviceId found for video devices.');
                    }
                } else {
                    console.error('No video devices found.');
                }
            } catch (error) {
                console.error('Error accessing media devices:', error);
            }
        };

        getDevices();
    }, []);

    useEffect(() => {
        const getVideo = async () => {
            if (!selectedDeviceId) return;

            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { deviceId: { exact: selectedDeviceId } }
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing the camera: ", err);
                setError("Error accessing the camera. Please ensure permissions are granted and try again.");
            }
        };

        getVideo();
    }, [selectedDeviceId]);

    const capturePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const imageDataUrl = canvas.toDataURL('image/jpeg');
            onCapture(imageDataUrl)
        }
    };

    return (
        <div className="camera-feed">
            {error && <p className="error-message">{error}</p>}
            <video ref={videoRef} autoPlay playsInline />
            {/* {devices.length > 1 && (
                <select
                    onChange={(e) => setSelectedDeviceId(e.target.value)}
                    value={selectedDeviceId}
                    className="camera-select"
                >
                    {devices.map(device => (
                        <option key={device.deviceId} value={device.deviceId}>
                            {device.label || `Camera ${device.deviceId}`}
                        </option>
                    ))}
                </select>
            )} */}
            <ScanButton onPressed={capturePhoto} />
        </div>
    );
};


export default CameraFeed;
