// Mobile menu functionality
const mobileMenuBtn = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

// Create overlay element
const overlay = document.createElement('div');
overlay.classList.add('menu-overlay');
body.appendChild(overlay);

// Toggle menu function
function toggleMenu() {
  const isOpen = navLinks.classList.contains('active');
  
  if (isOpen) {
    navLinks.classList.remove('active');
    overlay.classList.remove('active');
    mobileMenuBtn.innerHTML = '☰';
    body.style.overflow = '';
  } else {
    navLinks.classList.add('active');
    overlay.classList.add('active');
    mobileMenuBtn.innerHTML = '×';
    body.style.overflow = 'hidden';
  }
}

// Event listeners for menu
mobileMenuBtn.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

// Close menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (navLinks.classList.contains('active')) {
      toggleMenu();
    }
  });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Form submission handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Get form data
    const formData = new FormData(contactForm);
    const message = `Name: ${formData.get('name')}\nEmail: ${formData.get('email')}\nProgram: ${formData.get('program')}\nMessage: ${formData.get('message')}`;
    
    // Open WhatsApp with the message
    const whatsappUrl = `https://wa.me/254717417326?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    contactForm.reset();
  });
}

// Animate stats when in viewport
const stats = document.querySelectorAll('.number');
let animated = false;

function animateStats() {
  if (animated) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animated = true;
        stats.forEach(stat => {
          const target = parseInt(stat.textContent);
          let count = 0;
          const duration = 2000;
          const increment = target / (duration / 16);

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              stat.textContent = target + '+';
              clearInterval(timer);
            } else {
              stat.textContent = Math.floor(count) + '+';
            }
          }, 16);
        });
        observer.disconnect();
      }
    });
  });

  stats.forEach(stat => observer.observe(stat));
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
  animateStats();
});

// Active navigation highlight
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href').slice(1) === current) {
      item.classList.add('active');
    }
  });
});