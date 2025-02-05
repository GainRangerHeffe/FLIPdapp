// Landing page translations
const landingTranslations = {
    en: {
        title: "FLIPPER GAME $FLIP",
        welcome: "Welcome to the Ultimate Coin Flip Experience",
        testLuck: "Test Your Luck on the Blockchain",
        useFlip: "Use $FLIP, Win Double or Nothing!",
        startButton: "Start Flipping Now",
        whyTitle: "Why FLIPPER GAME?",
        features: {
            fair: "Fair: Powered by smart contracts for transparent outcomes.",
            engaging: "Engaging: Compete on the leaderboard, see how you rank against others.",
            rewarding: "Rewarding: Earn $FLIP tokens with each successful flip!"
        },
        howWorksTitle: "How It Works",
        howWorksSteps: {
            step1: "Connect Your Wallet",
            step2: "Approve the amount of tokens you want to play with",
            step3: "Pick heads or tails",
            step4: "Watch the Coin Flip and Win or Lose"
        },
        getFlipTitle: "How to Get $FLIP",
        getFlipSteps: {
            step1: "Get PLS in Rabby or Metamask. Use ChangeNow or Sparkswap to bridge.",
            step2: "Copy the $FLIP contract address from this page and enter it into the dex of your choice",
            step3: "Buy $FLIP on PulseX, 9MM, or sparkswap with PLS. Set Slippage to 2%"
        },
        communityTitle: "Community & Support",
        joinCommunity: "Join our community:",
        needHelp: "Need help? Join our Telegram group for assistance!",
        transparencyTitle: "Transparency & Trust",
        contractAddresses: {
            flip: "FLIP Token Address:",
            game: "Game Contract Address:"
        },
        copyButton: "Copy",
        learnMore: "Learn More",
        aboutFlip: "About $FLIP Token",
        disclaimer: "Disclaimer"
    },
    fr: {
        title: "JEU FLIPPER $FLIP",
        welcome: "Bienvenue dans l'Expérience Ultime de Pile ou Face",
        testLuck: "Testez Votre Chance sur la Blockchain",
        useFlip: "Utilisez $FLIP, Doublez ou Perdez Tout!",
        startButton: "Commencer à Jouer",
        whyTitle: "Pourquoi FLIPPER GAME ?",
        features: {
            fair: "Équitable : Propulsé par des contrats intelligents pour des résultats transparents.",
            engaging: "Captivant : Participez au classement, comparez-vous aux autres.",
            rewarding: "Récompensant : Gagnez des jetons $FLIP à chaque lancer réussi !"
        },
        howWorksTitle: "Comment Ça Marche",
        howWorksSteps: {
            step1: "Connectez Votre Portefeuille",
            step2: "Approuvez le montant de jetons avec lesquels vous voulez jouer",
            step3: "Choisissez pile ou face",
            step4: "Regardez la Pièce Tourner et Gagnez ou Perdez"
        },
        getFlipTitle: "Comment Obtenir $FLIP",
        getFlipSteps: {
            step1: "Obtenez PLS dans Rabby ou Metamask. Utilisez ChangeNow ou Sparkswap pour le bridge.",
            step2: "Copiez l'adresse du contrat $FLIP et entrez-la dans le dex de votre choix",
            step3: "Achetez $FLIP sur PulseX, 9MM, ou sparkswap avec PLS. Réglez le Slippage à 2%"
        },
        communityTitle: "Communauté & Support",
        joinCommunity: "Rejoignez notre communauté :",
        needHelp: "Besoin d'aide ? Rejoignez notre groupe Telegram !",
        transparencyTitle: "Transparence & Confiance",
        contractAddresses: {
            flip: "Adresse du Token FLIP :",
            game: "Adresse du Contrat de Jeu :"
        },
        copyButton: "Copier",
        learnMore: "En Savoir Plus",
        aboutFlip: "À Propos du Token $FLIP",
        disclaimer: "Avertissement"
    },
    zh: {
        title: "FLIPPER游戏 $FLIP",
        welcome: "欢迎体验终极掷币游戏",
        testLuck: "在区块链上测试你的运气",
        useFlip: "使用 $FLIP，赢双倍或全输！",
        startButton: "立即开始",
        whyTitle: "为什么选择 FLIPPER GAME？",
        features: {
            fair: "公平：由智能合约驱动，确保结果透明。",
            engaging: "有趣：参与排行榜竞争，查看您的排名。",
            rewarding: "有奖励：每次成功都能赚取 $FLIP 代币！"
        },
        howWorksTitle: "游戏规则",
        howWorksSteps: {
            step1: "连接您的钱包",
            step2: "批准您想要使用的代币数量",
            step3: "选择正面或反面",
            step4: "观看硬币翻转并赢取奖励"
        },
        getFlipTitle: "如何获取 $FLIP",
        getFlipSteps: {
            step1: "在 Rabby 或 Metamask 中获取 PLS。使用 ChangeNow 或 Sparkswap 进行转换。",
            step2: "从此页面复制 $FLIP 合约地址并输入到您选择的交易所",
            step3: "使用 PLS 在 PulseX、9MM 或 sparkswap 上购买 $FLIP。滑点设置为 2%"
        },
        communityTitle: "社区与支持",
        joinCommunity: "加入我们的社区：",
        needHelp: "需要帮助？加入我们的 Telegram 群！",
        transparencyTitle: "透明度与信任",
        contractAddresses: {
            flip: "FLIP 代币地址：",
            game: "游戏合约地址："
        },
        copyButton: "复制",
        learnMore: "了解更多",
        aboutFlip: "关于 $FLIP 代币",
        disclaimer: "免责声明"
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
        
        // Update text content only if elements exist
        // Header section
        updateElementText('header h1', t.title);
        updateElementText('header h2', t.welcome);
        
        // Hero section
        updateElementText('.hero h2', t.testLuck);
        const heroP = document.querySelector('.hero p');
        if (heroP) heroP.textContent = t.useFlip;
        
        const startButton = document.querySelector('.hero .button');
        if (startButton) startButton.textContent = t.startButton;
        
        // Features section
        updateElementText('.features h3', t.whyTitle);
        const featuresList = document.querySelector('.features ul');
        if (featuresList) {
            featuresList.innerHTML = `
                <li><p>${t.features.fair}</p></li>
                <li><p>${t.features.engaging}</p></li>
                <li><p>${t.features.rewarding}</p></li>
            `;
        }
        
        // How It Works section
        updateElementText('.how-it-works h3', t.howWorksTitle);
        const howItWorksSteps = document.querySelectorAll('.how-it-works .step p');
        if (howItWorksSteps.length >= 4) {
            howItWorksSteps[0].textContent = t.howWorksSteps.step1;
            howItWorksSteps[1].textContent = t.howWorksSteps.step2;
            howItWorksSteps[2].textContent = t.howWorksSteps.step3;
            howItWorksSteps[3].textContent = t.howWorksSteps.step4;
        }
        
        // How to Get FLIP section
        updateElementText('.how-to-get-flip h3', t.getFlipTitle);
        const getFlipSteps = document.querySelectorAll('.how-to-get-flip .step p');
        if (getFlipSteps.length >= 3) {
            getFlipSteps[0].textContent = t.getFlipSteps.step1;
            getFlipSteps[1].textContent = t.getFlipSteps.step2;
            getFlipSteps[2].textContent = t.getFlipSteps.step3;
        }
        
        // Community section
        updateElementText('.community h3', t.communityTitle);
        updateElementText('.community > p', t.joinCommunity);
        
        // Trust section
        updateElementText('.trust h3', t.transparencyTitle);
        const copyButtons = document.querySelectorAll('.contract-box button');
        copyButtons.forEach(button => {
            button.textContent = t.copyButton;
        });

    } catch (error) {
        console.error('Error updating page language:', error);
    }
}

// Add event listener for language selector
document.addEventListener('DOMContentLoaded', () => {
    const langSelector = document.getElementById('langSelector');
    if (langSelector) {
        // Set initial language from localStorage or default to 'en'
        const savedLang = localStorage.getItem('preferredLanguage') || 'en';
        langSelector.value = savedLang;
        updatePageLanguage(savedLang);

        // Add change event listener
        langSelector.addEventListener('change', (e) => {
            updatePageLanguage(e.target.value);
        });
    }
});

// Copy to clipboard functionality
function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert('Address copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Initialize copy buttons
document.addEventListener('DOMContentLoaded', () => {
    // Add click handlers for copy buttons
    const copyButtons = document.querySelectorAll('[id^="copyButton"]');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.previousElementSibling.id;
            copyToClipboard(targetId);
        });
    });
});