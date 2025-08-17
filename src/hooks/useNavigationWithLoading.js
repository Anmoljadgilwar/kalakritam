import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { useLoading } from '../contexts/LoadingContext.jsx';

export const useNavigationWithLoading = () => {
  const { isLoading, setIsLoading } = useLoading();
  const navigate = useNavigate();

  const navigateWithLoading = useCallback((path) => {
    setIsLoading(true);
    
    // Show loading for at least 800ms for smooth transition
    setTimeout(() => {
      navigate(path);
      // Hide loading after navigation
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    }, 800);
  }, [navigate, setIsLoading]);

  return { isLoading, navigateWithLoading };
};
