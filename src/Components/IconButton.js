import React from 'react';

const IconButton = ({ iconPath, className, onPressed }) => {
    return (
        <button className={`icon-button ${className}`} onClick={onPressed}>
            <img src={iconPath} alt="icon" className="icon-button__icon" />
        </button>
    );
};


export default IconButton;
