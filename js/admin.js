let editingId = null;
let currentSection = 'newsEvents';

// Switch between tabs
function switchTab(section) {
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[onclick="switchTab('${section}')"]`).classList.add('active');

    // Update visible content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(section).classList.add('active');

    currentSection = section;
    loadContent(section);
}

// Toggle form visibility
function toggleForm(formId) {
    const form = document.getElementById(formId);
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    if (form.style.display === 'none') {
        resetForm(formId);
    }
}

// Reset form
function resetForm(formId) {
    document.getElementById(formId).reset();
    editingId = null;
}

// Handle News/Events form submission
document.getElementById('newsForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const newsItem = {
        title: document.getElementById('title').value,
        category: document.getElementById('category').value,
        date: document.getElementById('date').value,
        excerpt: document.getElementById('excerpt').value,
        content: document.getElementById('content').value,
        image: document.getElementById('image').value,
        link: document.getElementById('link').value
    };

    const endpoint = editingId ? `/api/news/${editingId}` : '/api/news';
    const method = editingId ? 'PUT' : 'POST';

    await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newsItem)
    });

    loadContent('newsEvents');
    toggleForm('newsForm');
});

// Handle Study Abroad form submission
document.getElementById('studyAbroadForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const program = {
        title: document.getElementById('programTitle').value,
        country: document.getElementById('country').value,
        duration: document.getElementById('duration').value,
        description: document.getElementById('programDescription').value,
        requirements: document.getElementById('requirements').value,
        link: document.getElementById('programLink').value,
        image: document.getElementById('programImage').value
    };

    const endpoint = editingId ? `/api/study-abroad/${editingId}` : '/api/study-abroad';
    const method = editingId ? 'PUT' : 'POST';

    await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(program)
    });

    loadContent('studyAbroad');
    toggleForm('studyAbroadForm');
});

// Load content for current section
async function loadContent(section) {
    const endpoint = section === 'newsEvents' ? '/api/news' : '/api/study-abroad';
    const response = await fetch(endpoint);
    const items = await response.json();
    
    const listElement = document.getElementById(section === 'newsEvents' ? 'newsList' : 'studyAbroadList');
    
    if (section === 'newsEvents') {
        listElement.innerHTML = items.map(item => `
            <div class="content-item">
                <div>
                    <h3>${item.title}</h3>
                    <p>${new Date(item.date).toLocaleDateString()} - ${item.category}</p>
                    <p>${item.excerpt}</p>
                </div>
                <div class="content-actions">
                    <button class="edit-btn" onclick="editItem('newsEvents', ${item.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteItem('newsEvents', ${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    } else {
        listElement.innerHTML = items.map(item => `
            <div class="content-item">
                <div>
                    <h3>${item.title}</h3>
                    <p>${item.country} - ${item.duration}</p>
                    <p>${item.description.substring(0, 150)}...</p>
                </div>
                <div class="content-actions">
                    <button class="edit-btn" onclick="editItem('studyAbroad', ${item.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteItem('studyAbroad', ${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Edit item
async function editItem(section, id) {
    const endpoint = section === 'newsEvents' ? `/api/news/${id}` : `/api/study-abroad/${id}`;
    const response = await fetch(endpoint);
    const item = await response.json();
    
    editingId = id;
    
    if (section === 'newsEvents') {
        document.getElementById('title').value = item.title;
        document.getElementById('category').value = item.category;
        document.getElementById('date').value = item.date;
        document.getElementById('excerpt').value = item.excerpt;
        document.getElementById('content').value = item.content;
        document.getElementById('image').value = item.image || '';
        document.getElementById('link').value = item.link || '';
        toggleForm('newsForm');
    } else {
        document.getElementById('programTitle').value = item.title;
        document.getElementById('country').value = item.country;
        document.getElementById('duration').value = item.duration;
        document.getElementById('programDescription').value = item.description;
        document.getElementById('requirements').value = item.requirements;
        document.getElementById('programLink').value = item.link || '';
        document.getElementById('programImage').value = item.image || '';
        toggleForm('studyAbroadForm');
    }
}

// Delete item
async function deleteItem(section, id) {
    if (confirm('Are you sure you want to delete this item?')) {
        const endpoint = section === 'newsEvents' ? `/api/news/${id}` : `/api/study-abroad/${id}`;
        await fetch(endpoint, { method: 'DELETE' });
        loadContent(section);
    }
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    loadContent('newsEvents');
});