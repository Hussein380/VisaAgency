



// Mobile Menu Toggle
        function toggleMobileMenu() {
            const navLinks = document.getElementById('navLinks');
            navLinks.classList.toggle('active');
        }


        // Others Dialog
        function showOthersDialog() {
            alert("Additional Services:\n- Hotel Booking\n- Guide Services\n- Study Abroad");
        }


// Enhanced questions array with topics and weights
const questions = [
    {
        topic: "Travel Plans",
        question: "When are you planning to travel?",
        options: [
            { text: "Within 1 month", score: 10 },
            { text: "1-3 months from now", score: 20 },
            { text: "3-6 months from now", score: 40 },
            { text: "More than 6 months away", score: 50 },
            { text: "Just exploring options", score: 20 }
        ],
        tip: "Earlier planning gives us more time to strengthen your application!",
        weight: 1.2
    },
    {
        topic: "Passport Status",
        question: "Do you have a valid passport?",
        options: [
            { text: "Yes, valid for more than 2 years", score: 70 },
            { text: "Yes, valid for 1-2 years", score: 40 },
            { text: "Yes, but expires soon", score: 10 },
            { text: "No passport yet", score: 0 },
            { text: "In process", score: 30 }
        ],
        tip: "Don't worry if your passport is expiring - we can help fast-track renewal!",
        weight: 1.8
    },
    {
        topic: "Visit Purpose",
        question: "Reason for travelling abroad?",
        options: [
            { text: "Tourism/Holiday", score: 60 },
            { text: "Business/Conference", score: 90 },
            { text: "Family Visit", score: 50 },
            { text: "Medical", score: 54 },
            { text: "Education", score: 70 }
        ],
        tip: "Each purpose has unique opportunities - let us guide you to the best approach!",
        weight: 1.4
    },
    {
        topic: "Financial Readiness",
        question: "Select what applies to you:",
        options: [
            { text: "Regular income", score: 30 },
            { text: "Business owner", score: 50 },
            { text: "Property owner", score: 54 },
            { text: "Savings", score: 85 },
            { text: "Family support available", score: 60 }
        ],
        tip: "There are many ways to meet financial requirements - we'll show you how!",
        weight: 1.9
    },
    {
        topic: "Travel Experience",
        question: "Have you traveled abroad before?",
        options: [
            { text: "Yes, multiple times", score: 70 },
            { text: "Yes, once", score: 30 },
            { text: "No, this is my first time", score: 20 },
            { text: "Had visa issues before", score: 5 }
        ],
        tip: "First-time traveler? We specialize in helping you start your journey!",
        weight: 1.6
    }
];



let currentQuestion = 0;
let userAnswers = [];
let userSelections = []; // Store actual selections for personalized tips



// Initialize the quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startQuizButton');
    if (startButton) {
        startButton.addEventListener('click', startQuiz);
    }
});


function startQuiz() {
    document.getElementById('introductionSection').style.display = 'none';
    document.getElementById('progressBarContainer').style.display = 'block';
    document.getElementById('questionContainer').style.display = 'block';
    showQuestion();
}

function showQuestion() {
    const question = questions[currentQuestion];
    const questionContainer = document.getElementById('questionContainer');
    const optionsContainer = questionContainer.querySelector('.options-container');
    const tipContainer = questionContainer.querySelector('.tip-text');
    
    // Update progress
    const progress = (currentQuestion / questions.length) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
    document.getElementById('currentQuestionNumber').textContent = currentQuestion + 1;
    
    // Update topic
    const topicElement = document.getElementById('currentTopic');
    topicElement.textContent = question.topic;
    
    // Set question text with animation
    const questionText = questionContainer.querySelector('.question-text');
    questionText.style.opacity = '0';
    questionText.textContent = question.question;
    setTimeout(() => {
        questionText.style.opacity = '1';
    }, 100);

    // Clear and populate options with animation
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option.text;
        button.style.opacity = '0';
        button.onclick = () => selectAnswer(index, option.text);
        optionsContainer.appendChild(button);
        setTimeout(() => {
            button.style.opacity = '1';
        }, 100 + (index * 100));
    });

    // Set tip text with animation
    tipContainer.style.opacity = '0';
    tipContainer.textContent = question.tip;
    setTimeout(() => {
        tipContainer.style.opacity = '1';
    }, 600);
}


function selectAnswer(optionIndex, optionText) {
    const question = questions[currentQuestion];
    const selectedOption = question.options[optionIndex];
    
    userAnswers.push(selectedOption.score);
    userSelections.push({
        topic: question.topic,
        question: question.question,
        answer: optionText,
        score: selectedOption.score,
        weight: question.weight
    });
    
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        showResult();
    }
}


