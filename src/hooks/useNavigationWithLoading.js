import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { useLoading } from '../contexts/LoadingContext.jsx';

export const useNavigationWithLoading = () => {
  const { isLoading, setIsLoading } = useLoading();
  const navigate = useNavigate();

  const navigateWithLoading = useCallback((path) => {
    // Force scroll to top immediately and synchronously
    const forceScrollTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      const appContent = document.querySelector('.app-content');
      if (appContent) appContent.scrollTop = 0;
      
      const app = document.querySelector('.app');
      if (app) app.scrollTop = 0;
    };
    
    // Scroll immediately
    forceScrollTop();
    
    setIsLoading(true);
    
    // Navigate immediately without delay
    requestAnimationFrame(() => {
      forceScrollTop();
      navigate(path);
      
      // Hide loading after a short delay
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    });
  }, [navigate, setIsLoading]);

  return { isLoading, navigateWithLoading };
};
