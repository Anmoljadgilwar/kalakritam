import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Robust scroll restoration & reset on route changes.
// - Scrolls window, documentElement, body, and known scrollable containers
// - Avoids resetting when navigating to an in-page hash
// - Can disable smooth for specific transitions by setting sessionStorage flag
export default function ScrollToTop({ behavior = 'smooth' }) {
  const location = useLocation();
  const lastPathRef = useRef(location.pathname + location.search + location.hash);

  useEffect(() => {
    const { pathname, hash } = location;
    const full = pathname + location.search + hash;
    const comingFrom = lastPathRef.current;
    lastPathRef.current = full;

    // If navigating to same path hash anchor, don't force top
    if (hash && comingFrom.startsWith(pathname) && comingFrom !== full) {
      return;
    }

    // Allow a flag to disable smooth for the very next navigation (set elsewhere)
    const disableSmooth = sessionStorage.getItem('__forceInstantScroll');
    if (disableSmooth) {
      sessionStorage.removeItem('__forceInstantScroll');
    }

    const chosenBehavior = disableSmooth ? 'auto' : behavior;

    const scrollTargets = [
      window,
      document.documentElement,
      document.body,
      document.querySelector('.app-content'),
      document.querySelector('.app')
    ].filter(Boolean);

    const doScroll = () => {
      scrollTargets.forEach(t => {
        if (t === window) {
          try {
            window.scrollTo({ top: 0, left: 0, behavior: chosenBehavior });
          } catch {
            window.scrollTo(0, 0);
          }
        } else {
          try {
            t.scrollTo({ top: 0, left: 0, behavior: chosenBehavior });
          } catch {
            t.scrollTop = 0;
            t.scrollLeft = 0;
          }
        }
      });
    };

    // Perform after paint & again shortly after to override late layout shifts
    requestAnimationFrame(doScroll);
    setTimeout(doScroll, 50);
    setTimeout(doScroll, 200);
  }, [location, behavior]);

  return null;
}
