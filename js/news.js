document.addEventListener('DOMContentLoaded', function() {
    const newsContainer = document.getElementById('news-container');
    const loadingState = document.getElementById('loading-state');
    const emptyState = document.getElementById('empty-state');
    const errorState = document.getElementById('error-state');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const newsCardTemplate = document.getElementById('news-card-template').content;
    let currentCategory = 'all';

    async function loadNews() {
        showLoadingState(true);

        try {
            const response = await fetch('https://api.github.com/repos/Hussein380/VisaAgency/contents/content/news');
            const data = await response.json();

            if (data && data.length > 0) {
                const newsPromises = data
                    .filter(file => file.name.endsWith('.md') || file.name.endsWith('.json'))
                    .map(async newsItem => {
                        const contentResponse = await fetch(newsItem.download_url);
                        const fileContent = await contentResponse.text();
                        return parseContent(fileContent, newsItem.name);
                    });

                const newsItems = await Promise.all(newsPromises);
                newsItems.sort((a, b) => new Date(b.date) - new Date(a.date));
                displayNewsItems(newsItems);
            } else {
                showEmptyState();
            }
        } catch (error) {
            console.error("Error fetching news:", error);
            showErrorState();
        } finally {
            showLoadingState(false);
        }
    }

    function parseContent(content, filename) {
        try {
            try {
                const jsonContent = JSON.parse(content);
                return {
                    title: jsonContent.title,
                    date: jsonContent.date,
                    category: jsonContent.category || 'News',
                    shortDescription: jsonContent.description || jsonContent.shortDescription,
                    image: jsonContent.image || jsonContent.featuredImage,
                    readMoreLink: jsonContent.url || `./news/${filename.replace('.json', '')}`,
                    content: jsonContent.body || jsonContent.content
                };
            } catch {
                const frontMatterRegex = /---\s*([\s\S]*?)\s*---\s*([\s\S]*)/;
                const matches = content.match(frontMatterRegex);
                if (!matches) return null;

                const frontMatter = parseYAML(matches[1]);
                const bodyContent = matches[2].trim();
                return {
                    title: frontMatter.title,
                    date: frontMatter.date,
                    category: frontMatter.category || 'News',
                    shortDescription: frontMatter.description || bodyContent.substring(0, 150) + '...',
                    image: frontMatter.image || frontMatter.featured_image,
                    readMoreLink: frontMatter.url || `./news/${filename.replace('.md', '')}`,
                    content: bodyContent
                };
            }
        } catch (error) {
            console.error(`Error parsing content for ${filename}:`, error);
            return null;
        }
    }

    function parseYAML(yaml) {
        const result = {};
        const lines = yaml.split('\n');
        lines.forEach(line => {
            const [key, ...values] = line.split(':').map(str => str.trim());
            if (key && values.length) {
                result[key] = values.join(':').replace(/^['"](.*)['"]$/, '$1');
            }
        });
        return result;
    }

    function displayNewsItems(newsItems) {
        newsContainer.innerHTML = '';
        const filteredItems = newsItems.filter(news => currentCategory === 'all' || news.category.toLowerCase() === currentCategory);

        if (filteredItems.length > 0) {
            filteredItems.forEach(news => {
                if (news) {
                    const newsElement = createNewsCard(news);
                    newsContainer.appendChild(newsElement);
                }
            });
        } else {
            showEmptyState();
        }
    }

    function createNewsCard(news) {
        const newsCard = document.importNode(newsCardTemplate, true);
        
        const imageUrl = news.image ? 
            (news.image.startsWith('http') ? news.image : `/${news.image.replace(/^\//, '')}`) :
            '/images/default-news-image.jpg';

        newsCard.querySelector('.news-card-image img').src = imageUrl;
        newsCard.querySelector('.news-card-category').textContent = news.category;
        newsCard.querySelector('.news-card-date time').textContent = formatDate(news.date);
        newsCard.querySelector('.news-card-title').textContent = news.title;
        newsCard.querySelector('.news-card-description').textContent = news.shortDescription;
        newsCard.querySelector('.news-card-link').href = news.readMoreLink;

        return newsCard;
    }

    function formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    }

    function showLoadingState(show) {
        loadingState.style.display = show ? 'block' : 'none';
    }

    function showEmptyState() {
        emptyState.style.display = 'block';
        newsContainer.innerHTML = '';
    }

    function showErrorState() {
        errorState.style.display = 'block';
        newsContainer.innerHTML = '';
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentCategory = button.getAttribute('data-category');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            loadNews();
        });
    });

    loadNews();
});
