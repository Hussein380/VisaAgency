document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const newsContainer = document.getElementById('news-container');
    const loadingState = document.getElementById('loading-state');
    const emptyState = document.getElementById('empty-state');
    const errorState = document.getElementById('error-state');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const newsCardTemplate = document.getElementById('news-card-template').content;
    let currentCategory = 'all';

    // Constants
    const GITHUB_API_URL = 'https://api.github.com/repos/Hussein380/VisaAgency/contents/content/news';
    const DEFAULT_IMAGE = '/images/default-news-image.jpg';

    async function loadNews() {
        showLoadingState(true);
        try {
            const response = await fetch(GITHUB_API_URL);
            const data = await response.json();

            if (data && data.length > 0) {
                const newsPromises = data
                    .filter(file => file.name.endsWith('.md') || file.name.endsWith('.json'))
                    .map(async newsItem => {
                        try {
                            const contentResponse = await fetch(newsItem.download_url);
                            const fileContent = await contentResponse.text();
                            return parseContent(fileContent, newsItem.name);
                        } catch (error) {
                            console.error(`Error fetching content for ${newsItem.name}:`, error);
                            return null;
                        }
                    });

                const newsItems = (await Promise.all(newsPromises))
                    .filter(item => item !== null)
                    .sort((a, b) => new Date(b.date) - new Date(a.date));

                if (newsItems.length > 0) {
                    displayNewsItems(newsItems);
                } else {
                    showEmptyState();
                }
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

    function getReadMoreLink(url, filename, extension) {
        // If there's a readMoreLink provided, use it directly
        if (url && typeof url === 'string') {
            // Check if it's an absolute URL
            if (url.startsWith('http')) {
                return url;
            }
            // Check if it's a relative URL starting with /
            if (url.startsWith('/')) {
                return url;
            }
            // If it's just a plain string, assume it's an external URL and add https://
            if (!url.includes('://')) {
                return `https://${url}`;
            }
            return url;
        }
    
        // Fallback to generating a local blog path if no readMoreLink is provided
        const cleanFilename = filename
            .replace(/^\d{4}-\d{2}-\d{2}-/, '')
            .replace(extension, '');
        return `/news/${cleanFilename}`;
    }

    function parseContent(content, filename) {
        try {
            // First try to parse as JSON
            try {
                const jsonContent = JSON.parse(content);
                return {
                    title: jsonContent.title,
                    date: jsonContent.date,
                    category: jsonContent.category || 'News',
                    shortDescription: jsonContent.description || jsonContent.shortDescription,
                    image: jsonContent.image || jsonContent.featuredImage,
                    // Use readMoreLink directly without modification
                    readMoreLink: jsonContent.readMoreLink || '',
                    content: jsonContent.body || jsonContent.content
                };
            } catch {
                // If JSON parsing fails, try parsing as Markdown with frontmatter
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
                    // Use readMoreLink directly from frontmatter
                    readMoreLink: frontMatter.readMoreLink || '',
                    content: bodyContent
                };
            }
        } catch (error) {
            console.error(`Error parsing content for ${filename}:`, error);
            return null;
        }
    }

    function createNewsCard(news) {
        const newsCard = document.importNode(newsCardTemplate, true);
        
        const imageUrl = news.image ? 
            (news.image.startsWith('http') ? news.image : `/${news.image.replace(/^\//, '')}`) :
            DEFAULT_IMAGE;

        newsCard.querySelector('.news-card-image img').src = imageUrl;
        newsCard.querySelector('.news-card-image img').alt = news.title;
        newsCard.querySelector('.news-card-category').textContent = news.category;
        newsCard.querySelector('.news-card-date time').textContent = formatDate(news.date);
        newsCard.querySelector('.news-card-title').textContent = news.title;
        newsCard.querySelector('.news-card-description').textContent = news.shortDescription;

        const linkElement = newsCard.querySelector('.news-card-link');
        
        // Handle the readMoreLink
        if (news.readMoreLink) {
            if (news.readMoreLink.startsWith('http')) {
                // External link
                linkElement.href = news.readMoreLink;
                linkElement.setAttribute('target', '_blank');
                linkElement.setAttribute('rel', 'noopener noreferrer');
            } else {
                // Internal link - use as is
                linkElement.href = news.readMoreLink;
            }
        } else {
            // Fallback to a default internal link if no readMoreLink is provided
            linkElement.href = `/news/${news.title.toLowerCase().replace(/\s+/g, '-')}`;
        }

        return newsCard;
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
        const filteredItems = newsItems.filter(news => 
            currentCategory === 'all' || 
            news.category.toLowerCase() === currentCategory.toLowerCase()
        );

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
        if (show) {
            newsContainer.innerHTML = '';
            emptyState.style.display = 'none';
            errorState.style.display = 'none';
        }
    }

    function showEmptyState() {
        emptyState.style.display = 'block';
        newsContainer.innerHTML = '';
        errorState.style.display = 'none';
    }

    function showErrorState() {
        errorState.style.display = 'block';
        newsContainer.innerHTML = '';
        emptyState.style.display = 'none';
    }

    // Event Listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentCategory = button.getAttribute('data-category');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            loadNews();
        });
    });

    // Initialize
    loadNews();
});