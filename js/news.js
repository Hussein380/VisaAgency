// Function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Function to create news card
// Function to create news card
function createNewsCard(newsItem) {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.setAttribute('data-aos', 'fade-up');

    // Update image path handling to work with your assets structure
    const imagePath = newsItem.image.startsWith('/assets') 
        ? newsItem.image 
        : `/assets/${newsItem.image}`;
    
    const imagePlaceholder = newsItem.image
        ? imagePath
        : `https://via.placeholder.com/400x200?text=${encodeURIComponent(newsItem.category)}`;

    card.innerHTML = `
        <div class="news-card-image" style="background-image: url('${imagePlaceholder}')"></div>
        <div class="news-card-content">
            <span class="news-card-date">${formatDate(newsItem.date)}</span>
            <span class="news-card-category">${newsItem.category}</span>
            <h3 class="news-card-title">${newsItem.title}</h3>
            <p class="news-card-description">${newsItem.shortDescription}</p>
            <a href="${newsItem.readMoreLink}" class="news-card-link" target="_blank">Read More</a>
        </div>
    `;

    return card;
}

// Load news from Netlify CMS or fallback to local content
async function loadNews() {
    try {
        let newsData;

        // Try to fetch from Netlify CMS
        try {
            const response = await fetch('/api/news');
            newsData = await response.json();
        } catch (apiError) {
            // Fallback to local JSON if API fails
            const localResponse = await fetch('news.json');
            newsData = await localResponse.json();
        }

        const newsContainer = document.getElementById('newsContainer');
        newsContainer.innerHTML = '';

        // Sort and limit to 3 most recent news items
        const recentNews = newsData.news
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);

        recentNews.forEach(newsItem => {
            const newsCard = createNewsCard(newsItem);
            newsContainer.appendChild(newsCard);
        });

        // Re-initialize AOS if it's being used
        if (window.AOS) {
            AOS.refresh();
        }
    } catch (error) {
        console.error('Error loading news:', error);
    }
}

// Load news when the page loads
document.addEventListener('DOMContentLoaded', loadNews);