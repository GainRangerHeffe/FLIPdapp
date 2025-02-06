// Landing page translations
const landingTranslations = {
    en: {
        // Basic translations
        title: "FLIPPER GAME $FLIP",
        welcome: "Welcome to the Ultimate Coin Flip Experience",
        testLuck: "Test Your Luck on the Blockchain",
        useFlip: "Use $FLIP, Win Double or Nothing!",
        startButton: "Start Flipping Now",
        
        // Events section
        eventsTitle: "Special Events",
        currentEvent: {
            title: "Valentine's Special 💘",
            description: "Double your love, double your wins! Special Valentine's multipliers active.",
            buttonText: "Join Event"
        },
        upcomingEvents: {
            title: "Coming Soon",
            events: [
                "🍀 St. Patrick's Lucky Flips",
                "🐰 Easter Egg Hunt Edition"
            ]
        },

        // Other sections remain the same
        whyTitle: "Why Choose FLIPPER GAME?",
        features: {
            fair: "Fair Play: Powered by smart contracts for transparent outcomes",
            engaging: "Compete & Win: Track your progress on the leaderboard",
            rewarding: "Instant Rewards: Win double in $FLIP tokens"
        },
        howWorksTitle: "How It Works",
        howWorksSteps: {
            step1: "Connect your wallet to start playing",
            step2: "Approve amount of $FLIP tokens you'll be using",
            step3: "Pick heads or tails",
            step4: "Win double or lose!"
        },
        getFlipTitle: "How to Get $FLIP",
        getFlipSteps: {
            step1: "Get PLS in Rabby or Metamask using ChangeNow or Sparkswap",
            step2: "Copy the $FLIP contract address below",
            step3: "Buy $FLIP on PulseX, 9MM, or Sparkswap (2% slippage)"
        },
        trustTitle: "Verified Contracts",
        copyButton: "Copy Address",
        socialButtons: {
            twitter: "Follow on X",
            telegram: "Join Telegram"
        }
    },
    fr: {
        // French translations follow same structure
        title: "JEU FLIPPER $FLIP",
        welcome: "Bienvenue dans l'Expérience Ultime de Pile ou Face",
        // ... (rest of French translations)
    },
    zh: {
        // Chinese translations follow same structure
        title: "FLIPPER游戏 $FLIP",
        welcome: "欢迎体验终极掷币游戏",
        // ... (rest of Chinese translations)
    }
};

// Helper function to safely update text content
function updateElementText(selector, text) {
    const element = document.querySelector(selector);
    if (element) {
        element.textContent = text;
    } else {
        console.warn(`Element not found: ${selector}`);
    }
}

// Function to update the page content based on selected language
function updatePageLanguage(lang) {
    try {
        // Store the selected language in localStorage
        localStorage.setItem('preferredLanguage', lang);
        
        const t = landingTranslations[lang];
        
        // Update text content
        updateElementText('header h1', t.title);
        updateElementText('header h2', t.welcome);
        
        // Hero section
        updateElementText('.hero h2', t.testLuck);
        updateElementText('.hero p', t.useFlip);
        updateElementText('.hero .button', t.startButton);
        
        // Events section
        updateElementText('.events-section h3', t.eventsTitle);
        updateElementText('.event-card h4', t.currentEvent.title);
        updateElementText('.event-card p', t.currentEvent.description);
        updateElementText('.event-card .event-button', t.currentEvent.buttonText);
        updateElementText('.upcoming-events h4', t.upcomingEvents.title);
        
        // Update social buttons
        const socialButtons = document.querySelectorAll('.social-button');
        if (socialButtons.length >= 2) {
            socialButtons[0].textContent = t.socialButtons.twitter;
            socialButtons[1].textContent = t.socialButtons.telegram;
        }
        
        // Features section
        updateElementText('.features h3', t.whyTitle);
        const featuresList = document.querySelectorAll('.features li p');
        if (featuresList.length >= 3) {
            featuresList[0].textContent = t.features.fair;
            featuresList[1].textContent = t.features.engaging;
            featuresList[2].textContent = t.features.rewarding;
        }
        
        // Update other sections...
        // (How it works, How to get FLIP, etc.)
        
    } catch (error) {
        console.error('Error updating page language:', error);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Set up language selector
    const langSelector = document.getElementById('langSelector');
    if (langSelector) {
        const savedLang = localStorage.getItem('preferredLanguage') || 'en';
        langSelector.value = savedLang;
        updatePageLanguage(savedLang);
        
        langSelector.addEventListener('change', (e) => {
            updatePageLanguage(e.target.value);
        });
    }

    // Add click handlers for copy buttons
    const copyButtons = document.querySelectorAll('[id^="copyButton"]');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.previousElementSibling.id;
            copyToClipboard(targetId);
        });
    });
    
    // Add event listeners for event buttons
    const eventButtons = document.querySelectorAll('.event-button');
    eventButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (!window.ethereum) {
                alert('Please install a Web3 wallet to participate in events!');
                return;
            }
            handleEventRegistration();
        });
    });
});

// Handle event registration
async function handleEventRegistration() {
    try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const userAddress = accounts[0];

        // Example registration logic - replace with actual contract interaction
        console.log(`Registering ${userAddress} for event`);
        
        // Show registration confirmation
        alert('Successfully registered for event! Check your wallet for transaction confirmation.');
        
        // Update button state
        const eventButton = document.querySelector('.event-button');
        if (eventButton) {
            eventButton.textContent = 'Registered';
            eventButton.disabled = true;
        }
    } catch (error) {
        console.error('Error registering for event:', error);
        alert('Failed to register for event. Please try again.');
    }
}

// Copy to clipboard functionality
function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert('Address copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}
