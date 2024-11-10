// news.js - Enhanced news management system with filtering
class NewsManager {
    constructor() {
        this.newsContainer = document.getElementById('newsContainer');
        this.loadingSpinner = document.querySelector('.loading-spinner');
        this.emptyState = document.querySelector('.empty-state');
        this.errorState = document.querySelector('.error-state');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.currentFilter = 'all';
        this.initialize();
    }

    initialize() {
        this.setupFilterListeners();
        this.setupRetryButton();
        this.loadContent();
        
        // Listen for localStorage changes
        window.addEventListener('storage', () => this.loadContent());

        // Auto-refresh news view periodically
        setInterval(() => this.loadContent(), 30000);
    }

    setupFilterListeners() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.category;
                this.loadContent();
            });
        });
    }

    setupRetryButton() {
        document.querySelector('.retry-btn')?.addEventListener('click', () => {
            this.loadContent();
        });
    }

    showLoading(show = true) {
        this.loadingSpinner.style.display = show ? 'flex' : 'none';
        this.newsContainer.style.display = show ? 'none' : 'grid';
        this.emptyState.classList.add('hidden');
        this.errorState.classList.add('hidden');
    }

    async loadContent() {
        this.showLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
            const newsItems = JSON.parse(localStorage.getItem('newsItems') || '[]')
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            const filteredItems = this.filterItems(newsItems);
            this.renderNewsView(filteredItems);
        } catch (error) {
            console.error('Error loading news:', error);
            this.showError();
        }
    }

    filterItems(items) {
        if (this.currentFilter === 'all') return items;
        return items.filter(item => 
            item.category.toLowerCase() === this.currentFilter.toLowerCase()
        );
    }

    renderNewsView(newsItems) {
        this.showLoading(false);
        
        if (newsItems.length === 0) {
            this.showEmptyState();
            return;
        }

        this.newsContainer.innerHTML = '';
        
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

    createNewsCard(newsItem) {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.setAttribute('data-aos', 'fade-up');

        const imagePath = newsItem.image || 
            `https://via.placeholder.com/400x200?text=${encodeURIComponent(newsItem.category)}`;
        
        card.innerHTML = `
            <div class="news-card-image" style="background-image: url('${this.sanitizeHTML(imagePath)}')"></div>
            <div class="news-card-content">
                <span class="news-card-date">${this.formatDate(newsItem.date)}</span>
                <span class="news-card-category">${this.sanitizeHTML(newsItem.category)}</span>
                <h3 class="news-card-title">${this.sanitizeHTML(newsItem.title)}</h3>
                <p class="news-card-description">${this.sanitizeHTML(newsItem.excerpt)}</p>
                ${newsItem.link ? 
                    `<a href="${this.sanitizeHTML(newsItem.link)}" class="news-card-link" 
                     target="_blank" rel="noopener noreferrer">Read More</a>` 
                    : ''}
            </div>
        `;
        
        return card;
    }

    showEmptyState() {
        this.newsContainer.style.display = 'none';
        this.emptyState.classList.remove('hidden');
    }

    showError() {
        this.newsContainer.style.display = 'none';
        this.errorState.classList.remove('hidden');
    }

    sanitizeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Initialize the NewsManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NewsManager();
});