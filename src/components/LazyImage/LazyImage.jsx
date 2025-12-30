import React, { useState, useRef, useEffect, useMemo } from 'react';
import { getMobileLazyConfig, shouldOptimizeForMobile, getNetworkOptimizations } from '../../utils/mobileOptimizations';
import './LazyImage.css';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = null,
  onLoad = () => {},
  onError = () => {},
  priority = false, // For critical above-fold images
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef();
  
  // Get mobile-optimized lazy loading configuration
  const isMobile = shouldOptimizeForMobile();
  const networkOpts = useMemo(() => getNetworkOptimizations(), []);
  const lazyConfig = useMemo(() => getMobileLazyConfig(), []);

  // Use IntersectionObserver for better performance on slow connections
  useEffect(() => {
    // For priority images or fast connections without save-data, load immediately
    if (priority || (!networkOpts.delayNonCritical && !isMobile)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: lazyConfig.threshold,
        rootMargin: isMobile ? '50px' : lazyConfig.rootMargin
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, networkOpts.delayNonCritical, isMobile, lazyConfig]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad && onLoad();
  };

  const handleError = () => {
    setHasError(true);
    onError && onError();
  };

  // Optimize image URL for mobile/slow connections
  const optimizedSrc = useMemo(() => {
    if (!src) return '';
    if (src.startsWith('data:') || src.startsWith('blob:')) return src;
    
    // For slow connections, use lower quality
    if (networkOpts.lowerQuality && src.includes('r2.dev')) {
      const separator = src.includes('?') ? '&' : '?';
      return `${src}${separator}w=400&q=60`;
    }
    
    return src;
  }, [src, networkOpts.lowerQuality]);

  return (
    <div ref={imgRef} className={`lazy-image-container ${className}`} {...props}>
      {isInView && !hasError && (
        <img
          src={optimizedSrc}
          alt={alt}
          className={`lazy-image ${isLoaded ? 'loaded' : 'loading'}`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchpriority={priority ? "high" : "low"}
        />
      )}
      
      {(!isInView || !isLoaded) && !hasError && (
        <div className="lazy-image-placeholder">
          {placeholder || (
            <div className="lazy-image-skeleton">
              <div className="lazy-image-skeleton-shimmer"></div>
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
