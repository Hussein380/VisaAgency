// news.js - Consolidated news management system
class NewsManager {
    constructor() {
        this.newsContainer = document.getElementById('newsContainer');
        this.newsList = document.getElementById('newsList');
        this.isAdmin = !!this.newsList; // Check if we're in admin view
        this.initialize();
    }

    initialize() {
        this.loadContent();
        
        // Listen for localStorage changes
        window.addEventListener('storage', () => this.loadContent());

        // Auto-refresh news view (not admin) periodically
        if (!this.isAdmin) {
            setInterval(() => this.loadContent(), 30000);
        }

        // Set up admin form handler if in admin view
        if (this.isAdmin) {
            this.initializeAdminHandlers();
        }
    }

    async loadContent() {
        try {
            const newsItems = JSON.parse(localStorage.getItem('newsItems') || '[]')
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            if (this.isAdmin) {
                this.renderAdminView(newsItems);
            } else {
                this.renderNewsView(newsItems);
            }
        } catch (error) {
            console.error('Error loading news:', error);
            this.showError(this.isAdmin ? this.newsList : this.newsContainer);
        }
    }

    renderNewsView(newsItems) {
        if (!this.newsContainer) return;
        
        this.newsContainer.innerHTML = '';
        
        if (newsItems.length === 0) {
            this.showEmptyState();
            return;
        }

        // Display only the latest 3 items in news view
        newsItems.slice(0, 3).forEach((item, index) => {
            const newsCard = this.createNewsCard(item);
            newsCard.style.animationDelay = `${index * 0.2}s`;
            this.newsContainer.appendChild(newsCard);
        });

        if (window.AOS) {
            AOS.refresh();
        }
    }

    renderAdminView(newsItems) {
        if (!this.newsList) return;

        this.newsList.innerHTML = newsItems.map(item => `
            <div class="content-item">
                <div>
                    <h3>${sanitizeHTML(item.title)}</h3>
                    <p>${formatDate(item.date)} - ${sanitizeHTML(item.category)}</p>
                    <p>${sanitizeHTML(item.excerpt)}</p>
                </div>
                <div class="content-actions">
                    <button class="edit-btn" onclick="newsManager.editItem(${item.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="newsManager.deleteItem(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    createNewsCard(newsItem) {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.setAttribute('data-aos', 'fade-up');

        const imagePath = newsItem.image || 
            `https://via.placeholder.com/400x200?text=${encodeURIComponent(newsItem.category)}`;
        
        card.innerHTML = `
            <div class="news-card-image" style="background-image: url('${sanitizeHTML(imagePath)}')"></div>
            <div class="news-card-content">
                <span class="news-card-date">${formatDate(newsItem.date)}</span>
                <span class="news-card-category">${sanitizeHTML(newsItem.category)}</span>
                <h3 class="news-card-title">${sanitizeHTML(newsItem.title)}</h3>
                <p class="news-card-description">${sanitizeHTML(newsItem.excerpt)}</p>
                ${newsItem.link ? 
                    `<a href="${sanitizeHTML(newsItem.link)}" class="news-card-link" 
                     target="_blank" rel="noopener noreferrer">Read More</a>` 
                    : ''}
            </div>
        `;
        
        return card;
    }

    initializeAdminHandlers() {
        document.getElementById('newsForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleFormSubmission(e.target);
        });
    }

    async handleFormSubmission(form) {
        const formData = new FormData(form);
        const newsItem = {
            id: this.editingId || Date.now(),
            title: formData.get('title'),
            category: formData.get('category'),
            date: formData.get('date'),
            excerpt: formData.get('excerpt'),
            content: formData.get('content'),
            image: formData.get('image'),
            link: formData.get('link')
        };

        try {
            const existingNews = JSON.parse(localStorage.getItem('newsItems') || '[]');
            
            if (this.editingId) {
                const index = existingNews.findIndex(item => item.id === this.editingId);
                if (index !== -1) {
                    existingNews[index] = newsItem;
                }
            } else {
                existingNews.push(newsItem);
            }
            
            localStorage.setItem('newsItems', JSON.stringify(existingNews));
            
            this.resetForm(form);
            this.loadContent();
            this.toggleForm(form);
            
        } catch (error) {
            console.error('Error saving news item:', error);
            alert('Failed to save news item. Please try again.');
        }
    }

    showEmptyState() {
        this.newsContainer.innerHTML = `
            <div class="no-news">
                <p>No news items available at the moment.</p>
            </div>
        `;
    }

    showError(container) {
        container.innerHTML = `
            <div class="error-state">
                <p>Unable to load news items. Please try again later.</p>
            </div>
        `;
    }

    resetForm(form) {
        form.reset();
        this.editingId = null;
    }

    toggleForm(form) {
        form.classList.toggle('hidden');
    }

    // Admin methods
    editItem(id) {
        this.editingId = id;
        const newsItems = JSON.parse(localStorage.getItem('newsItems') || '[]');
        const item = newsItems.find(item => item.id === id);
        
        if (item) {
            Object.entries(item).forEach(([key, value]) => {
                const input = document.getElementById(key);
                if (input) input.value = value;
            });
            
            this.toggleForm(document.getElementById('newsForm'));
        }
    }

    async deleteItem(id) {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            const newsItems = JSON.parse(localStorage.getItem('newsItems') || '[]');
            const filtered = newsItems.filter(item => item.id !== id);
            localStorage.setItem('newsItems', JSON.stringify(filtered));
            this.loadContent();
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Failed to delete item. Please try again.');
        }
    }
}

// Initialize the NewsManager when the DOM is loaded
let newsManager;
document.addEventListener('DOMContentLoaded', () => {
    newsManager = new NewsManager();
});