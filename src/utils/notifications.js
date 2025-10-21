// Material UI based notification utility
import { toast as muiToast } from '../components/MuiToastContainer/muiToastService.js';

// Toast notification utility using Material UI
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  LOADING: 'loading'
};

export const NOTIFICATION_POSITIONS = {
  TOP_RIGHT: 'top-right',
  TOP_LEFT: 'top-left',
  TOP_CENTER: 'top-center',
  BOTTOM_RIGHT: 'bottom-right',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_CENTER: 'bottom-center'
};

// Notification Manager class for compatibility with existing code
class NotificationManager {
  constructor() {
    this.activeToasts = new Map();
  }

  // Basic toast methods
  success(message, options = {}) {
    const toastId = muiToast.success(message, options);
    this.activeToasts.set(toastId, { type: 'success', message });
    return toastId;
  }

  error(message, options = {}) {
    const toastId = muiToast.error(message, options);
    this.activeToasts.set(toastId, { type: 'error', message });
    return toastId;
  }

  warning(message, options = {}) {
    const toastId = muiToast.warning(message, options);
    this.activeToasts.set(toastId, { type: 'warning', message });
    return toastId;
  }

  info(message, options = {}) {
    const toastId = muiToast.info(message, options);
    this.activeToasts.set(toastId, { type: 'info', message });
    return toastId;
  }

  loading(message, options = {}) {
    const toastId = muiToast.loading(message, options);
    this.activeToasts.set(toastId, { type: 'loading', message });
    return toastId;
  }

  // Promise-based toast for async operations
  promise(promise, messages, options = {}) {
    return muiToast.promise(promise, messages, options);
  }

  // Update an existing toast
  update(toastId, options = {}) {
    muiToast.update(toastId, options);
  }

  // Remove/dismiss a toast
  remove(toastId) {
    muiToast.dismiss(toastId);
    this.activeToasts.delete(toastId);
  }

  dismiss(toastId) {
    this.remove(toastId);
  }

  // Clear all toasts
  clear() {
    muiToast.clear();
    this.activeToasts.clear();
  }

  // Server connection specific notifications
  serverConnecting(message = 'Connecting to server...') {
    return this.loading(message, {
      icon: '🔄',
      toastId: 'server-connecting',
    });
  }

  serverConnected(message = 'Connected to server successfully!') {
    this.remove('server-connecting');
    return this.success(message, {
      icon: '✅',
      duration: 3000,
    });
  }

  serverDisconnected(message = 'Connection to server lost') {
    return this.error(message, {
      icon: '🔌',
      duration: 0,
    });
  }

  serverError(message = 'Server error occurred') {
    return this.error(message, {
      icon: '⚠️',
      duration: 8000,
    });
  }

  // API specific notifications
  apiRequest(message = 'Processing request...') {
    return this.loading(message, {
      icon: '📡',
    });
  }

  apiSuccess(message = 'Request completed successfully!') {
    return this.success(message, {
      icon: '✅',
      duration: 3000,
    });
  }

  apiError(message = 'Request failed') {
    return this.error(message, {
      icon: '❌',
      duration: 6000,
    });
  }

  // Data operations
  dataSaving(message = 'Saving data...') {
    return this.loading(message, {
      icon: '💾',
    });
  }

  dataSaved(message = 'Data saved successfully!') {
    return this.success(message, {
      icon: '✅',
      duration: 3000,
    });
  }

  dataLoading(message = 'Loading data...') {
    return this.loading(message, {
      icon: '📥',
    });
  }

  dataLoaded(message = 'Data loaded successfully!') {
    return this.success(message, {
      icon: '✅',
      duration: 2000,
    });
  }

  // File operations
  fileUploading(message = 'Uploading file...') {
    return this.loading(message, {
      icon: '📤',
    });
  }

  fileUploaded(message = 'File uploaded successfully!') {
    return this.success(message, {
      icon: '✅',
      duration: 3000,
    });
  }

  fileDeleting(message = 'Deleting file...') {
    return this.loading(message, {
      icon: '🗑️',
    });
  }

