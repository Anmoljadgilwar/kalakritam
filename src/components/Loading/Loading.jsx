import React, { useState, useEffect } from 'react';
import './Loading.css';

const Loading = () => {
  const loadingMessages = [
    "Loading Kalakritam...",
    "Preparing your artistic journey...",
    "Almost ready..."
  ];

  const [currentMessage, setCurrentMessage] = useState(0);
  
  // Detect mobile for simpler loading animation
  const isMobile = typeof window !== 'undefined' && (
    window.innerWidth <= 768 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  );

  useEffect(() => {
    // Skip message rotation on mobile for better performance
    if (isMobile) return;
    
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => {
      clearInterval(messageInterval);
    };
  }, [isMobile]);

  // Simple mobile loading screen - minimal animations for performance
  if (isMobile) {
    return (
      <div className="loading-overlay loading-overlay-mobile">
        <div className="loading-container-mobile">
          <h1 className="loading-title-mobile">Kalakritam</h1>
          <div className="simple-spinner"></div>
          <p className="loading-text-mobile">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-overlay">
      <div className="loading-container">
        <div className="loading-logo">
          <h1 className="loading-title">Kalakritam</h1>
          <p className="loading-subtitle">Manifesting Through Arts</p>
          
          <div className="loader">
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
          </div>
        </div>
        
        <div className="loading-status">
          <p className="loading-text">{loadingMessages[currentMessage]}</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
