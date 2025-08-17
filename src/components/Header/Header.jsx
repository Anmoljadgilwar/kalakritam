import React, { useState, useEffect, useRef } from 'react';
import { useNavigationWithLoading } from '../../hooks/useNavigationWithLoading';
import './Header.css';
import Artists from '../Artists';

const Header = ({ currentPage = 'home' }) => {
  const { navigateWithLoading } = useNavigationWithLoading();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mobileMenuRef = useRef(null);

  const navItems = [
    { path: '/home', label: 'Home' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/workshops', label: 'Workshops' },
    { path: '/events', label: 'Events' },
    { path: '/artists', label: 'Artists' },
    { path: '/artblogs', label: 'Art Blogs' },
    { path: '/contact', label: 'Contact' },
    { path: '/about', label: 'About Us' }
  ];

  // Check if device is mobile - more aggressive detection
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const isMobileDevice = width <= 768 || 
                           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
      
      // Force hide desktop navigation on mobile
      if (isMobileDevice) {
        const desktopNav = document.querySelector('.desktop-nav');
        if (desktopNav) {
          desktopNav.style.display = 'none';
          desktopNav.style.visibility = 'hidden';
          desktopNav.style.pointerEvents = 'none';
          desktopNav.style.position = 'absolute';
          desktopNav.style.left = '-9999px';
          desktopNav.style.zIndex = '-1000';
        }
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  // Force remove desktop navigation on mobile - additional safety
  useEffect(() => {
    if (isMobile) {
      const removeDesktopElements = () => {
        // Remove all desktop navigation buttons
        const desktopButtons = document.querySelectorAll('.desktop-nav .nav-link');
        desktopButtons.forEach(button => {
          button.style.display = 'none';
          button.style.pointerEvents = 'none';
          button.style.visibility = 'hidden';
          button.style.position = 'absolute';
          button.style.left = '-9999px';
          button.disabled = true;
        });
        
        // Remove desktop navigation container
        const desktopNav = document.querySelector('.desktop-nav');
        if (desktopNav) {
          desktopNav.style.display = 'none !important';
          desktopNav.style.visibility = 'hidden !important';
          desktopNav.style.pointerEvents = 'none !important';
          desktopNav.style.position = 'absolute !important';
          desktopNav.style.left = '-9999px !important';
          desktopNav.style.zIndex = '-1000 !important';
          desktopNav.style.opacity = '0 !important';
        }
      };
      
      removeDesktopElements();
      // Run again after a short delay to ensure DOM is ready
      setTimeout(removeDesktopElements, 100);
    }
  }, [isMobile]);

  const handleNavigation = (path) => {
    navigateWithLoading(path);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const toggleMobileMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside both the mobile menu button and the sidebar
      const mobileMenuButton = mobileMenuRef.current;
      const mobileSidebar = document.querySelector('.mobile-sidebar');
      
      if (mobileMenuButton && !mobileMenuButton.contains(event.target) &&
          mobileSidebar && !mobileSidebar.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="shared-header">
      <div className="header-content">
        <div className="header-brand" onClick={() => handleNavigation('/home')}>
          <h1 className="kalakritam-title">Kalakritam</h1>
          <div className="header-subtitle">Manifesting Through Arts</div>
        </div>
        
        {/* Desktop Navigation - Only render on desktop - NEVER on mobile */}
        {!isMobile && window.innerWidth > 768 && (
          <nav className="header-navigation desktop-nav" style={{ display: isMobile ? 'none' : 'flex' }}>
            <div className="nav-links">
              {navItems.map(item => (
                <button 
                  key={item.path}
                  onClick={() => handleNavigation(item.path)} 
                  className={`nav-link ${currentPage === item.path.slice(1) ? 'active' : ''}`}
                  disabled={isMobile}
                  style={{ 
                    display: isMobile ? 'none' : 'flex',
                    pointerEvents: isMobile ? 'none' : 'auto'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        )}
      </div>

      {/* Mobile Menu Button - 3 Dots - Only render on mobile */}
      {isMobile && (
        <div className="mobile-menu-container" ref={mobileMenuRef}>
          <button 
            className="mobile-menu-button"
            onClick={toggleMobileMenu}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            aria-label="Toggle mobile menu"
          >
            <div className={`three-dots ${isMobileMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      )}

      {/* Mobile Sidebar - Only render on mobile */}
      {isMobile && (
        <>
          {/* Overlay */}
          {isMobileMenuOpen && (
            <div 
              className="mobile-sidebar-overlay"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
          )}
          
          {/* Sidebar */}
          <nav className={`mobile-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
              <h3>Navigation</h3>
              <button 
                className="close-sidebar-btn"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close sidebar"
              >
                ×
              </button>
            </div>
            <div className="sidebar-nav-links">
              {navItems.map((item) => (
                <button 
                  key={item.path}
                  onClick={() => handleNavigation(item.path)} 
                  className={`sidebar-nav-link ${currentPage === item.path.slice(1) ? 'active' : ''}`}
                >
                  <span className="nav-icon">•</span>
                  {item.label}
                </button>
              ))}
            </div>
            <div className="sidebar-footer">
              <p>Kalakritam</p>
              <small>Art Gallery & Cultural Hub</small>
            </div>
          </nav>
        </>
      )}
    </header>
  );
};

export default Header;
