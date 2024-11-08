/ Utility function to format dates
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Function to sanitize HTML content to prevent XSS
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Function to create a news card element
function createNewsCard(newsItem) {
    // Validate required fields
    if (!newsItem.title || !newsItem.date || !newsItem.category) {
        console.warn('Missing required fields for news item:', newsItem);
        return null;
    }

    const card = document.createElement('div');
    card.className = 'news-card';
    card.setAttribute('data-aos', 'fade-up');
    
    // Set random animation delay for floating effect
    card.style.setProperty('--delay', Math.random());

    // Handle image path
    const imagePath = newsItem.image ? (
        newsItem.image.startsWith('/assets') || newsItem.image.startsWith('http')
            ? newsItem.image
            : `/assets/${newsItem.image}`
    ) : `https://via.placeholder.com/400x200?text=${encodeURIComponent(newsItem.category)}`;

    // Create card content with sanitized data
    card.innerHTML = `
        <div class="news-card-image" style="background-image: url('${sanitizeHTML(imagePath)}')"></div>
        <div class="news-card-content">
            <span class="news-card-date">${sanitizeHTML(formatDate(newsItem.date))}</span>
            <span class="news-card-category">${sanitizeHTML(newsItem.category)}</span>
            <h3 class="news-card-title">${sanitizeHTML(newsItem.title)}</h3>
            <p class="news-card-description">${sanitizeHTML(newsItem.shortDescription || '')}</p>
            ${newsItem.readMoreLink ? 
                `<a href="${sanitizeHTML(newsItem.readMoreLink)}" 
                    class="news-card-link" 
                    target="_blank" 
                    rel="noopener noreferrer">Read More</a>` 
                : ''}
        </div>
    `;

    return card;
}

// Function to handle loading states
function setLoadingState(isLoading) {
    const container = document.getElementById('newsContainer');
    if (isLoading) {
        container.innerHTML = '<div class="loading">Loading news...</div>';
    }
}

// Function to handle errors
function showError(message) {
    const container = document.getElementById('newsContainer');
    container.innerHTML = `
        <div class="error">
            <p>${message}</p>
            <button onclick="loadNews()">Try Again</button>
        </div>
    `;
}

// Main function to load news
async function loadNews() {
    setLoadingState(true);

    try {
        let newsData;

        // Try to fetch from Netlify CMS API
        try {
            const response = await fetch('/.netlify/functions/get-news');
            if (!response.ok) {
                throw new Error(`API response: ${response.status}`);
            }
            newsData = await response.json();
        } catch (apiError) {
            console.warn('API fetch failed, falling back to local JSON:', apiError);
            
            // Fallback to local JSON
            const localResponse = await fetch('/assets/data/news.json');
            if (!localResponse.ok) {
                throw new Error('Failed to load news data');
            }
            newsData = await localResponse.json();
        }

        // Validate news data structure
        if (!Array.isArray(newsData.news)) {
            throw new Error('Invalid news data format');
        }

        const newsContainer = document.getElementById('newsContainer');
        newsContainer.innerHTML = '';

        // Sort and limit to most recent news items
        const recentNews = newsData.news
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);

        // Create and append news cards
        recentNews.forEach((newsItem, index) => {
            const newsCard = createNewsCard(newsItem);
            if (newsCard) {
                newsCard.style.animationDelay = `${index * 0.2}s`;
                newsContainer.appendChild(newsCard);
            }
        });

        // Refresh AOS animations
        if (window.AOS) {
            AOS.refresh();
        }

    } catch (error) {
        console.error('Error loading news:', error);
        showError('Unable to load news. Please try again later.');
    } finally {
        setLoadingState(false);
    }
}

// Initialize news loading when DOM is ready
document.addEventListener('DOMContentLoaded', loadNews);

// Add event listener for Netlify Identity
if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => {
        if (!user) {
            window.netlifyIdentity.on("login", () => {
                document.location.href = "/admin/";
            });
        }
    });
}