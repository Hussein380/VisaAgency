// script.js
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chatbot = document.getElementById('chatbot');
    const chatToggle = document.getElementById('chatToggle');
    const closeChat = document.getElementById('closeChat');
    const minimizeChat = document.getElementById('minimizeChat');
    const sendButton = document.getElementById('sendButton');
    const userInput = document.getElementById('userInput');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const typingIndicator = document.getElementById('typingIndicator');

    // Initial welcome message
    setTimeout(() => {
        addMessage('bot', 'Hello! 👋 I\'m Huzni ai, your Visa Assistant. How can I help you today?');
    }, 500);

    // Event Listeners
    chatToggle.addEventListener('click', toggleChat);
    closeChat.addEventListener('click', closeChatbot);
    minimizeChat.addEventListener('click', minimizeChatbot);
    sendButton.addEventListener('click', handleUserMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });

    // Toggle chat visibility
    function toggleChat() {
        chatbot.classList.toggle('active');
        chatToggle.style.display = chatbot.classList.contains('active') ? 'none' : 'block';
    }

    // Close chatbot
    function closeChatbot() {
        chatbot.classList.remove('active');
        chatToggle.style.display = 'block';
    }

    // Minimize chatbot
    function minimizeChatbot() {
        chatbot.classList.remove('active');
        chatToggle.style.display = 'block';
    }

    // Handle user message
    async function handleUserMessage() {
        const userText = userInput.value.trim();
        if (!userText) return;

        // Add user message
        addMessage('user', userText);
        userInput.value = '';

        // Show typing indicator
        typingIndicator.classList.remove('hidden');

        // Simulate bot thinking
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        // Hide typing indicator and add bot response
        typingIndicator.classList.add('hidden');
        const botResponse = generateResponse(userText.toLowerCase());
        addMessage('bot', botResponse);
    }

    // Add message to chat
    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = text;
        
        messageDiv.appendChild(messageContent);
        chatbotMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Generate bot response
    function generateResponse(userText) {
        const responses = {
            visa: {
                keywords: ['visa', 'application', 'apply'],
                response: `Here's how you can apply for a visa:
1. Complete the online application form
2. Pay the visa fee
3. Schedule your visa interview
4. Submit required documents

Would you like specific information about any of these steps?`
            },
            documents: {
                keywords: ['documents', 'requirements', 'need'],
                response: `Required documents for visa application:
• Valid passport (6+ months validity)
• Completed visa application form
• Recent passport photos
• Proof of financial means
• Travel itinerary
• Accommodation proof

Need more details about any specific document?`
            },
            processing: {
                keywords: ['processing', 'time', 'long', 'wait'],
                response: `Current visa processing times:
• Tourist visa: 5-10 business days
• Student visa: 2-3 weeks
• Work visa: 3-4 weeks
• Business visa: 1-2 weeks

Note: Times may vary based on application volume.`
            },
            fees: {
                keywords: ['fee', 'cost', 'price', 'payment'],
                response: `Visa fees vary by type:
• Tourist visa: consult our expert via contact page in the website 
• Student visa: consult our expert via contact page in the website
• Work visa: consult our expert via contact page in the website

• Business visa: consult our expert via contact page in the website

Would you like information about payment methods?`
            },
            consultation: {
                keywords: ['consult', 'expert', 'advice', 'help'],
                response: `I'd be happy to help you schedule a free consultation with our visa experts!

Our consultants are available:
• Monday-Friday: 9 AM - 5 PM
• Weekend appointments available on request

Would you like to schedule a consultation?`
            }
        };

        // Check for matching keywords
        for (const category in responses) {
            if (responses[category].keywords.some(keyword => userText.includes(keyword))) {
                return responses[category].response;
            }
        }

        // Default response
        return `I apologize, but I'm not sure about that.contact our suppor or  Could you please rephrase your question? I'm here to help with:

• Visa applications
• Document requirements
• Processing times
• Fees and payments
• Expert consultations`;
    }
});