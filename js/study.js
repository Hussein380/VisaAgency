// Form Validation and Submission
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Add FormSubmit action and method
        contactForm.setAttribute('action', 'https://formsubmit.co/huznigarane@gmail.com');
        contactForm.setAttribute('method', 'POST');

        // Add necessary FormSubmit hidden fields
        const hiddenFields = `
            <input type="hidden" name="_subject" value="New Contact Form Submission - Global Study Hub">
            <input type="hidden" name="_captcha" value="true">
            <input type="hidden" name="_template" value="table">
            <input type="hidden" name="_next" value="${window.location.href}#thank-you">
            <input type="hidden" name="_autoresponse" value="Thank you for contacting Global Study Hub. We have received your message and will get back to you soon.">
        `;
        contactForm.insertAdjacentHTML('afterbegin', hiddenFields);

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(this);
            const formDetails = {};
            let isValid = true;

            formData.forEach((value, key) => {
                formDetails[key] = value;
                const input = this.querySelector(`[name="${key}"]`);
                if (!value.trim()) {
                    showError(input, 'This field is required');
                    isValid = false;
                } else {
                    removeError(input);
                }
            });

            if (!validateEmail(formDetails.email)) {
                const emailInput = this.querySelector('[name="email"]');
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }

            if (isValid) {
                // Show loading state
                const submitButton = this.querySelector('.submit-button');
                const originalText = submitButton.textContent;
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';

                // Submit the form
                this.submit();

                // Reset form and button state after submission
                setTimeout(() => {
                    this.reset();
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                    showSuccessMessage('Thank you! Your message has been sent successfully.');
                }, 1000);
            }
        });
    }

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Sticky Navigation
    window.addEventListener('scroll', function () {
        const header = document.querySelector('.header');
        header.classList.toggle('sticky', window.scrollY > 50);
    });

    // Toggle Mobile Menu
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function () {
            navLinks.classList.toggle('show');
            this.textContent = this.textContent === '☰' ? '×' : '☰';
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('show');
                menuToggle.textContent = '☰';
            }
        });
    }

    // Intersection Observer for Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.destination-card, .service-card').forEach(el => {
        observer.observe(el);
    });

    // Close mobile menu when window is resized
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navLinks.classList.contains('show')) {
            navLinks.classList.remove('show');
            menuToggle.textContent = '☰';
        }
    });
});

// Helper Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(input, message) {
    removeError(input); // Remove any existing error first
    const error = document.createElement('span');
    error.className = 'error-message';
    error.textContent = message;
    input.classList.add('error');
    input.parentNode.appendChild(error);
}

function removeError(input) {
    input.classList.remove('error');
    const error = input.parentNode.querySelector('.error-message');
    if (error) error.remove();
}

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(successDiv, form);

    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Prevent form resubmission on page refresh
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// Add smooth scrolling to all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Initialize animations when content is loaded
window.addEventListener('load', function() {
    document.querySelectorAll('.fade-in').forEach(element => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    });
});

