// OptimizedParticles - Mobile-optimized particles component
import React from 'react';
import Particles from '../Particles';

const OptimizedParticles = ({ 
  particleConfig, 
  networkOptimizations, 
  className = "particles-background" 
}) => {
  // Don't render particles if count is 0
  if (particleConfig.particleCount === 0) {
    return null;
  }

  return (
    <div className={className}>
      <Particles
        particleColors={['#c38f21', '#ffffff', '#c38f21']}
        particleCount={particleConfig.particleCount}
        particleSpread={particleConfig.particleSpread}
        speed={particleConfig.speed}
        particleBaseSize={particleConfig.particleBaseSize}
        moveParticlesOnHover={particleConfig.moveParticlesOnHover}
        particleHoverFactor={particleConfig.particleHoverFactor}
        alphaParticles={particleConfig.alphaParticles}
        disableRotation={particleConfig.disableRotation}
      />
    </div>
  );
};

export default OptimizedParticles;
