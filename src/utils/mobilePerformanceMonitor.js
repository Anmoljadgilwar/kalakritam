// Mobile performance monitoring for the gallery
export const mobilePerformanceMonitor = {
  metrics: {
    loadTime: 0,
    imagesLoaded: 0,
    totalImages: 0,
    memoryUsage: 0,
    fps: 0
  },

  startLoadTime: () => {
    mobilePerformanceMonitor.metrics.loadTime = performance.now();
  },

  endLoadTime: () => {
    const endTime = performance.now();
    const loadTime = endTime - mobilePerformanceMonitor.metrics.loadTime;
    console.log(`Gallery load time: ${loadTime.toFixed(2)}ms`);
    return loadTime;
  },

  trackImageLoad: () => {
    mobilePerformanceMonitor.metrics.imagesLoaded++;
    const progress = (mobilePerformanceMonitor.metrics.imagesLoaded / mobilePerformanceMonitor.metrics.totalImages) * 100;
    console.log(`Images loaded: ${mobilePerformanceMonitor.metrics.imagesLoaded}/${mobilePerformanceMonitor.metrics.totalImages} (${progress.toFixed(1)}%)`);
  },

  setTotalImages: (count) => {
    mobilePerformanceMonitor.metrics.totalImages = count;
  },

  measureMemoryUsage: () => {
    if ('memory' in performance) {
      const memory = performance.memory;
      mobilePerformanceMonitor.metrics.memoryUsage = memory.usedJSHeapSize / 1048576; // Convert to MB
      console.log(`Memory usage: ${mobilePerformanceMonitor.metrics.memoryUsage.toFixed(2)} MB`);
      
      // Warn if memory usage is high (>50MB on mobile)
      if (mobilePerformanceMonitor.metrics.memoryUsage > 50) {
        console.warn('High memory usage detected on mobile device');
      }
    }
  },

  measureFPS: () => {
    let lastTime = performance.now();
    let frameCount = 0;

    const measureFrame = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        mobilePerformanceMonitor.metrics.fps = frameCount;
        console.log(`FPS: ${mobilePerformanceMonitor.metrics.fps}`);
        
        // Warn if FPS is low on mobile
        if (mobilePerformanceMonitor.metrics.fps < 30) {
          console.warn('Low FPS detected on mobile device');
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFrame);
    };

    requestAnimationFrame(measureFrame);
  },

  logMetrics: () => {
    console.group('Mobile Performance Metrics');
    console.log('Load Time:', `${mobilePerformanceMonitor.metrics.loadTime.toFixed(2)}ms`);
    console.log('Images Loaded:', `${mobilePerformanceMonitor.metrics.imagesLoaded}/${mobilePerformanceMonitor.metrics.totalImages}`);
    console.log('Memory Usage:', `${mobilePerformanceMonitor.metrics.memoryUsage.toFixed(2)} MB`);
    console.log('FPS:', mobilePerformanceMonitor.metrics.fps);
    console.groupEnd();
  },

  // Performance recommendations based on metrics
  getRecommendations: () => {
    const recommendations = [];
    
    if (mobilePerformanceMonitor.metrics.loadTime > 3000) {
      recommendations.push('Consider reducing image sizes or enabling more aggressive caching');
    }
    
    if (mobilePerformanceMonitor.metrics.memoryUsage > 50) {
      recommendations.push('High memory usage detected - consider implementing image recycling');
    }
    
    if (mobilePerformanceMonitor.metrics.fps < 30) {
      recommendations.push('Low FPS detected - consider reducing particle count or disabling animations');
    }
    
    return recommendations;
  }
};

// Auto-start FPS monitoring on mobile devices
if (window.innerWidth <= 768) {
  mobilePerformanceMonitor.measureFPS();
  
  // Monitor memory usage every 30 seconds
  setInterval(() => {
    mobilePerformanceMonitor.measureMemoryUsage();
  }, 30000);
}
