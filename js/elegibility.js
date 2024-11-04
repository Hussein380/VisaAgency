
// Close modal
function closeModal() {
    modal.style.display = 'none';
}

// Restart checker
function restartChecker() {
    currentQuestion = 0;
    answers = {};
    showQuestion();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeChecker);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});