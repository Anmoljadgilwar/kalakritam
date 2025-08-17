import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../utils/notifications.js';
import { performanceMonitor } from '../../utils/performance';
import './IntroVideo.css';

const IntroVideo = () => {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [showFallback, setShowFallback] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const loadingTimeoutRef = useRef(null);

  // Memoized navigation function
  const navigateToHome = useCallback(() => {
    try {
      performanceMonitor.mark('intro-video-complete');
      sessionStorage.setItem('videoCompleted', 'true');
      navigate('/home');
    } catch (error) {
      console.warn('Navigation error:', error);
      // Fallback navigation
      window.location.href = '/home';
    }
  }, [navigate]);

  useEffect(() => {
    performanceMonitor.mark('intro-video-start');
    
    const video = videoRef.current;
    
    const handleVideoEnd = () => {
      // Start transition animation
      setIsTransitioning(true);
      
      // Show welcome toast
      toast.success('Welcome to Kalakritam!', {
        description: 'Discover the art of creation',
        duration: 3000
      });
      
      // Redirect to home page after transition
      setTimeout(navigateToHome, 1500); // Reduced from 2000ms
    };

    const handleTimeUpdate = () => {
      // Start transition at exactly 5 seconds
      if (video.currentTime >= 4.8) { // Start slightly before 5s for smooth transition
        setIsTransitioning(true);
        setTimeout(navigateToHome, 1500);
      }
    };

    const handleVideoError = (error) => {
      console.warn('Video loading error:', error);
      setShowFallback(true);
      // Auto-redirect after 2 seconds if no video (reduced from 3s)
      setTimeout(navigateToHome, 2000);
    };

    const handleVideoLoad = () => {
      setVideoLoaded(true);
      performanceMonitor.measure('intro-video-load', 'intro-video-start');
      console.log('Video loaded successfully');
    };

    const handleCanPlay = () => {
      console.log('Video can start playing');
      setVideoLoaded(true);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };

    if (video) {
      video.addEventListener('ended', handleVideoEnd);
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('error', handleVideoError);
      video.addEventListener('loadeddata', handleVideoLoad);
      video.addEventListener('canplay', handleCanPlay);
      
      // Set a timeout for video loading (reduced from 5s to 3s)
      loadingTimeoutRef.current = setTimeout(() => {
        if (!videoLoaded) {
          console.warn('Video loading timeout - showing fallback');
          setShowFallback(true);
          setTimeout(navigateToHome, 2000);
        }
      }, 3000);
      
      // Auto-play the video with better error handling
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn('Video autoplay failed:', error);
          setShowFallback(true);
          setTimeout(navigateToHome, 2000);
        });
      }

      // Cleanup
      return () => {
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        if (video) {
          video.removeEventListener('ended', handleVideoEnd);
          video.removeEventListener('timeupdate', handleTimeUpdate);
          video.removeEventListener('error', handleVideoError);
          video.removeEventListener('loadeddata', handleVideoLoad);
          video.removeEventListener('canplay', handleCanPlay);
        }
      };
    } else {
      // If no video element, show fallback and redirect
      setShowFallback(true);
      setTimeout(navigateToHome, 2000);
    }
  }, [navigateToHome, videoLoaded]);

  const handleSkip = () => {
    navigateToHome();
  };

  return (
    <div className={`intro-video-container ${isTransitioning ? 'transitioning' : ''}`}>
      {!showFallback ? (
        <div className={`video-wrapper ${isTransitioning ? 'transition-to-logo' : ''}`}>
          <video
            ref={videoRef}
            className={`intro-video ${isTransitioning ? 'shrinking' : ''}`}
            muted
            playsInline
            preload="auto"
            autoPlay={false}
            crossOrigin="anonymous"
          >
            <source src="/intro-video.mp4" type="video/mp4" />
            <p>Your browser does not support the video tag.</p>
          </video>
        </div>
      ) : null}
      
      <div className={`video-fallback ${showFallback ? 'show' : ''}`}>
        <div className="logo-animation">
          <h1>Kalakritam</h1>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <p>Welcome to the world of art and creativity</p>
      </div>
    </div>
  );
};

export default IntroVideo;
