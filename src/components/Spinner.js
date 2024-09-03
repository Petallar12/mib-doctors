// Spinner.js
import React from 'react';
import './Spinner.css'; // Make sure to create a CSS file for the spinner styles

const Spinner = () => {
    return (
        <div className="spinner">
            <div className="double-bounce1"></div>
            <div className="double-bounce2"></div>
        </div>
    );
};

export default Spinner;
