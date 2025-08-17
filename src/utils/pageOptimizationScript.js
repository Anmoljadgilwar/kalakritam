// Quick optimization script for all remaining pages

const pages = [
  'Artists',
  'Contact', 
  'ArtBlogs',
  'Events',
  'About'
];

const optimizePageScript = (pageName) => {
  const lowerCasePage = pageName.toLowerCase();
  
  return `
// Add to imports at the top
import { useMobileOptimizations } from '../../hooks/useMobileOptimizations';
import OptimizedParticles from '../OptimizedParticles';

// Add in component
const { particleConfig, networkOptimizations, getOptimizedImageUrl, trackImageLoad } = useMobileOptimizations('${lowerCasePage}');

// Replace particles JSX with:
<OptimizedParticles 
  particleConfig={particleConfig}
  networkOptimizations={networkOptimizations}
  className="${lowerCasePage}-particles-background"
/>

// Add data-connection to container:
<div className="${lowerCasePage}-container" data-connection={networkOptimizations.lowerQuality ? 'slow' : 'fast'}>
`;
};

pages.forEach(page => {
  console.log(`\n=== ${page} Page Optimization ===`);
  console.log(optimizePageScript(page));
});