// Enhanced score calculation
// Enhanced score calculation with critical factors

// Enhanced score calculation with multiple critical factors
function calculateScore() {
    if (userAnswers.length === 0) return 0;
    
    let criticalIssues = [];
    let weightedSum = 0;
    let weightSum = 0;
    
    userSelections.forEach((selection, index) => {
        const question = questions[index];
        const selectedOption = question.options.find(opt => opt.text === selection.answer);
        
        // Track critical issues
        if (selectedOption.isCritical) {
            criticalIssues.push({
                topic: question.topic,
                reason: selectedOption.criticalReason,
                score: selectedOption.score
            });
        }
        
        weightedSum += selectedOption.score * question.weight;
        weightSum += question.weight;
    });
    
    let finalScore = Math.round(weightedSum / weightSum);
    
    // Apply penalties for critical issues
    if (criticalIssues.length > 0) {
        // Severe penalty for multiple critical issues
        if (criticalIssues.length >= 2) {
            finalScore = Math.min(finalScore, 30);
        } else {
            // Single critical issue penalty
            finalScore = Math.min(finalScore, 40);
        }
        
        // Additional penalties for severe issues
        criticalIssues.forEach(issue => {
            if (issue.score === 0) {
                finalScore = Math.min(finalScore, 20); // Cap at 20 for zero-score issues
            }
        });
    }
    
    return finalScore;
}
    
// Enhanced personalized tips generation
function generatePersonalizedTips() {
    const tips = [];
    const criticalIssues = [];
    const recommendations = [];
    
    userSelections.forEach(selection => {
        const question = questions.find(q => q.topic === selection.topic);
        const selectedOption = question.options.find(opt => opt.text === selection.answer);
        
        if (selectedOption.isCritical) {
            criticalIssues.push({
                topic: question.topic,
                reason: selectedOption.criticalReason,
                severity: selectedOption.score === 0 ? "SEVERE" : "HIGH"
            });
        }
        
        // Generate specific recommendations
        if (selection.score < 70) {
            switch(selection.topic) {
                case "Passport Status":
                    recommendations.push("📘 Priority: Process/renew passport immediately");
                    break;
                case "Financial Documentation":
                    recommendations.push("💰 Maintain consistent bank balance for 6+ months");
                    recommendations.push("📊 Prepare income proof and financial statements");
                    break;
                case "Employment Status":
                    recommendations.push("👔 Obtain detailed employment documentation");
                    recommendations.push("📜 Get salary slips for last 6 months");
                    break;
                case "Travel Purpose Documentation":
                    recommendations.push("📋 Complete documentation checklist for your visa type");
                    recommendations.push("📑 Prepare purpose-specific supporting documents");
                    break;
                case "Immigration History":
                    recommendations.push("⚠️ Prepare explanation letter for previous issues");
                    recommendations.push("🔍 Consider legal consultation for complex cases");
                    break;
            }
        }
    });
    
    // Format critical issues
    if (criticalIssues.length > 0) {
        tips.push("🚫 CRITICAL ISSUES REQUIRING IMMEDIATE ATTENTION:");
        criticalIssues.forEach(issue => {
            tips.push(`  • ${issue.severity} RISK - ${issue.topic}: ${issue.reason}`);
        });
    }
    
    // Add recommendations
    if (recommendations.length > 0) {
        tips.push("\n📝 RECOMMENDED ACTIONS:");
        recommendations.forEach(rec => tips.push(`  • ${rec}`));
    }
    
    return tips;
}


