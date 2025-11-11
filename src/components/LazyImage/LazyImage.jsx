import React, { useState, useRef, useEffect } from 'react';
import { getMobileLazyConfig, shouldOptimizeForMobile } from '../../utils/mobileOptimizations';
import './LazyImage.css';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = null,
  onLoad = () => {},
  onError = () => {},
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(true); // Changed to true by default
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef();
  
  // Get mobile-optimized lazy loading configuration
  const lazyConfig = getMobileLazyConfig();
  const isMobile = shouldOptimizeForMobile();

  // Removed IntersectionObserver - load images immediately
  /*
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0,
        rootMargin: '400px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);
  */

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad && onLoad();
  };

  const handleError = () => {
    setHasError(true);
    onError && onError();
  };

  return (
    <div ref={imgRef} className={`lazy-image-container ${className}`} {...props}>
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          className={`lazy-image ${isLoaded ? 'loaded' : 'loading'}`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding={isMobile ? "sync" : "async"}
          fetchpriority={isMobile ? "low" : "auto"}
        />
      )}
      
      {(!isInView || !isLoaded) && !hasError && (
        <div className="lazy-image-placeholder">
          {placeholder || (
            <div className="lazy-image-skeleton">
              <div className="lazy-image-skeleton-text"></div>
            </div>
          )}
        </div>
      )}
      
      {hasError && (
        <div className="lazy-image-error">
          <div className="lazy-image-error-text">
            <span>Image not available</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
