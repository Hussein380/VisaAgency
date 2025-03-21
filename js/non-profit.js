// Project data
const projects = [
    {
      id: 1,
      title: "Scholars Connect",
      description: "Connecting scholars worldwide using our platoform, fostering academic collaboration and knowledge sharing across borders.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200",
    
      url: "./mentors-connect/index.html" 
    },

  ];
  
  // Flashcard data
  const flashcards = [
    {
      question: "What is Scholars Connect?",
      answer: "Scholars Connect is a platform that connects students with international scholars, providing mentorship, scholarship opportunities, and academic guidance."
    },
    {
      question: "What opportunities does Scholars Connect offer?",
      answer: "The platform offers scholarship referrals, internship opportunities, mentorship programs, and direct connections with experienced scholars from around the world."
    },
    {
      question: "How does Scholars Connect help students?",
      answer: "It helps students by providing personalized guidance, access to international opportunities, and a supportive community of scholars who share knowledge and experiences."
    },
    {
      question: "What makes Scholars Connect unique?",
      answer: "Its architecture enables real-time connections, personalized matching with mentors, and a seamless experience for both students and scholars."
    }
  ];
  
  let currentCardIndex = 0;
  
  // Function to create project cards
  function createProjectCard(project) {
    return `
      <article class="project-card">
        <div class="project-image">
          <img src="${project.image}" alt="${project.title}" loading="lazy">
        </div>
        <div class="project-content">
          <h3 class="project-title">${project.title}</h3>
          <p class="project-description">${project.description}</p>
          <a href="${project.url}" class="project-link" target="_blank" rel="noopener noreferrer">
            View Live
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
      </article>
    `;
  }
  
  // Function to show flashcard modal
  function showFlashcardModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Learn About Scholars Connect</h2>
          <button class="close-modal">&times;</button>
        </div>
        <div class="flashcard">
          <div class="flashcard-inner">
            <div class="flashcard-front">
              <p>${flashcards[currentCardIndex].question}</p>
            </div>
            <div class="flashcard-back">
              <p>${flashcards[currentCardIndex].answer}</p>
            </div>
          </div>
        </div>
        <div class="flashcard-controls">
          <button class="flashcard-btn" id="prevCard" ${currentCardIndex === 0 ? 'disabled' : ''}>Previous</button>
          <span class="card-counter">${currentCardIndex + 1}/${flashcards.length}</span>
          <button class="flashcard-btn" id="nextCard" ${currentCardIndex === flashcards.length - 1 ? 'disabled' : ''}>Next</button>
        </div>
      </div>
    `;
  
    document.body.appendChild(modal);
  
    // Event listeners
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => modal.remove());
  
    const flashcard = modal.querySelector('.flashcard');
    const flashcardInner = flashcard.querySelector('.flashcard-inner');
    
    flashcard.addEventListener('click', () => {
      flashcardInner.classList.toggle('is-flipped');
      flashcard.classList.toggle('is-flipped');
    });
  
    const prevBtn = modal.querySelector('#prevCard');
    const nextBtn = modal.querySelector('#nextCard');
  
    prevBtn.addEventListener('click', () => {
      if (currentCardIndex > 0) {
        currentCardIndex--;
        updateFlashcard(modal);
      }
    });
  
    nextBtn.addEventListener('click', () => {
      if (currentCardIndex < flashcards.length - 1) {
        currentCardIndex++;
        updateFlashcard(modal);
      }
    });
  
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }
  
  // Function to update flashcard content
  function updateFlashcard(modal) {
    const flashcard = modal.querySelector('.flashcard');
    const flashcardInner = flashcard.querySelector('.flashcard-inner');
    const flashcardFront = modal.querySelector('.flashcard-front p');
    const flashcardBack = modal.querySelector('.flashcard-back p');
    const cardCounter = modal.querySelector('.card-counter');
    const prevBtn = modal.querySelector('#prevCard');
    const nextBtn = modal.querySelector('#nextCard');
  
    flashcardFront.textContent = flashcards[currentCardIndex].question;
    flashcardBack.textContent = flashcards[currentCardIndex].answer;
    cardCounter.textContent = `${currentCardIndex + 1}/${flashcards.length}`;
  
    // Reset flip state
    flashcardInner.classList.remove('is-flipped');
    flashcard.classList.remove('is-flipped');
  
    // Update button states
    prevBtn.disabled = currentCardIndex === 0;
    nextBtn.disabled = currentCardIndex === flashcards.length - 1;
  }
  
  // Initialize the page
  function initializePage() {
    const projectsGrid = document.getElementById('projectsGrid');
    projectsGrid.innerHTML = projects.map(project => createProjectCard(project)).join('');
  
    // Add learn more button click handler
    const learnMoreBtn = document.querySelector('.hero-cta .btn');
    learnMoreBtn.addEventListener('click', showFlashcardModal);
  
    // Add intersection observer for animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });
  
    // Observe all project cards
    document.querySelectorAll('.project-card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'all 0.6s ease-out';
      observer.observe(card);
    });
  }
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', initializePage);