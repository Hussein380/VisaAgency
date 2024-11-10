// news.js
document.addEventListener('DOMContentLoaded', function() {
    const newsContainer = document.getElementById('news-container');
    
    async function loadNews() {
        try {
            const response = await fetch('/news.json'); // Path to your generated news JSON file
            const data = await response.json();
            
            if (data && data.length > 0) {
                data.forEach(newsItem => {
                    const newsElement = createNewsCard(newsItem);
                    newsContainer.appendChild(newsElement);
                });
            } else {
                newsContainer.innerHTML = '<p>No news available.</p>';
            }
        } catch (error) {
            console.error("Error fetching news:", error);
            newsContainer.innerHTML = '<p>There was an error loading the news.</p>';
        }
    }

    // Create the HTML structure for each news item
    function createNewsCard(news) {
        const card = document.createElement('div');
        card.classList.add('news-card');
        card.innerHTML = `
            <div class="news-card-image" style="background-image: url('${news.image}')"></div>
            <div class="news-card-content">
                <span class="news-card-date">${new Date(news.date).toLocaleDateString()}</span>
                <span class="news-card-category">${news.category}</span>
                <h3 class="news-card-title">${news.title}</h3>
                <p class="news-card-description">${news.shortDescription}</p>
                <a href="${news.readMoreLink}" class="news-card-link" target="_blank">Read More</a>
            </div>
        `;
        return card;
    }

    // Call the function to load news when the page loads
    loadNews();
});
