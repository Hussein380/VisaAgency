// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Navigation scroll effect
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            navLinks.classList.remove('active');
        }
    });
});

// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('click', () => {
    let currentTheme = document.documentElement.getAttribute('data-theme');
    let targetTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(targetTheme);
});

// Set initial theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme);
} else if (prefersDarkScheme.matches) {
    setTheme('dark');
} else {
    setTheme('light');
}

// Service card interactions
const serviceCards = document.querySelectorAll('.service-card');
const serviceDetailOverlay = document.querySelector('.service-detail-overlay');
const closeBtn = document.querySelector('.close-btn');

serviceCards.forEach(card => {
    card.addEventListener('click', () => {
        const serviceType = card.getAttribute('data-service');
        // Fetch service details and update overlay content
        // This is a placeholder - you would typically fetch this data from your backend
        const serviceDetails = getServiceDetails(serviceType);
        document.getElementById('service-title').textContent = serviceDetails.title;
        document.getElementById('service-description').innerHTML = serviceDetails.description;
        serviceDetailOverlay.classList.add('show');
    });
});

closeBtn.addEventListener('click', () => {
    serviceDetailOverlay.classList.remove('show');
});

// Close overlay when clicking outside
serviceDetailOverlay.addEventListener('click', (e) => {
    if (e.target === serviceDetailOverlay) {
        serviceDetailOverlay.classList.remove('show');
    }
});

// Placeholder function to get service details
function getServiceDetails(serviceType) {
    // This would typically be fetched from a server
    const details = {
        'visit-visas': {
            title: 'Visit Visas',
            description: 'Our visit visa services cover tourist and business visas for various countries...'
        },
        'student-visas': {
            title: 'Student Visas',
            description: 'We assist students in obtaining visas for international education opportunities...'
        },
        'work-visas': {
            title: 'Work Visas',
            description: 'Our work visa services help professionals secure employment opportunities abroad...'
        },
        'pilgrimage-visas': {
            title: 'Pilgrimage Visas',
            description: 'We provide specialized assistance for Hajj and Umrah visas...'
        }
    };
    return details[serviceType] || { title: 'Service Details', description: 'Information not available.' };
}

// Implement WhatsApp chat functionality
function startWhatsAppChat() {
    const phoneNumber = '254717417326'; // Replace with your actual WhatsApp number
    const message = encodeURIComponent('Hello, I would like to inquire about visa services.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
}

// Implement email query functionality
function sendEmailQuery() {
    const email = 'info@tawheedglobal.com'; // Replace with your actual email
    const subject = encodeURIComponent('Visa Services Inquiry');
    const body = encodeURIComponent('Hello, I would like to inquire about your visa services.');
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
}

// Show 'Others' dialog
function showOthersDialog() {
    alert('Additional services coming soon!');
}