function showResult() {
    const finalScore = calculateScore();
    const tips = generatePersonalizedTips();
    
    document.getElementById('questionContainer').style.display = 'none';
    document.getElementById('progressBarContainer').style.display = 'none';
    document.getElementById('resultContainer').style.display = 'block';

    // Animate score
    animateScore(finalScore);
    
    // Set detailed result message based on score ranges
    const resultMessage = document.getElementById('resultMessage');
    if (finalScore >= 80) {
        resultMessage.innerHTML = `
            <div class="result-card high-score">
                <h3>Strong Visa Potential! 🌟</h3>
                <p>Your profile shows good eligibility. Schedule a consultation to review documentation and strengthen your application further.</p>
                <div class="next-steps">
                    <h4>Recommended Next Steps:</h4>
                    <ul>
                        <li>Document collection and verification</li>
                        <li>Application strategy planning</li>
                        <li>Pre-submission review</li>
                    </ul>
                </div>
            </div>
        `;
    } else if (finalScore >= 60) {
        resultMessage.innerHTML = `
            <div class="result-card medium-score">
                <h3>Preparation Required 🔄</h3>
                <p>Your profile needs improvements in key areas. Our experts can help address concerns and enhance your eligibility.</p>
                <div class="action-items">
                    <h4>Priority Actions Needed:</h4>
                    <ul>
                        <li>Address documentation gaps</li>
                        <li>Strengthen weak areas</li>
                        <li>Develop mitigation strategies</li>
                    </ul>
                </div>
            </div>
        `;
    } else {
        resultMessage.innerHTML = `
            <div class="result-card low-score">
                <h3>Critical Issues Detected ⚠️</h3>
                <p>Your profile has significant challenges that need immediate attention. Consultation recommended to assess options and develop an action plan.</p>
                <div class="urgent-actions">
                    <h4>Urgent Actions Required:</h4>
                    <ul>
                        <li>Address critical eligibility issues</li>
                        <li>Evaluate alternative options</li>
                        <li>Comprehensive application review</li>
                    </ul>
                </div>
            </div>
        `;
    }

    // Show personalized tips
    const tipsList = document.getElementById('tipsList');
    tipsList.innerHTML = tips.map(tip => `<li>${tip}</li>`).join('');
}

// Improved number animation

function animateScore(finalScore) {
    const scoreElement = document.getElementById('scoreNumber');
    const duration = 1500;
    const steps = 60;
    const increment = finalScore / steps;
    let currentValue = 0;
    let step = 0;

    const animation = setInterval(() => {
        step++;
        currentValue += increment;
        
        if (step >= steps) {
            clearInterval(animation);
            currentValue = finalScore;
        }
        
        scoreElement.textContent = Math.round(currentValue);
        
        // Also update the circle progress
        const circle = document.querySelector('.score-circle circle.progress');
        const circumference = 2 * Math.PI * 58; // r=58 from the SVG
        const offset = circumference - (currentValue / 100) * circumference;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = offset;
    }, duration / steps);
}




// Enhanced feedback generation based on groups
function generateStrengthsList(selections) {
    let strengths = [];
    selections.forEach(selection => {
        const question = questions.find(q => q.question === selection.question);
        const option = question.options.find(opt => opt.text === selection.answer);
        if (selection.score >= 80) {
            strengths.push(`<li><i class="fas fa-check"></i> ${question.group}: ${option.feedback}</li>`);
        }
    });
    return strengths.join('');
}

// Add this to your existing script.js
function initTheme() {
    // Check for saved theme preference, default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}



// Generate specific improvement suggestions
function generateImprovementsList(selections) {
    let improvements = [];
    selections.forEach(selection => {
        const question = questions.find(q => q.question === selection.question);
        const option = question.options.find(opt => opt.text === selection.answer);
        if (selection.score < 80) {
            improvements.push(`<li><i class="fas fa-arrow-up"></i> ${question.group}: ${option.feedback}</li>`);
        }
    });
    return improvements.join('');
}

// Generate actionable steps
function generateActionPlan(selections) {
    let actions = [];
    selections.forEach(selection => {
        const question = questions.find(q => q.question === selection.question);
        const option = question.options.find(opt => opt.text === selection.answer);
        if (selection.score < 70) {
            actions.push(`<li><i class="fas fa-tasks"></i> ${question.group}: Let's work on ${option.feedback.toLowerCase()}</li>`);
        }
    });
    return actions.join('');
}

function bookConsultation() {
    // Implement booking functionality
    window.location.href = '/book-consultation';
}

function startWhatsAppChat() {
    // Implement WhatsApp chat functionality
    window.open('https://wa.me/your-number', '_blank');
}

function sendEmailQuery() {
    // Implement email functionality
    window.location.href = 'mailto:your@email.com';
}

function restartQuiz() {
    currentQuestion = 0;
    userAnswers = [];
    userSelections = [];
    document.getElementById('resultContainer').style.display = 'none';
    document.getElementById('introductionSection').style.display = 'block';
}

// Initialize theme when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    
    // Add event listener to theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
});


const CONTACT_INFO = {
    whatsapp: "254725996394",
    email: "huznigarane@gmail.com",
};



function startWhatsAppChat() {
    const message = encodeURIComponent("Hello! I took the visa readiness test and would like to learn more about your services.");
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}?text=${message}`, '_blank');
}

function sendEmailQuery() {
    const subject = encodeURIComponent("Visa Application Query");
    const body = encodeURIComponent("Hello,\n\nI took the visa readiness test and would like to learn more about your services.");
    window.location.href = `mailto:${CONTACT_INFO.email}?subject=${subject}&body=${body}`;
}

