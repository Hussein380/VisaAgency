// news.js - Improved news management system

class NewsManager {
    constructor() {
        this.newsContainer = document.getElementById('newsContainer');
        this.newsList = document.getElementById('newsList');
        this.loadingSpinner = document.querySelector('.loading-spinner');
        this.emptyState = document.querySelector('.empty-state');
        this.errorState = document.querySelector('.error-state');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.currentFilter = 'all';
        this.isAdmin = window.location.pathname.includes('/admin'); // Updated check for admin
        this.initialize();
    }

    initialize() {
        this.setupFilterListeners();
        this.setupRetryButton();
        this.loadContent();
        this.autoRefreshNews();
    }

    setupFilterListeners() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentFilter = btn.dataset.category;
                this.loadContent();
                this.updateActiveFilter(btn);
            });
        });
    }

    updateActiveFilter(activeBtn) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    setupRetryButton() {
        const retryBtn = this.errorState.querySelector('.retry-btn');
        retryBtn.addEventListener('click', () => {
            this.loadContent();
            this.errorState.classList.add('hidden');
        });
    }

    autoRefreshNews() {
        if (!this.isAdmin) {
            setInterval(() => this.loadContent(), 30000);
        }
    }

    async loadContent() {
        this.toggleLoading(true);
        try {
            const newsData = await this.fetchNews();
            this.displayNews(newsData);
        } catch (error) {
            this.toggleError(true);
        } finally {
            this.toggleLoading(false);
        }
    }

    async fetchNews() {
        // Fetch news data from localStorage instead of an API
        const storedNews = localStorage.getItem('adminNewsData');
        if (!storedNews) throw new Error("No news data found.");
        const newsData = JSON.parse(storedNews);

        // Filter news based on the current category
        return this.currentFilter === 'all'
            ? newsData
            : newsData.filter(news => news.category === this.currentFilter);
    }

    displayNews(newsData) {
        this.newsContainer.innerHTML = ''; // Clear existing content
        if (newsData.length === 0) {
            this.toggleEmpty(true);
            return;
        }

        newsData.forEach(item => {
            const newsItem = this.createNewsItem(item);
            this.newsContainer.appendChild(newsItem);
        });

        this.toggleEmpty(false);
    }

    createNewsItem(news) {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('news-card');
        itemDiv.innerHTML = `
            <div class="news-card-image" style="background-image: url('${news.imageUrl || ''}')"></div>
            <div class="news-card-content">
                <span class="news-card-date">${news.date}</span>
                <span class="news-card-category">${news.category}</span>
                <h3 class="news-card-title">${news.title}</h3>
                <p class="news-card-description">${news.description}</p>
                <a href="${news.link}" class="news-card-link" target="_blank">Read More</a>
            </div>`;
        return itemDiv;
    }

    toggleLoading(isLoading) {
        this.loadingSpinner.classList.toggle('hidden', !isLoading);
    }

    toggleEmpty(isEmpty) {
        this.emptyState.classList.toggle('hidden', !isEmpty);
    }

    toggleError(hasError) {
        this.errorState.classList.toggle('hidden', !hasError);
    }
}

// Initialize the NewsManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => new NewsManager());
