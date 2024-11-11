document.addEventListener('DOMContentLoaded', function() {
    const newsContainer = document.getElementById('news-container');
    
    async function loadNews() {
        try {
            // Fetch news from GitHub API (replace 'username' and 'repository' with your details)
            const response = await fetch('https://api.github.com/repos/Hussein380/VisaAgency/contents/content/news');
            const data = await response.json();

            if (data && data.length > 0) {
                data.forEach(newsItem => {
                    // Fetch file content (GitHub API returns file metadata, not the actual content)
                    fetch(newsItem.download_url)
                        .then(response => response.text())
                        .then(fileContent => {
                            const parsedContent = parseMarkdown(fileContent); // Parse markdown to get the article content
                            const newsElement = createNewsCard(parsedContent);
                            newsContainer.appendChild(newsElement);
                        });
                });
            } else {
                newsContainer.innerHTML = '<p>No news available.</p>';
            }
        } catch (error) {
            console.error("Error fetching news:", error);
            newsContainer.innerHTML = '<p>There was an error loading the news.</p>';
        }
    }

    // Parse markdown to extract relevant info (simplified example)
    function parseMarkdown(content) {
        const lines = content.split('\n');
        const title = lines[0].replace('# ', ''); // Assuming the first line is the title
        const date = lines[1].replace('Date: ', ''); // Assuming the second line contains the date
        const shortDescription = lines[2]; // Assuming the third line is the short description
        const readMoreLink = lines[3]; // Assuming the fourth line is the 'read more' link
        return { title, date, shortDescription, readMoreLink };
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
