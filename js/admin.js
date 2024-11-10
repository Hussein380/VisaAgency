// admin.js
let editingId = null;
let currentSection = 'newsEvents';

// Handle News/Events form submission
document.getElementById('newsForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const newsItem = {
        id: editingId || Date.now(),
        title: document.getElementById('title').value,
        category: document.getElementById('category').value,
        date: document.getElementById('date').value,
        excerpt: document.getElementById('excerpt').value,
        content: document.getElementById('content').value,
        image: document.getElementById('image').value || '',
        link: document.getElementById('link').value || ''
    };

    try {
        // Get existing news items from localStorage
        let newsItems = JSON.parse(localStorage.getItem('newsItems') || '[]');
        
        if (editingId) {
            // Update existing item
            newsItems = newsItems.map(item => 
                item.id === editingId ? newsItem : item
            );
        } else {
            // Add new item
            newsItems.push(newsItem);
        }

        // Save to localStorage
        localStorage.setItem('newsItems', JSON.stringify(newsItems));
        
        // Reset form and refresh display
        document.getElementById('newsForm').reset();
        editingId = null;
        toggleForm('newsForm');
        
        // Refresh the news list
        loadContent('newsEvents');
        
        showNotification('News item saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving news:', error);
        showNotification('Failed to save news item', 'error');
    }
});

// Load content for current section
async function loadContent(section) {
    if (section === 'newsEvents') {
        try {
            const newsItems = JSON.parse(localStorage.getItem('newsItems') || '[]');
            const listElement = document.getElementById('newsList');
            
            listElement.innerHTML = newsItems
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(item => `
                    <div class="content-item">
                        <div>
                            <h3>${sanitizeHTML(item.title)}</h3>
                            <p>${formatDate(item.date)} - ${sanitizeHTML(item.category)}</p>
                            <p>${sanitizeHTML(item.excerpt)}</p>
                        </div>
                        <div class="content-actions">
                            <button class="edit-btn" onclick="editItem('newsEvents', ${item.id})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="delete-btn" onclick="deleteItem('newsEvents', ${item.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                `).join('');
        } catch (error) {
            console.error('Error loading news:', error);
            showNotification('Error loading news items', 'error');
        }
    }
}

// Delete item
async function deleteItem(section, id) {
    if (confirm('Are you sure you want to delete this item?')) {
        try {
            let newsItems = JSON.parse(localStorage.getItem('newsItems') || '[]');
            newsItems = newsItems.filter(item => item.id !== id);
            localStorage.setItem('newsItems', JSON.stringify(newsItems));
            loadContent(section);
            showNotification('Item deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting item:', error);
            showNotification('Failed to delete item', 'error');
        }
    }
}

// Edit item
async function editItem(section, id) {
    try {
        const newsItems = JSON.parse(localStorage.getItem('newsItems') || '[]');
        const item = newsItems.find(item => item.id === id);
        
        if (item) {
            editingId = id;
            document.getElementById('title').value = item.title;
            document.getElementById('category').value = item.category;
            document.getElementById('date').value = item.date;
            document.getElementById('excerpt').value = item.excerpt;
            document.getElementById('content').value = item.content;
            document.getElementById('image').value = item.image || '';
            document.getElementById('link').value = item.link || '';
            
            toggleForm('newsForm');
        }
    } catch (error) {
        console.error('Error editing item:', error);
        showNotification('Failed to load item for editing', 'error');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadContent('newsEvents');
});

// news.js
function createNewsCard(newsItem) {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.setAttribute('data-aos', 'fade-up');

    const imagePath = newsItem.image || `https://via.placeholder.com/400x200?text=${encodeURIComponent(newsItem.category)}`;
    
    card.innerHTML = `
        <div class="news-card-image" style="background-image: url('${sanitizeHTML(imagePath)}')"></div>
        <div class="news-card-content">
            <span class="news-card-date">${formatDate(newsItem.date)}</span>
            <span class="news-card-category">${sanitizeHTML(newsItem.category)}</span>
            <h3 class="news-card-title">${sanitizeHTML(newsItem.title)}</h3>
            <p class="news-card-description">${sanitizeHTML(newsItem.excerpt)}</p>
            ${newsItem.link ? 
                `<a href="${sanitizeHTML(newsItem.link)}" class="news-card-link" target="_blank" rel="noopener noreferrer">Read More</a>` 
                : ''}
        </div>
    `;
    
    return card;
}

function loadNews() {
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer) return;

    try {
        const newsItems = JSON.parse(localStorage.getItem('newsItems') || '[]');
        
        // Clear existing content
        newsContainer.innerHTML = '';
        
        if (newsItems.length === 0) {
            newsContainer.innerHTML = '<p class="no-news">No news items available.</p>';
            return;
        }

        // Sort by date and take latest 3
        const recentNews = newsItems
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);

        recentNews.forEach((item, index) => {
            const newsCard = createNewsCard(item);
            if (newsCard) {
                newsCard.style.animationDelay = `${index * 0.2}s`;
                newsContainer.appendChild(newsCard);
            }
        });

        if (window.AOS) {
            AOS.refresh();
        }
    } catch (error) {
        console.error('Error loading news:', error);
        newsContainer.innerHTML = '<p class="error">Error loading news items.</p>';
    }
}

// Initialize news display
document.addEventListener('DOMContentLoaded', loadNews);