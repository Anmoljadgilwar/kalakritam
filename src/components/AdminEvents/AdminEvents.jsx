import React, { useState, useEffect } from 'react';
import { useNavigationWithLoading } from '../../hooks/useNavigationWithLoading';
import { toast } from '../../utils/notifications.js';
import AdminHeader from '../AdminHeader';
import Footer from '../Footer';
import VideoLogo from '../VideoLogo';
import SEOFieldsComponent from '../SEOFieldsComponent';
import FileUpload from '../FileUpload';
import { eventsApi, uploadApi } from '../../lib/adminApi';
import { config } from '../../config/environment';
import '../AdminGallery/AdminGallery.css';
import './AdminEvents.css';

const AdminEvents = () => {
  const { navigateWithLoading } = useNavigationWithLoading();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      navigateWithLoading('/admin/login');
    }
  };

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    venue: '',
    ticketPrice: '',
    maxAttendees: '',
    currentAttendees: 0,
    imageUrl: '',
    featured: false,
    active: true,
    // SEO fields
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    slug: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await eventsApi.getAll();
      
      if (response.success) {
        // Transform image URLs for display
        const data = response.data || [];
        const transformedData = Array.isArray(data) ? data.map(event => ({
          ...event,
          imageUrl: config.transformImageUrl(event.image_url || event.imageUrl)
        })) : [];
        setEvents(transformedData);
      } else {
        // Handle API response that might not have success field
        const data = response.data || response || [];
        const transformedData = Array.isArray(data) ? data.map(event => ({
          ...event,
          imageUrl: config.transformImageUrl(event.image_url || event.imageUrl)
        })) : [];
        setEvents(transformedData);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to connect to server');
      setEvents([]); // Ensure events is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      venue: '',
      ticketPrice: '',
      maxAttendees: '',
      currentAttendees: 0,
      imageUrl: '',
      featured: false,
      active: true
    });
    setImageFile(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (event) => {
    // Format date for input field
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    setFormData({
      title: event.title || '',
      description: event.description || '',
      startDate: formatDate(event.start_date) || '',
      endDate: formatDate(event.end_date) || '',
      venue: event.venue || '',
      ticketPrice: event.ticket_price || '',
      maxAttendees: event.max_attendees || '',
      currentAttendees: event.current_attendees || 0,
      imageUrl: config.transformImageUrl(event.image_url) || '',
      featured: event.featured || false,
      active: event.active !== false,
      metaTitle: event.meta_title || '',
      metaDescription: event.meta_description || '',
      metaKeywords: event.meta_keywords || '',
      slug: event.slug || '',
      ogTitle: event.og_title || '',
      ogDescription: event.og_description || '',
      ogImage: event.og_image || ''
    });
    setImageFile(null);
    setSelectedEvent(event);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleView = (event) => {
    setSelectedEvent(event);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const response = await eventsApi.deleteEvent(eventId);
      
      if (response.success) {
        setEvents(events.filter(event => event.id !== eventId));
        toast.success('Event deleted successfully');
      } else {
        toast.error('Failed to delete event: ' + (response.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      toast.error('Failed to delete event: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const loadingId = toast.dataSaving(`${modalMode === 'create' ? 'Creating' : 'Updating'} event...`);
      
      let imageUrl = formData.imageUrl; // Use existing image URL if no new file
      
      // If there's a new image file to upload
      if (imageFile) {
        try {
          toast.info('Uploading image to R2 storage...');
          const uploadResult = await uploadApi.uploadImage(imageFile, 'events');
          
          if (uploadResult.success) {
            imageUrl = uploadResult.data.url; // Use the R2 URL from data object
            toast.success('Image uploaded successfully');
            console.log('R2 Image URL:', imageUrl);
          } else {
            throw new Error(uploadResult.message || 'Image upload failed');
          }
        } catch (uploadError) {
          toast.dismiss(loadingId);
          console.error('Image upload error:', uploadError);
          toast.error(`Image upload failed: ${uploadError.message}`);
          return; // Don't continue if image upload fails
        }
      }
      
      // Match the exact database schema from Neon
      const eventData = {
        // Required/basic fields
        title: formData.title || "Untitled Event",
        description: formData.description || null,
        
        // Date fields - convert to ISO timestamps
        start_date: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        end_date: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        
        // Event details
        venue: formData.venue || null,
        ticket_price: formData.ticketPrice ? parseFloat(formData.ticketPrice) : null,
        max_attendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
        current_attendees: formData.currentAttendees || 0,
        
        // Image fields
        image_url: imageUrl || null,
        
        // Status fields
        featured: formData.featured || false,
        active: formData.active !== false,
        
        // SEO/Meta fields
        meta_title: formData.metaTitle || (formData.title ? `${formData.title} - Cultural Event | Kalakritam` : null),
        meta_description: formData.metaDescription || (formData.title && formData.description ? 
          `Join "${formData.title}" - ${formData.description}. Discover cultural events and heritage experiences at Kalakritam.` : null),
        meta_keywords: formData.metaKeywords || "kalakritam, cultural events, art events, traditional culture, workshops, exhibitions",
        slug: formData.slug || (formData.title ? formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : null),
        og_title: formData.ogTitle || (formData.title ? `${formData.title} - Cultural Event` : null),
        og_description: formData.ogDescription || (formData.title && formData.description ? 
          `Experience "${formData.title}" and explore the rich world of culture and heritage at Kalakritam. ${formData.description}` : null),
        og_image: formData.ogImage || imageUrl || null
        
        // Note: id, created_at, updated_at are auto-generated by the database
      };
      
      console.log('Submitting event data with R2 image URL:', eventData);
      
      let response;
      if (modalMode === 'create') {
        response = await eventsApi.addEvent(eventData);
      } else {
        // Include old image URL for deletion if a new image was uploaded
        const updateData = {
          ...eventData,
          oldImageUrl: (imageFile && selectedEvent?.imageUrl) ? selectedEvent.imageUrl : undefined
        };
        response = await eventsApi.updateEvent(selectedEvent.id, updateData);
      }
      
      toast.dismiss(loadingId);
      if (response.success) {
        toast.success(`Event ${modalMode === 'create' ? 'created' : 'updated'} successfully`);
        setIsModalOpen(false);
        fetchEvents();
        setFormData({
          title: '',
          description: '',
          startDate: '',
          endDate: '',
          venue: '',
          ticketPrice: '',
          maxAttendees: '',
          currentAttendees: 0,
          imageUrl: '',
          featured: false,
          active: true,
          metaTitle: '',
          metaDescription: '',
          metaKeywords: '',
          slug: '',
          ogTitle: '',
          ogDescription: '',
          ogImage: ''
        });
      } else {
        toast.error(`Failed to ${modalMode} event: ${response.message || 'Unknown error'}`);
      }
    } catch (err) {
      if (typeof loadingId !== 'undefined') toast.dismiss(loadingId);
      console.error('Error saving event:', err);
      toast.error(`Failed to ${modalMode} event: ${err.message}`);
    }
  };

  const handleFileSelect = (file) => {
    setImageFile(file);
    // Create a preview URL
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        imageUrl: previewUrl
      }));
    }
  };

  const handleFileRemove = () => {
    setImageFile(null);
    setFormData(prev => ({
      ...prev,
      imageUrl: ''
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSeoChange = (seoData) => {
    setFormData(prev => ({
      ...prev,
      ...seoData
    }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setModalMode('view');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="admin-gallery-container">
        <VideoLogo />
        <AdminHeader currentPage="events" />
        <div className="admin-gallery-content">
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
      <div className="admin-gallery-container">
        <VideoLogo />
        <AdminHeader currentPage="events" />
        <div className="admin-gallery-content">
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

  return (
    <div className="admin-gallery-container">
      <VideoLogo />
      <AdminHeader currentPage="events" />
      
      <main className="admin-gallery-content">
        <section className="admin-gallery-header">
          <div className="header-content">
            <h1 className="admin-gallery-title">Event Management</h1>
            <p className="admin-gallery-subtitle">Manage Events & Cultural Programs</p>
          </div>
          <div className="header-actions">
            <button onClick={handleCreate} className="create-btn">
              + Add New Event
            </button>
            <div className="gallery-stats">
              <span className="stat">Total: {events.length}</span>
              <span className="stat">Upcoming: {events.filter(e => new Date(e.date) > new Date()).length}</span>
            </div>
          </div>
        </section>

        <section className="artworks-table-section">
          <div className="table-container">
            <table className="artworks-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event.id}>
                    <td>
                      <div className="artwork-image-cell">
                        <img 
                          src={event.imageUrl} 
                          alt={event.title}
                          className="table-artwork-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="image-placeholder" style={{ display: 'none' }}>
                          <span>No Image</span>
                        </div>
                      </div>
                    </td>
                    <td className="artwork-title-cell">{event.title}</td>
                    <td>{formatDate(event.date)}</td>
                    <td>{event.venue}</td>
                    <td>
                      <span className="category-badge">{event.category}</span>
                    </td>
                    <td className="price-cell">{event.price ? `₹${event.price}` : 'Free'}</td>
                    <td>
                      <div className="status-badges">
                        {event.isPublic && <span className="status-badge available">Public</span>}
                        {event.featured && <span className="status-badge featured">Featured</span>}
                        {new Date(event.date) > new Date() && <span className="status-badge upcoming">Upcoming</span>}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleView(event)}
                          className="action-btn view-btn"
                          title="View Details"
                        >
                          👁️
                        </button>
                        <button 
                          onClick={() => handleEdit(event)}
                          className="action-btn edit-btn"
                          title="Edit Event"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDelete(event.id)}
                          className="action-btn delete-btn"
                          title="Delete Event"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Modal for Create/Edit/View */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalMode === 'create' && 'Add New Event'}
                {modalMode === 'edit' && 'Edit Event'}
                {modalMode === 'view' && 'Event Details'}
              </h2>
              <button onClick={closeModal} className="modal-close-btn">×</button>
            </div>
            
            <div className="modal-content">
              {modalMode === 'view' ? (
                <div className="artwork-details-view">
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Title:</label>
                      <span>{selectedEvent?.title}</span>
                    </div>
                    <div className="detail-item">
                      <label>Date:</label>
                      <span>{formatDate(selectedEvent?.date)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Time:</label>
                      <span>{selectedEvent?.time}</span>
                    </div>
                    <div className="detail-item">
                      <label>Venue:</label>
                      <span>{selectedEvent?.venue}</span>
                    </div>
                    <div className="detail-item">
                      <label>Category:</label>
                      <span>{selectedEvent?.category}</span>
                    </div>
                    <div className="detail-item">
                      <label>Organizer:</label>
                      <span>{selectedEvent?.organizer}</span>
                    </div>
                    <div className="detail-item">
                      <label>Price:</label>
                      <span>{selectedEvent?.price ? `₹${selectedEvent.price}` : 'Free'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Max Attendees:</label>
                      <span>{selectedEvent?.maxAttendees || 'No limit'}</span>
                    </div>
                    <div className="detail-item full-width">
                      <label>Description:</label>
                      <span>{selectedEvent?.description}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="artwork-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="title">Title *</label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="category">Category *</label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="exhibition">Exhibition</option>
                        <option value="workshop">Workshop</option>
                        <option value="seminar">Seminar</option>
                        <option value="cultural">Cultural Event</option>
                        <option value="performance">Performance</option>
                        <option value="festival">Festival</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="startDate">Start Date *</label>
                      <input
                        type="datetime-local"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="endDate">End Date</label>
                      <input
                        type="datetime-local"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="venue">Venue *</label>
                      <input
                        type="text"
                        id="venue"
                        name="venue"
                        value={formData.venue}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="ticketPrice">Ticket Price (₹)</label>
                      <input
                        type="number"
                        id="ticketPrice"
                        name="ticketPrice"
                        value={formData.ticketPrice}
                        onChange={handleInputChange}
                        placeholder="Leave empty for free events"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="maxAttendees">Max Attendees</label>
                      <input
                        type="number"
                        id="maxAttendees"
                        name="maxAttendees"
                        value={formData.maxAttendees}
                        onChange={handleInputChange}
                        placeholder="Leave empty for no limit"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="currentAttendees">Current Attendees</label>
                      <input
                        type="number"
                        id="currentAttendees"
                        name="currentAttendees"
                        value={formData.currentAttendees}
                        onChange={handleInputChange}
                        min="0"
                      />
                    </div>
                    
                    <div className="form-group full-width">
                      <FileUpload
                        label="Event Image"
                        onFileSelect={handleFileSelect}
                        onFileRemove={handleFileRemove}
                        currentImageUrl={formData.imageUrl}
                      />
                    </div>
                    
                    <div className="form-group full-width">
                      <label htmlFor="description">Description</label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="isPublic"
                          checked={formData.isPublic}
                          onChange={handleInputChange}
                        />
                        Public Event
                      </label>
                    </div>
                    
                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleInputChange}
                        />
                        Featured Event
                      </label>
                    </div>
                  </div>
                  
                  {/* SEO Fields Component */}
                  <SEOFieldsComponent
                    seoData={{
                      metaTitle: formData.metaTitle,
                      metaDescription: formData.metaDescription,
                      metaKeywords: formData.metaKeywords,
                      slug: formData.slug,
                      ogTitle: formData.ogTitle,
                      ogDescription: formData.ogDescription,
                      ogImage: formData.ogImage
                    }}
                    onSeoChange={handleSeoChange}
                    mainTitle={formData.title}
                    mainDescription={formData.description}
                    type="event"
                    autoGenerate={true}
                  />
                  
                  <div className="form-actions">
                    <button type="button" onClick={closeModal} className="cancel-btn">
                      Cancel
                    </button>
                    <button type="submit" className="submit-btn">
                      {modalMode === 'create' ? 'Create Event' : 'Update Event'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default AdminEvents;

