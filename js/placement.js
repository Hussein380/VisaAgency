document.addEventListener('DOMContentLoaded', () => {
    // Update current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Partnership benefits
    const benefits = [
        'Access to a large pool of pre-screened skilled professionals',
        'Streamlined recruitment and certification process',
        'Dedicated support throughout the hiring journey',
        'Cultural integration assistance',
        'Language training programs',
        'Legal compliance guidance'
    ];

    const benefitsList = document.querySelector('.benefits-list');
    benefits.forEach(benefit => {
        const li = document.createElement('li');
        li.innerHTML = `
            <i class="lucide-check-circle"></i>
            <span>${benefit}</span>
        `;
        benefitsList.appendChild(li);
    });

    // Smooth scrolling for anchor links
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
});



document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            navLinks.classList.remove('active');
        }
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
});



document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic form validation
        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const message = form.querySelector('#message').value.trim();

        if (!name || !email || !message) {
            alert('Please fill in all required fields.');
            return;
        }

        if (!isValidEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Here you would typically send the form data to a server
        console.log('Form submitted:', {
            name,
            email,
            phone: form.querySelector('#phone').value.trim(),
            message
        });

        // Clear form
        form.reset();
        alert('Thank you for your message. We will get back to you soon!');
    });

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
});




const testimonials = [
    {
        quote: "The process was smooth and professional. I'm now working in Berlin thanks to TawheedGlobal!",
        name: "John Kamau",
        role: "Software Engineer",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
        quote: "Their cultural orientation program really helped me adapt to life in Germany.",
        name: "Sarah Wanjiku",
        role: "Healthcare Professional",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
        quote: "Finding skilled workers has never been easier. Highly recommended!",
        name: "Michael Schmidt",
        role: "HR Director",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const slidesContainer = document.querySelector('.testimonial-slides');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentSlide = 0;

    // Create slides
    testimonials.forEach((testimonial, index) => {
        const slide = document.createElement('div');
        slide.className = `testimonial-slide ${index === 0 ? 'active' : ''}`;
        slide.innerHTML = `
            <img src="${testimonial.image}" alt="${testimonial.name}">
            <blockquote>${testimonial.quote}</blockquote>
            <p class="name">${testimonial.name}</p>
            <p class="role">${testimonial.role}</p>
        `;
        slidesContainer.appendChild(slide);

        // Create dots
        const dot = document.createElement('button');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    function goToSlide(index) {
        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.dot');

        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');

        currentSlide = index;

        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    // Auto-advance slides
    setInterval(() => {
        goToSlide((currentSlide + 1) % testimonials.length);
    }, 5000);
});