  fileDeleted(message = 'File deleted successfully!') {
    return this.success(message, {
      icon: '✅',
      duration: 3000,
    });
  }

  // Authentication notifications
  authLoading(message = 'Authenticating...') {
    return this.loading(message, {
      icon: '🔐',
    });
  }

  authSuccess(message = 'Authentication successful!') {
    return this.success(message, {
      icon: '✅',
      duration: 3000,
    });
  }

  authError(message = 'Authentication failed') {
    return this.error(message, {
      icon: '🚫',
      duration: 5000,
    });
  }

  // Form operations
  formSubmitting(message = 'Submitting form...') {
    return this.loading(message, {
      icon: '📋',
    });
  }

  formSubmitted(message = 'Form submitted successfully!') {
    return this.success(message, {
      icon: '✅',
      duration: 3000,
    });
  }

  formError(message = 'Form submission failed') {
    return this.error(message, {
      icon: '❌',
      duration: 5000,
    });
  }

  // Validation notifications
  validationError(message = 'Please check your input') {
    return this.warning(message, {
      icon: '⚠️',
      duration: 4000,
    });
  }

  // Copy to clipboard
  copied(message = 'Copied to clipboard!') {
    return this.success(message, {
      icon: '📋',
      duration: 2000,
    });
  }

  // Legacy methods for backwards compatibility
  add(notification) {
    const { type, message, ...options } = notification;
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return this.success(message, options);
      case NOTIFICATION_TYPES.ERROR:
        return this.error(message, options);
      case NOTIFICATION_TYPES.WARNING:
        return this.warning(message, options);
      case NOTIFICATION_TYPES.INFO:
        return this.info(message, options);
      case NOTIFICATION_TYPES.LOADING:
        return this.loading(message, options);
      default:
        return this.info(message, options);
    }
  }

  subscribe(listener) {
    // For backwards compatibility
    return () => {};
  }
}

// Create global instance
export const notificationManager = new NotificationManager();

// Export convenience methods
export const toast = {
  success: (message, options) => notificationManager.success(message, options),
  error: (message, options) => notificationManager.error(message, options),
  warning: (message, options) => notificationManager.warning(message, options),
  info: (message, options) => notificationManager.info(message, options),
  loading: (message, options) => notificationManager.loading(message, options),
  promise: (promise, messages, options) => notificationManager.promise(promise, messages, options),

  // Server connection methods
  serverConnecting: (message) => notificationManager.serverConnecting(message),
  serverConnected: (message) => notificationManager.serverConnected(message),
  serverDisconnected: (message) => notificationManager.serverDisconnected(message),
  serverError: (message) => notificationManager.serverError(message),

  // API methods
  apiRequest: (message) => notificationManager.apiRequest(message),
  apiSuccess: (message) => notificationManager.apiSuccess(message),
  apiError: (message) => notificationManager.apiError(message),

  // Data operations
  dataSaving: (message) => notificationManager.dataSaving(message),
  dataSaved: (message) => notificationManager.dataSaved(message),
  dataLoading: (message) => notificationManager.dataLoading(message),
  dataLoaded: (message) => notificationManager.dataLoaded(message),

  // File operations
  fileUploading: (message) => notificationManager.fileUploading(message),
  fileUploaded: (message) => notificationManager.fileUploaded(message),
  fileDeleting: (message) => notificationManager.fileDeleting(message),
  fileDeleted: (message) => notificationManager.fileDeleted(message),

  // Authentication
  authLoading: (message) => notificationManager.authLoading(message),
  authSuccess: (message) => notificationManager.authSuccess(message),
  authError: (message) => notificationManager.authError(message),

  // Form operations
  formSubmitting: (message) => notificationManager.formSubmitting(message),
  formSubmitted: (message) => notificationManager.formSubmitted(message),
  formError: (message) => notificationManager.formError(message),

  // Validation
  validationError: (message) => notificationManager.validationError(message),

  // Utility
  copied: (message) => notificationManager.copied(message),

  // Utility methods
  dismiss: (id) => notificationManager.dismiss(id),
  update: (id, options) => notificationManager.update(id, options),
  clear: () => notificationManager.clear(),
};

export default notificationManager;
