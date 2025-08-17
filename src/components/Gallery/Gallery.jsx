import React, { useState, useEffect, useRef } from 'react';
import { useNavigationWithLoading } from '../../hooks/useNavigationWithLoading';
import { config } from '../../config/environment';
import { toast } from '../../utils/notifications.js';
import Header from '../Header';
import Footer from '../Footer';
import VideoLogo from '../VideoLogo';
import Particles from '../Particles';
import LazyImage from '../LazyImage';
import './Gallery.css';

const Gallery = () => {
  const { navigateWithLoading } = useNavigationWithLoading();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchCalled = useRef(false);

  useEffect(() => {
    if (!fetchCalled.current) {
      fetchArtworks();
      fetchCalled.current = true;
    }
  }, []);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      
      // Show loading notification
      const loadingId = toast.dataLoading('Loading gallery...');
      
      console.log('Fetching artworks from:', `${config.apiBaseUrl}/gallery`);
      const response = await fetch(`${config.apiBaseUrl}/gallery`);
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      toast.dismiss(loadingId);
      
      if (data.success) {
        // Transform image URLs to handle localhost URLs
        const transformedData = data.data.map(artwork => ({
          ...artwork,
          imageUrl: config.transformImageUrl(artwork.image_url || artwork.imageUrl)
        }));
        setArtworks(transformedData);
        toast.dataLoaded(`Loaded ${transformedData.length} artworks`);
      } else {
        setError('Failed to load artworks');
        toast.error('Failed to load artworks');
      }
    } catch (err) {
      console.error('Error fetching artworks:', err);
      const errorMessage = 'Failed to connect to server';
      setError(errorMessage);
      toast.serverError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (artwork) => {
    setSelectedArtwork(artwork);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArtwork(null);
  };

  // Extract unique categories from artworks, filtering out null/undefined values
  const categories = ['all', ...new Set(
    artworks
      .map(artwork => artwork.category)
      .filter(category => category != null && category !== '')
  )];

  const filteredArtworks = selectedCategory === 'all' 
    ? artworks 
    : artworks.filter(artwork => artwork.category === selectedCategory);

  if (loading) {
    return (
      <div className="gallery-container">
        <VideoLogo />
        <Header currentPage="gallery" />
        <div className="gallery-page-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading artworks...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="gallery-container">
        <VideoLogo />
        <Header currentPage="gallery" />
        <div className="gallery-page-content">
          <div className="error-container">
            <h2>Unable to load gallery</h2>
            <p>{error}</p>
            <button onClick={fetchArtworks} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="gallery-container">
      {/* Particles Background */}
      <div className="gallery-particles-background">
        <Particles
          particleColors={['#c38f21', '#ffffff', '#c38f21']}
          particleCount={1000}
          particleSpread={10}
          speed={0.2}
          particleBaseSize={200}
          moveParticlesOnHover={true}
          particleHoverFactor={2}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>
      
      {/* Blur Overlay Layer */}
      <div className="gallery-blur-overlay"></div>
      
      {/* Video Logo */}
      <VideoLogo />
      
      <Header currentPage="gallery" />
      
      <div className="gallery-page-content">
        <header className="gallery-page-header">
          <h1 className="gallery-title">Art Gallery</h1>
          <p className="gallery-subtitle">Discover India's Artistic Heritage</p>
          <div className="gallery-description">
            <p>Explore our curated collection of traditional and contemporary Indian art. From ancient temple murals to modern interpretations, each piece tells a story of India's rich cultural heritage.</p>
          </div>
        </header>

        <section className="gallery-filters">
          <h3>Filter by Category</h3>
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category && typeof category === 'string' 
                  ? category.charAt(0).toUpperCase() + category.slice(1)
                  : 'Unknown'
                }
              </button>
            ))}
          </div>
        </section>

        <main className="gallery-content">
          <div className="artworks-count">
            <p>Showing {filteredArtworks.length} artwork{filteredArtworks.length !== 1 ? 's' : ''}</p>
          </div>
          
          <div className="gallery-grid">
            {filteredArtworks.map(artwork => (
              <div key={artwork.id} className="artwork-card universal-card">
                <div className="artwork-image-container universal-card-image-container">
                  <LazyImage
                    src={artwork.imageUrl} 
                    alt={artwork.title}
                    className="artwork-image universal-card-image"
                    placeholder={
                      <div className="artwork-image-placeholder universal-card-image-placeholder">
                        <div className="universal-card-logo-text">Kalakritam</div>
                        <div className="universal-card-image-not-available">Loading...</div>
                      </div>
                    }
                    onError={() => {
                      console.log(`Failed to load image: ${artwork.imageUrl}`);
                    }}
                  />
                  <div className="artwork-overlay universal-card-overlay">
                    <div className="artwork-overlay-content universal-card-overlay-content">
                      <h3>{artwork.title}</h3>
                      <p>by {artwork.artist}</p>
                      <span className="highlight-text">{artwork.price}</span>
                    </div>
                  </div>
                </div>
                
                <div className="artwork-info universal-card-content">
                  <h4 className="artwork-title universal-card-title">{artwork.title}</h4>
                  <p className="artwork-artist universal-card-subtitle">by {artwork.artist}</p>
                  <p className="artwork-description universal-card-description">{artwork.description}</p>
                  
                  <div className="artwork-details universal-card-details">
                    <div className="detail-row universal-card-detail-row">
                      <span className="detail-label universal-card-detail-label">Medium:</span>
                      <span className="detail-value universal-card-detail-value">{artwork.medium}</span>
                    </div>
                    <div className="detail-row universal-card-detail-row">
                      <span className="detail-label universal-card-detail-label">Year:</span>
                      <span className="detail-value universal-card-detail-value">{artwork.year}</span>
                    </div>
                    <div className="detail-row universal-card-detail-row">
                      <span className="detail-label universal-card-detail-label">Category:</span>
                      <span className="detail-value universal-card-detail-value">{artwork.category}</span>
                    </div>
                  </div>
                  
                  <div className="artwork-actions universal-card-actions">
                    <button 
                      className="btn-view universal-card-btn"
                      onClick={() => handleViewDetails(artwork)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredArtworks.length === 0 && (
            <div className="no-results">
              <div className="no-results-content">
                <h3>No artworks found</h3>
                <p>Try selecting a different category to explore more artworks.</p>
                <button 
                  className="reset-filter-btn"
                  onClick={() => setSelectedCategory('all')}
                >
                  Show All Artworks
                </button>
              </div>
            </div>
          )}
        </main>

        <section className="gallery-info">
          <div className="info-content">
            <h2>Art Gallery Hyderabad - Kalakritam's Workshop Creations</h2>
            <p>
              Discover the inspiring creations from our <strong>art workshops in Hyderabad</strong> at Kalakritam's gallery. 
              Our collection showcases artwork created during our weekend workshops held in cafes and restaurants across the city. 
              Each piece represents the creative journey of our workshop participants, featuring traditional Indian art techniques 
              and contemporary expressions learned through our hands-on workshop experiences. Explore the artistic growth and 
              cultural heritage celebrated in every workshop creation.
            </p>
          </div>
        </section>
      </div>

      {/* Artwork Detail Modal */}
      {isModalOpen && selectedArtwork && (
        <div className="artwork-modal-overlay" onClick={closeModal}>
          <div className="artwork-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              <div className="close-icon-circle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </div>
            </button>
            
            <div className="modal-content">
              <div className="modal-image-section">
                <img 
                  src={selectedArtwork.imageUrl} 
                  alt={selectedArtwork.title}
                  className="modal-artwork-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="image-placeholder" style={{ display: 'none' }}>
                  <div className="kalakritam-logo-text">Kalakritam</div>
                  <div className="image-not-available">Image not available</div>
                </div>
                <div className="modal-image-info">
                  <div className="image-quality-badge">High Resolution</div>
                  <div className="artwork-category-badge">{selectedArtwork.category}</div>
                </div>
              </div>

              <div className="modal-details-section">
                <div className="modal-header">
                  <div className="modal-title-section">
                    <h2 className="modal-title">{selectedArtwork.title}</h2>
                    <p className="modal-artist">by {selectedArtwork.artist}</p>
                  </div>
                  <div className="modal-price-section">
                    <span className="price-label">Price</span>
                    <div className="modal-price">{selectedArtwork.price}</div>
                  </div>
                </div>

                <div className="modal-description">
                  <h3>About This Artwork</h3>
                  <p>{selectedArtwork.description}</p>
                </div>

                <div className="modal-specifications">
                  <h3>Specifications</h3>
                  <div className="spec-grid">
                    <div className="spec-item">
                      <span className="spec-label">Medium</span>
                      <span className="spec-value">{selectedArtwork.medium}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Year Created</span>
                      <span className="spec-value">{selectedArtwork.year}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Category</span>
                      <span className="spec-value">{selectedArtwork.category}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Artist</span>
                      <span className="spec-value">{selectedArtwork.artist}</span>
                    </div>
                  </div>
                </div>

                <div className="modal-additional-info">
                  <div className="artwork-authenticity">
                    <h4>Authenticity Guaranteed</h4>
                    <p>This artwork comes with a certificate of authenticity from Kalakritam Gallery.</p>
                  </div>
                  
                  <div className="artwork-care">
                    <h4>Care Instructions</h4>
                    <p>Keep away from direct sunlight. Clean gently with a soft, dry cloth. Frame with UV-protective glass for long-term preservation.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Gallery;
