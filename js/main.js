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

document.addEventListener("DOMContentLoaded", function() {
  const visaCard = document.getElementById("visa-card");

  // Visa info data
  const visaInfo = {
      visit: {
          title: "Visit Visa",
          requirements: "Passport, completed application, proof of accommodation, travel itinerary, etc.",
          assistance: "Our agency assists with documentation, application submission, and interview preparation."
      },
      student: {
          title: "Student Visa",
          requirements: "Acceptance letter, financial proof, passport, completed application, etc.",
          assistance: "We help you compile documents, apply to embassies, and prepare for interviews."
      },
      work: {
          title: "Work Visa",
          requirements: "Employment letter, passport, completed application, health check, etc.",
          assistance: "We guide you through the employer verification process and visa application steps."
      },
      pilgrimage: {
          title: "Pilgrimage Visa",
          requirements: "Passport, proof of faith, travel itinerary, completed application, etc.",
          assistance: "Our agency manages your application and ensures all documents are in place for a smooth process."
      }
  };

  // Show card when a visa type is clicked
  document.querySelectorAll(".dropdown-content a").forEach(link => {
      link.addEventListener("click", function(event) {
          event.preventDefault();
          const visaType = this.getAttribute("data-info");
          const info = visaInfo[visaType];

          // Populate the card with visa details
          visaCard.innerHTML = `
              <h2>${info.title}</h2>
              <p><strong>Requirements:</strong> ${info.requirements}</p>
              <p><strong>How We Help:</strong> ${info.assistance}</p>
          `;

          // Show the card
          visaCard.classList.remove("hidden");
      });
  });
});

