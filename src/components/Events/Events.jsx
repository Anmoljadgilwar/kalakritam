import React, { useState, useEffect, useRef } from 'react';
import { useNavigationWithLoading } from '../../hooks/useNavigationWithLoading';
import { toast } from '../../utils/notifications.js';
import { useMobileOptimizations } from '../../hooks/useMobileOptimizations';
import Header from '../Header';
import Footer from '../Footer';
import VideoLogo from '../VideoLogo';
import OptimizedParticles from '../OptimizedParticles';
import { config } from '../../config/environment';
import './Events.css';

const Events = () => {
  const { navigateWithLoading } = useNavigationWithLoading();
  const [selectedView, setSelectedView] = useState('upcoming');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchCalled = useRef(false);

  useEffect(() => {
    if (!fetchCalled.current) {
      fetchEvents();
      fetchCalled.current = true;
    }
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const loadingId = toast.dataLoading('Loading events...');
      
      const response = await fetch(`${config.apiBaseUrl}/events`);
      const data = await response.json();
      
      toast.dismiss(loadingId);
      
      if (data.success) {
        // Transform image URLs to handle localhost URLs like gallery
        const transformedData = data.data.map(event => ({
          ...event,
          imageUrl: config.transformImageUrl(event.image_url || event.imageUrl)
        }));
        setEvents(transformedData);
        toast.dataLoaded(`Loaded ${transformedData.length} events`);
      } else {
        setError('Failed to load events');
        toast.error('Failed to load events');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to connect to server');
      toast.serverError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="events-container">
        <VideoLogo />
        <Header currentPage="events" />
        <div className="events-page-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading events...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-container">
        <VideoLogo />
        <Header currentPage="events" />
        <div className="events-page-content">
          <div className="error-container">
            <h2>Unable to load events</h2>
            <p>{error}</p>
            <button onClick={fetchEvents} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Filter events based on selected view
  const filteredEvents = selectedView === 'upcoming' 
    ? events.filter(event => event.active) 
    : events;

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="events-container">
      {/* Particles Background */}
      <div className="events-particles-background">
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
      
      {/* Video Logo */}
      <VideoLogo />
      
      <Header currentPage="events" />
      
      <main className="events-content">
        <section className="events-hero">
          <h1 className="events-title">Events</h1>
          <p className="events-subtitle">Discover Art Through Experiences</p>
        </section>

        <section className="events-filter">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${selectedView === 'upcoming' ? 'active' : ''}`}
              onClick={() => setSelectedView('upcoming')}
            >
              Upcoming Events
            </button>
          </div>
        </section>

        {selectedView === 'upcoming' && (
          <section className="upcoming-events">
            <div className="events-grid">
              {filteredEvents.map(event => (
                <div key={event.id} className="event-card" onClick={() => handleEventClick(event)}>
                  <div className="event-poster">
                    <img 
                      src={event.imageUrl || '/events/art poster.png'} 
                      alt={event.title}
                      className="poster-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="poster-placeholder" style={{ display: 'none' }}>
                      <div className="kalakritam-logo-text">Kalakritam</div>
                      <div className="event-type">Event Poster</div>
                    </div>
                    <div className="event-date-badge">
                      {new Date(event.startDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                  <div className="event-content">
                    <h3 className="event-title">{event.title}</h3>
                    <div className="event-quick-details">
                      <div className="event-time">
                        <strong>Time:</strong> {new Date(event.startDate).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit', 
                          hour12: true 
                        })}
                      </div>
                      <div className="event-location">
                        <strong>Location:</strong> {event.venue}
                      </div>
                      <div className="event-price">
                        <strong>Price:</strong> ₹{event.ticketPrice}
                      </div>
                    </div>
                    <p className="event-description">{event.description}</p>
                    <div className="event-actions">
                      <button className="view-details-btn">View Details</button>
                      <button className="register-btn">Register Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Event Detail Modal */}
        {isModalOpen && selectedEvent && (
          <div className="event-modal-overlay" onClick={closeModal}>
            <div className="event-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={closeModal}>
                <div className="close-icon-circle">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </div>
              </button>
              
              <div className="modal-content">
                <div className="modal-poster-section">
                  <img 
                    src={selectedEvent.imageUrl} 
                    alt={selectedEvent.title}
                    className="modal-poster-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="poster-placeholder" style={{ display: 'none' }}>
                    <div className="kalakritam-logo-text">Kalakritam</div>
                    <div className="event-type">Event Poster</div>
                  </div>
                </div>

                <div className="modal-details-section">
                  <div className="modal-header">
                    <h2 className="modal-title">{selectedEvent.title}</h2>
                    <div className="modal-price-section">
                      <span className="price-label">Price</span>
                      <div className="modal-price">₹{selectedEvent.ticketPrice}</div>
                    </div>
                  </div>

                  <div className="modal-description">
                    <h3>About This Event</h3>
                    <p>{selectedEvent.description}</p>
                  </div>

                  <div className="modal-specifications">
                    <h3>Event Details</h3>
                    <div className="spec-grid">
                      <div className="spec-item">
                        <span className="spec-label">Date</span>
                        <span className="spec-value">{new Date(selectedEvent.startDate).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Start Time</span>
                        <span className="spec-value">{new Date(selectedEvent.startDate).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit', 
                          hour12: true 
                        })}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">End Time</span>
                        <span className="spec-value">{new Date(selectedEvent.endDate).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit', 
                          hour12: true 
                        })}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Location</span>
                        <span className="spec-value">{selectedEvent.venue}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Max Attendees</span>
                        <span className="spec-value">{selectedEvent.maxAttendees}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Current Attendees</span>
                        <span className="spec-value">{selectedEvent.currentAttendees}</span>
                      </div>
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button className="register-modal-btn">Register Now</button>
                    <button className="share-btn">Share Event</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Events;
