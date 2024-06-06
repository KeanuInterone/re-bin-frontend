import React from 'react';

const ScanButton = ({ onPressed }) => {
    return (
        <div className="scan-button" onClick={onPressed}>
            <div className="scan-button-icon">♻️</div>
        </div>
    );
};

export default ScanButton;
