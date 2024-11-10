// Admin Panel JavaScript Module
const adminPanel = {
    // State
    activeSection: 'newsEvents',
    newsData: [],
    
    // Initialize the admin panel
    init() {
        this.loadNewsData();
        this.setupEventListeners();
        this.renderNewsList();
        this.renderStudyAbroadList();
        this.showActiveTab(this.activeSection);
    },

    // Setup Event Listeners
    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.dataset.section;
                this.showActiveTab(section);
            });
        });

        // Add buttons
        document.querySelectorAll('.add-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const formId = btn.dataset.form;
                document.getElementById(formId).classList.remove('hidden');
            });
        });

        // Form submissions
        document.getElementById('newsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleNewsSubmit(e.target);
        });

        document.getElementById('studyAbroadForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleStudyAbroadSubmit(e.target);
        });
    },

    // Show active tab
    showActiveTab(sectionId) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.section === sectionId);
        });

        // Update content sections
        document.querySelectorAll('.tab-content').forEach(section => {
            section.classList.toggle('active', section.id === sectionId);
        });

        this.activeSection = sectionId;
    },

    // Handle news form submission
    handleNewsSubmit(form) {
        const formData = {
            id: Date.now().toString(), // Unique ID
            title: form.title.value,
            category: form.category.value,
            date: form.date.value,
            excerpt: form.excerpt.value,
            content: form.content.value,
            link: form.link.value,
            image: form.image.value,
            timestamp: new Date().toISOString()
        };

        this.newsData.unshift(formData); // Add to beginning of array
        this.saveNewsData();
        this.renderNewsList();
        this.showNotification('News item added successfully!', 'success');
        form.reset();
        form.classList.add('hidden');
    },

    // Render news list
    renderNewsList() {
        const newsListElement = document.getElementById('newsList');
        newsListElement.innerHTML = this.newsData.map(item => `
            <div class="content-item" data-id="${item.id}">
                <div class="content-info">
                    <h3>${item.title}</h3>
                    <div class="meta">
                        <span>${new Date(item.date).toLocaleDateString()}</span> | 
                        <span>${item.category}</span>
                    </div>
                    <div class="excerpt">${item.excerpt}</div>
                    ${item.image ? `<img src="${item.image}" alt="${item.title}" class="preview-image">` : ''}
                </div>
                <div class="content-actions">
                    <button class="edit-btn" onclick="adminPanel.editNews('${item.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-btn" onclick="adminPanel.deleteNews('${item.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    },

    // Edit news item
    editNews(id) {
        const item = this.newsData.find(news => news.id === id);
        if (!item) return;

        const form = document.getElementById('newsForm');
        form.classList.remove('hidden');
        
        // Populate form
        Object.keys(item).forEach(key => {
            if (form[key]) {
                form[key].value = item[key];
            }
        });

        // Remove existing item
        this.deleteNews(id, false); // Don't save yet
        
        // Scroll to form
        form.scrollIntoView({ behavior: 'smooth' });
    },

    // Delete news item
    deleteNews(id, shouldSave = true) {
        this.newsData = this.newsData.filter(item => item.id !== id);
        if (shouldSave) {
            this.saveNewsData();
            this.renderNewsList();
            this.showNotification('News item deleted successfully!', 'success');
        }
    },

    // Cancel edit
    cancelEdit() {
        const form = document.getElementById('newsForm');
        form.reset();
        form.classList.add('hidden');
    },

    // Local Storage Operations
    loadNewsData() {
        const stored = localStorage.getItem('adminNewsData');
        this.newsData = stored ? JSON.parse(stored) : [];
    },

    saveNewsData() {
        localStorage.setItem('adminNewsData', JSON.stringify(this.newsData));
    },

    // Notification System
    showNotification(message, type = 'success') {
        const container = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        container.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};


// Initialize the admin panel when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => adminPanel.init());