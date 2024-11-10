// news.js - Frontend news display logic
async function loadNews() {
    try {
        const response = await fetch('/api/news');
        if (!response.ok) {
            throw new Error(`Failed to fetch news: ${response.status}`);
        }
        const newsData = await response.json();
        
        const newsContainer = document.getElementById('newsContainer');
        newsContainer.innerHTML = ''; // Clear existing content
        
        // Sort by date descending and take the latest 3 items
        const sortedNews = newsData
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);
            
        sortedNews.forEach((item, index) => {
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
        showError('Unable to load news. Please try again later.');
    }
}

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

// admin.js - Backend admin panel logic
let editingId = null;
let currentSection = 'newsEvents';

// Modified form submission handler
document.getElementById('newsForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const newsItem = {
        title: document.getElementById('title').value,
        category: document.getElementById('category').value,
        date: document.getElementById('date').value,
        excerpt: document.getElementById('excerpt').value,
        content: document.getElementById('content').value,
        image: document.getElementById('image').value,
        link: document.getElementById('link').value,
        id: editingId || Date.now() // Use timestamp as ID if new item
    };

    try {
        // Store in localStorage for persistence
        const existingNews = JSON.parse(localStorage.getItem('newsItems') || '[]');
        
        if (editingId) {
            // Update existing item
            const index = existingNews.findIndex(item => item.id === editingId);
            if (index !== -1) {
                existingNews[index] = newsItem;
            }
        } else {
            // Add new item
            existingNews.push(newsItem);
        }
        
        localStorage.setItem('newsItems', JSON.stringify(existingNews));
        
        // Simulate API response
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Reset form and refresh display
        resetForm('newsForm');
        loadContent('newsEvents');
        toggleForm('newsForm');
        
        // Trigger news reload on main page if it exists
        if (window.loadNews) {
            loadNews();
        }
    } catch (error) {
        console.error('Error saving news item:', error);
        alert('Failed to save news item. Please try again.');
    }
});

// Modified content loader
async function loadContent(section) {
    if (section === 'newsEvents') {
        try {
            // Load from localStorage
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
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="delete-btn" onclick="deleteItem('newsEvents', ${item.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('');
        } catch (error) {
            console.error('Error loading news items:', error);
            document.getElementById('newsList').innerHTML = '<p>Error loading news items</p>';
        }
    }
}

// Initialize both admin and news pages
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('newsContainer')) {
        loadNews();
    }
    if (document.getElementById('newsList')) {
        loadContent('newsEvents');
    }
});