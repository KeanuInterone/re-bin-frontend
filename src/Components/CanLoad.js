import React from 'react';

const CanLoad = ({ isLoading, children }) => {
  return (
    <div className="can-load-container">
      {children}
      {isLoading && (
        <div className="can-load-overlay">
          <div className="can-load-spinner"></div>
        </div>
      )}
    </div>
  );
};


export default CanLoad;
