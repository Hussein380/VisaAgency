// Visa requirements data
const visaRequirements = {
    usa: [
      {
        title: "Valid Passport",
        description: "Must be valid for at least 6 months beyond your planned stay",
        required: true
      },
      {
        title: "DS-160 Form",
        description: "Completed Online Nonimmigrant Visa Application",
        required: true
      },
      {
        title: "I-20 Form",
        description: "Certificate of Eligibility for Nonimmigrant Student Status",
        required: true
      },
      {
        title: "Financial Documents",
        description: "Bank statements, sponsor letters, or scholarship proof",
        required: true
      },
      {
        title: "Academic Documents",
        description: "Transcripts, standardized test scores, and certificates",
        required: true
      }
    ],
    uk: [
      {
        title: "Valid Passport",
        description: "Must be valid for the duration of your stay",
        required: true
      },
      {
        title: "CAS Number",
        description: "Confirmation of Acceptance for Studies from your institution",
        required: true
      },
      {
        title: "TB Test Results",
        description: "Tuberculosis test certificate from an approved center",
        required: true
      },
      {
        title: "Financial Evidence",
        description: "Proof of funds to cover tuition and living costs",
        required: true
      }
    ],
    canada: [
      {
        title: "Valid Passport",
        description: "Must be valid for the duration of your stay",
        required: true
      },
      {
        title: "Letter of Acceptance",
        description: "From a Designated Learning Institution (DLI)",
        required: true
      },
      {
        title: "Proof of Funds",
        description: "Evidence of financial support during your study",
        required: true
      },
      {
        title: "Immigration Medical Exam",
        description: "Medical examination results if required",
        required: true
      }
    ],
    australia: [
      {
        title: "Valid Passport",
        description: "Must be valid for your intended stay",
        required: true
      },
      {
        title: "CoE",
        description: "Confirmation of Enrolment from your institution",
        required: true
      },
      {
        title: "Financial Requirements",
        description: "Evidence of sufficient funds for your stay",
        required: true
      },
      {
        title: "Health Insurance",
        description: "Overseas Student Health Cover (OSHC)",
        required: true
      }
    ]
  };
  
  // Initialize page
  document.addEventListener('DOMContentLoaded', () => {
    setupCountrySelection();
    loadRequirements('usa'); // Default country
    setupProgressTracking();
    setupTabSwitching();
  });
  
  // Country selection
  function setupCountrySelection() {
    const countryCards = document.querySelectorAll('.country-card');
    countryCards.forEach(card => {
      card.addEventListener('click', () => {
        countryCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        loadRequirements(card.dataset.country);
      });
    });
  }
  
  // Load requirements
  function loadRequirements(country) {
    const requirementsList = document.getElementById('requirementsList');
    requirementsList.innerHTML = '';
  
    if (!visaRequirements[country]) return;
  
    visaRequirements[country].forEach((req, index) => {
      const item = document.createElement('div');
      item.className = 'requirement-item';
      item.innerHTML = `
        <div class="checkbox-container">
          <input type="checkbox" class="checkbox" id="req${index}">
        </div>
        <div class="requirement-content">
          <div class="requirement-title">${req.title}</div>
          <div class="requirement-description">${req.description}</div>
        </div>
      `;
      requirementsList.appendChild(item);
    });
  
    updateProgress();
  }
  
  // Progress tracking
  function setupProgressTracking() {
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('checkbox')) {
        updateProgress();
      }
    });
  }
  
  function updateProgress() {
    const checkboxes = document.querySelectorAll('.checkbox');
    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    const total = checkboxes.length;
    const progress = (checked / total) * 100;
    
    const progressFill = document.getElementById('progressFill');
    progressFill.style.width = `${progress}%`;
  }
  
  // Tab switching
  function setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        // Add tab content switching logic here
      });
    });
  }