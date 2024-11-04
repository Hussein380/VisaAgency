// Initialize AOS for animations
AOS.init({
  duration: 800,
  once: true
});

// Navigation scroll effect
const nav = document.getElementById('mainNav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
      nav.classList.add('nav-scrolled');
  } else {
      nav.classList.remove('nav-scrolled');
  }
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

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

// Placeholder function for 'Others' dialog
function showOthersDialog() {
  alert('More options coming soon!');
}

// Toggle between dark and light themes
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
});
