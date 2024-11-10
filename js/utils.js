// utils.js
/**
 * Formats a date string into a more readable format
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date string
 */
function formatDate(dateString) {
    try {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString; // Return original string if formatting fails
    }
}

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param {string} str - The string to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeHTML(str) {
    if (!str) return '';
    
    try {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    } catch (error) {
        console.error('Error sanitizing HTML:', error);
        return ''; // Return empty string if sanitization fails
    }
}

/**
 * Validates news item data
 * @param {Object} newsItem - The news item to validate
 * @returns {boolean} Whether the news item is valid
 */
function validateNewsItem(newsItem) {
    const requiredFields = ['title', 'date', 'category', 'excerpt'];
    return requiredFields.every(field => 
        newsItem.hasOwnProperty(field) && 
        newsItem[field] !== null && 
        newsItem[field] !== undefined && 
        newsItem[field] !== ''
    );
}

/**
 * Generates a unique ID for new items
 * @returns {string} Unique ID
 */
function generateUniqueId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Shows a notification message to the user
 * @param {string} message - The message to show
 * @param {string} type - The type of message ('success', 'error', 'warning')
 */
function showNotification(message, type = 'success') {
    // Check if notification container exists, if not create it
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        `;
        document.body.appendChild(container);
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        padding: 15px 20px;
        margin-bottom: 10px;
        border-radius: 4px;
        color: white;
        background-color: ${
            type === 'success' ? '#4caf50' :
            type === 'error' ? '#f44336' :
            '#ff9800'
        };
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;

    // Add to container
    container.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            container.removeChild(notification);
            if (container.children.length === 0) {
                document.body.removeChild(container);
            }
        }, 300);
    }, 3000);
}

// Add necessary CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);