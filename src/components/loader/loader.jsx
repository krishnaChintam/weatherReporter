import React from 'react';
import './loader.css';

const Loader = ({ loading }) => {
  if (!loading) {
    return null; // Return null if loading is false to hide the spinner
  }

  return (
    <div className="loader-container">
      <div className="loader"></div>
    </div>
  );
}

export default Loader;
