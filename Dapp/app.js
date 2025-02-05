// Web3 initialization
if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("https://pulsechain-rpc.publicnode.com"));
}

let currentAccount;
let flipTokenAddress = "0xECAD2D1e7d5932F19B13fB207581AB9033c710C4"; // FLIP token address
let gameContractAddress = "0xD2987B95dBEB4a63C9e206b6CC83b441E5076246"; // Game contract address
let lastCheckedBlock = '0';
const BLOCKS_TO_CHECK = 100;

function convertBlockchainValue(value) {
    if (value === null || value === undefined) return '0';
    return value.toString();
}

// Improved safe number conversion
function safeNumber(value) {
    try {
        // Handle undefined/null
        if (value === undefined || value === null) return 0;
        
        // Already a number
        if (typeof value === 'number') return value;
        
        // Handle BigInt
        if (typeof value === 'bigint') return Number(value);
        
        // Handle string values
        if (typeof value === 'string') {
            // Remove any decimals for BigInt conversion
            const [whole] = value.split('.');
            return Number(whole);
        }
        
        // If it's an object or array, convert to string first
        return Number(value.toString());
    } catch (error) {
        console.error('Error in safeNumber conversion:', error);
        return 0;
    }
}

function safeToString(value) {
    try {
        if (value === undefined || value === null) return '0';
        if (typeof value === 'string') return value;
        if (typeof value === 'number') return value.toString();
        if (typeof value === 'bigint') return value.toString();
        if (typeof value === 'object') return value.toString();
        return '0';
    } catch (error) {
        console.error('Error in safeToString conversion:', error);
        return '0';
    }
}

const translations = {
    en: {
        connectWallet: "Connect Wallet",
        disconnectWallet: "Disconnect Wallet",
        approveTokens: "Approve Tokens",
        betHeads: "Heads",
        betTails: "Tails",
        makeChoice: "Make your Choice:",
        currentBalance: "Current FLIP Balance:",
        enterAmount: "Enter FLIP amount",
        walletAddress: "Wallet Address:",
        yourStats: "Your Stats",
        gamesPlayed: "Games Played",
        wins: "Wins",
        winRate: "Win Rate",
        totalBet: "Total FLIP Bet",
        latestResults: "Latest Results",
        topPlayers: "Top Players",
        games: "Games",
        noGames: "No games played yet"
    },
    fr: {
        connectWallet: "Connecter le Portefeuille",
        disconnectWallet: "Déconnecter le Portefeuille",
        approveTokens: "Approuver les Jetons",
        betHeads: "Face",
        betTails: "Pile",
        makeChoice: "Faites votre Choix:",
        currentBalance: "Solde FLIP Actuel:",
        enterAmount: "Entrez le montant FLIP",
        walletAddress: "Adresse du Portefeuille:",
        yourStats: "Vos Statistiques",
        gamesPlayed: "Parties Jouées",
        wins: "Victoires",
        winRate: "Taux de Victoire",
        totalBet: "Total FLIP Parié",
        latestResults: "Derniers Résultats",
        topPlayers: "Meilleurs Joueurs",
        games: "Parties",
        noGames: "Aucune partie jouée"
    },
    zh: {
        connectWallet: "连接钱包",
        disconnectWallet: "断开钱包",
        approveTokens: "批准代币",
        betHeads: "正面",
        betTails: "反面",
        makeChoice: "做出选择：",
        currentBalance: "当前FLIP余额：",
        enterAmount: "输入FLIP金额",
        walletAddress: "钱包地址：",
        yourStats: "您的统计",
        gamesPlayed: "已玩游戏",
        wins: "获胜",
        winRate: "胜率",
        totalBet: "总计下注FLIP",
        latestResults: "最新结果",
        topPlayers: "顶级玩家",
        games: "游戏",
        noGames: "尚未玩过游戏"
    }
};



// Your existing ABIs (keep as they are)
const flipABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "allowance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
            }
        ],
        "name": "ERC20InsufficientAllowance",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
            }
        ],
        "name": "ERC20InsufficientBalance",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "approver",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidApprover",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidReceiver",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidSender",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidSpender",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "newAddress",
                "type": "address"
            }
        ],
        "name": "NoTaxAddressUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "pair",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "isPairStatus",
                "type": "bool"
            }
        ],
        "name": "PairUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "taxAmount",
                "type": "uint256"
            }
        ],
        "name": "TaxCollected",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newBuyTax",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newSellTax",
                "type": "uint256"
            }
        ],
        "name": "TaxPercentageUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "newTaxWallet",
                "type": "address"
            }
        ],
        "name": "TaxWalletUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "burn",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "burnFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "buyTaxPercentage",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "isPair",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "noTaxAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "sellTaxPercentage",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address[]",
                "name": "_pairs",
                "type": "address[]"
            },
            {
                "internalType": "bool[]",
                "name": "_isPairs",
                "type": "bool[]"
            }
        ],
        "name": "setBulkPairs",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_noTaxAddress",
                "type": "address"
            }
        ],
        "name": "setNoTaxAddress",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_pair",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "_isPair",
                "type": "bool"
            }
        ],
        "name": "setPair",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_buyTax",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_sellTax",
                "type": "uint256"
            }
        ],
        "name": "setTaxPercentage",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_taxWallet",
                "type": "address"
            }
        ],
        "name": "setTaxWallet",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "taxWallet",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const gameABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_flipperToken",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "guess",
                "type": "bool"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "outcome",
                "type": "bool"
            }
        ],
        "name": "BetPlaced",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "bool",
                "name": "isPaused",
                "type": "bool"
            }
        ],
        "name": "GamePaused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newWins",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newTotalBet",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newGamesPlayed",
                "type": "uint256"
            }
        ],
        "name": "LeaderboardUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "newLosePercentage",
                "type": "uint8"
            }
        ],
        "name": "OddsChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "betAmount",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "guess",
                "type": "bool"
            }
        ],
        "name": "flipCoin",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "flipperToken",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "gamePaused",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getLeaderboard",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "playerAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "wins",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalBet",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "gamesPlayed",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct FlipperGame.PlayerInfo[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "leaderboardData",
        "outputs": [
            {
                "internalType": "address",
                "name": "playerAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "wins",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalBet",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "gamesPlayed",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "losePercentage",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "players",
        "outputs": [
            {
                "internalType": "address",
                "name": "playerAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "wins",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalBet",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "gamesPlayed",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];


async function getBlockRange() {
    const latestBlock = Number(await web3.eth.getBlockNumber());
    const fromBlock = lastCheckedBlock === '0' 
        ? Math.max(0, latestBlock - BLOCKS_TO_CHECK)
        : Number(lastCheckedBlock) + 1;
    return {
        fromBlock: fromBlock.toString(),
        toBlock: latestBlock.toString(),
        latestBlock: latestBlock.toString()
    };
}


// Function to copy text to clipboard
function copyToClipboard() {
    var copyText = document.getElementById("copyableText");
    var textArea = document.createElement("textarea");
    textArea.value = copyText.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("Copy");
    textArea.remove();
    alert("Address copied to clipboard!");
}

function spinCoin() {
    const coin = document.getElementById('coinVisual');
    coin.style.transition = 'transform 7s'; // Set the duration to 7 seconds
    coin.style.transform = 'rotateY(3600deg)'; // Rotate the coin 10 full spins (360 degrees each)
}

let flipToken; // FLIP token instance
let gameContract; // Game contract instance

// Complete placeBet function
async function placeBet(isHeads) {
    if (!currentAccount || !gameContract) {
        alert('Please connect your wallet first');
        return;
    }

    const betAmountInput = document.getElementById('betAmount');
    const betAmount = betAmountInput.value;
    
    if (!betAmount || betAmount <= 0) {
        alert('Please enter a valid bet amount');
        return;
    }

    try {
        const betAmountWei = web3.utils.toWei(betAmount, 'ether');
        
        // Check if game is paused
        const isPaused = await gameContract.methods.gamePaused().call();
        if (isPaused) {
            alert('Game is currently paused');
            return;
        }

        // Check FLIP token balance
        const balance = await flipToken.methods.balanceOf(currentAccount).call();
        if (BigInt(balance) < BigInt(betAmountWei)) {
            alert(`Insufficient FLIP balance. You need ${betAmount} FLIP but have ${web3.utils.fromWei(balance, 'ether')} FLIP`);
            return;
        }

        // Check token allowance
        const allowance = await flipToken.methods.allowance(currentAccount, gameContractAddress).call();
        if (BigInt(allowance) < BigInt(betAmountWei)) {
            alert(`Insufficient allowance. Please approve at least ${betAmount} FLIP tokens first`);
            return;
        }

        // Estimate gas before sending transaction
        try {
            await gameContract.methods.flipCoin(betAmountWei, isHeads).estimateGas({
                from: currentAccount
            });
        } catch (gasError) {
            console.error("Gas estimation failed:", gasError);
            alert("Transaction would fail. Please check your balance and try a different amount.");
            return;
        }

        // Play coin flip sound
        const flipSound = document.getElementById('flipSound'); 
        if (flipSound) flipSound.play();

        // Trigger coin flip animation
        const coinElement = document.getElementById('coinVisual');
        if (coinElement) coinElement.classList.add('flip');

        console.log(`Placing bet: ${betAmount} FLIP on ${isHeads ? 'Heads' : 'Tails'}`);
        
        // Show pending transaction message
        const resultMessage = document.getElementById('resultMessage');
        resultMessage.textContent = 'Transaction pending...';
        resultMessage.classList.remove('hidden');

        // Send the transaction
        const transaction = await gameContract.methods.flipCoin(betAmountWei, isHeads)
            .send({ 
                from: currentAccount,
                gas: 300000
            });

        console.log('Bet transaction:', transaction);

        // Detailed event logging
        if (transaction.events && transaction.events.BetPlaced) {
            const { player, amount, guess, outcome } = transaction.events.BetPlaced.returnValues;
            console.log('Bet Event Details:', {
                player,
                amount: web3.utils.fromWei(amount, 'ether'),
                guess,
                outcome,
                didWin: guess === outcome
            });

            // Log all events for comprehensive debugging
            console.log('All Transaction Events:', Object.keys(transaction.events));
            
            // Try to log LeaderboardUpdated event if it exists
            if (transaction.events.LeaderboardUpdated) {
                const { newWins, newTotalBet, newGamesPlayed } = transaction.events.LeaderboardUpdated.returnValues;
                console.log('Leaderboard Update:', {
                    newWins: newWins.toString(),
                    newTotalBet: web3.utils.fromWei(newTotalBet, 'ether'),
                    newGamesPlayed: newGamesPlayed.toString()
                });
            }

            // Determine bet result
            const didWin = guess === outcome;
            resultMessage.textContent = didWin ? 
                `Congratulations! You won ${web3.utils.fromWei(amount, 'ether')} FLIP!` : 
                'Sorry, you lost. Try again!';
            resultMessage.classList.remove('hidden');
        }

        // Wait for blockchain state to update
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Update UI elements
        await Promise.all([
            updateBalance(),
            fetchLeaderboard(),
            checkPlayerStats()
        ]);

        // Reset coin animation
        if (coinElement) {
            setTimeout(() => {
                coinElement.classList.remove('flip');
            }, 2000);
        }

    } catch (error) {
        console.error("Error placing bet:", error);
        
        let errorMessage = "Error placing bet. ";
        if (error.message.includes("insufficient funds")) {
            errorMessage += "Insufficient funds for gas fee.";
        } else if (error.message.includes("User denied")) {
            errorMessage += "Transaction was cancelled.";
        } else if (error.message.includes("execution reverted")) {
            errorMessage += "Transaction failed. Please check your balance and try again.";
        } else {
            errorMessage += "Please try again with a different amount.";
        }
        
        const resultMessage = document.getElementById('resultMessage');
        resultMessage.textContent = errorMessage;
        resultMessage.classList.remove('hidden');
        
        // Reset coin animation if error occurs
        const coinElement = document.getElementById('coinVisual');
        if (coinElement) {
            coinElement.classList.remove('flip');
        }
    }
}

// Add helper function to approve tokens with exact amount
async function approveExactAmount() {
    if (!currentAccount || !flipToken) {
        alert('Please connect your wallet first');
        return;
    }

    const betAmountInput = document.getElementById('betAmount');
    const betAmount = betAmountInput.value;
    
    if (!betAmount || betAmount <= 0) {
        alert('Please enter a valid bet amount');
        return;
    }

    try {
        const betAmountWei = web3.utils.toWei(betAmount, 'ether');
        
        // First, check current allowance
        const currentAllowance = await flipToken.methods.allowance(currentAccount, gameContractAddress).call();
        
        // If there's an existing allowance, we need to reset it first
        if (BigInt(currentAllowance) > 0n) {
            await flipToken.methods.approve(gameContractAddress, '0')
                .send({ from: currentAccount });
        }
        
        // Now approve the exact amount needed
        const approval = await flipToken.methods.approve(gameContractAddress, betAmountWei)
            .send({ from: currentAccount });
        
        console.log("Approval successful:", approval);
        alert(`Successfully approved ${betAmount} FLIP tokens!`);
    } catch (error) {
        console.error("Error approving tokens:", error);
        if (error.message.includes("User denied")) {
            alert("Token approval was cancelled.");
        } else {
            alert("Failed to approve tokens. Please try again.");
        }
    }
}



// Helper function for button states
function updateBetButtons(enabled) {
    const buttons = ['betHeads', 'betTails'];
    buttons.forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            button.disabled = !enabled;
        }
    });
}

async function connectWallet() {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        currentAccount = accounts[0];
        console.log("Connected wallet:", currentAccount);

        // Initialize contracts
        flipToken = new web3.eth.Contract(flipABI, flipTokenAddress);
        gameContract = new web3.eth.Contract(gameABI, gameContractAddress);

        // Update UI
        document.getElementById('walletAddress').textContent = currentAccount;
        document.getElementById('connectWallet').style.display = 'none';
        document.getElementById('disconnectWallet').style.display = 'block';
        updateBetButtons(true);

        // Setup event checking
        setupLeaderboardListener();

        // Update initial data
        await Promise.all([
            updateBalance(),
            fetchLeaderboard()
        ]);

        // Listen for account changes
        window.ethereum.on('accountsChanged', async (accounts) => {
            currentAccount = accounts[0];
            document.getElementById('walletAddress').textContent = currentAccount;
            await updateBalance();
            await fetchLeaderboard();
        });

    } catch (error) {
        console.error("Error connecting wallet:", error);
        alert("Failed to connect wallet. Please try again.");
    }
}

async function updateBalance() {
    if (!currentAccount) return;

    try {
     

        // Add debug logging for FLIP token contract
        console.log("FLIP Token Contract:", flipToken);
        console.log("FLIP Token Methods:", flipToken.methods);

        // Fetch FLIP token balance with additional error handling
        if (flipToken && flipToken.methods.balanceOf) {
            try {
                const flipBalance = await flipToken.methods.balanceOf(currentAccount).call();
                const flipBalanceFormatted = web3.utils.fromWei(flipBalance, 'ether');
                document.getElementById('currentBalanceFLIP').textContent = `Current FLIP Balance: ${flipBalanceFormatted}`;
                console.log("FLIP Balance Updated:", flipBalanceFormatted);
            } catch (error) {
                console.error("Error calling balanceOf:", error);
                document.getElementById('currentBalanceFLIP').textContent = "Current FLIP Balance: Error fetching";
            }
        } else {
            console.error("FLIP Token contract or balanceOf method not available");
            document.getElementById('currentBalanceFLIP').textContent = "Current FLIP Balance: Contract not initialized";
        }
    } catch (error) {
        console.error("Error in updateBalance:", error);
        document.getElementById('currentBalanceFLIP').textContent = "Current FLIP Balance: Error";
    }
}

// Complete fetchLeaderboard function
async function fetchLeaderboard() {
    if (!gameContract || !currentAccount) {
        console.log("Game contract not initialized or wallet not connected");
        return;
    }

    try {
        const currentPlayerStats = await gameContract.methods.players(currentAccount).call();
        console.log("Current player stats in fetchLeaderboard:", {
            address: currentPlayerStats.playerAddress,
            gamesPlayed: currentPlayerStats.gamesPlayed.toString(),
            wins: currentPlayerStats.wins.toString(),
            totalBet: web3.utils.fromWei(currentPlayerStats.totalBet, 'ether'),
            rawPlayerStats: currentPlayerStats // Log raw stats for full inspection
        });

        const leaderboardList = document.getElementById('leaderboard');
        leaderboardList.innerHTML = '';

        // Safe conversion with fallback values
        const gamesPlayed = BigInt(safeToString(currentPlayerStats.gamesPlayed));
        const wins = BigInt(safeToString(currentPlayerStats.wins));
        const totalBet = BigInt(safeToString(currentPlayerStats.totalBet));

        if (gamesPlayed > 0n) {
            const playerSection = document.createElement('div');
            playerSection.className = 'current-player-stats';
            const winRate = wins > 0n 
                ? Number((wins * 100n) / gamesPlayed).toFixed(1)
                : '0.0';

            playerSection.innerHTML = `
                <h3>Your Stats</h3>
                <p>🎮 Games Played: ${gamesPlayed}</p>
                <p>🏆 Wins: ${wins}</p>
                <p>📊 Win Rate: ${winRate}%</p>
                <p>💰 Total FLIP Bet: ${web3.utils.fromWei(totalBet.toString(), 'ether')}</p>
                <p>🎲 Latest Results: <span id="latestResults"></span></p>
            `;
            leaderboardList.appendChild(playerSection);

            // Get recent results
            const latestBlock = Number(await web3.eth.getBlockNumber());
            const fromBlock = Math.max(0, latestBlock - 100);
            const recentBets = await gameContract.getPastEvents('BetPlaced', {
                filter: { player: currentAccount },
                fromBlock: fromBlock.toString(),
                toBlock: latestBlock.toString()
            });

            console.log("Recent Bets:", recentBets.map(event => ({
                amount: web3.utils.fromWei(event.returnValues.amount.toString(), 'ether'),
                guess: event.returnValues.guess,
                outcome: event.returnValues.outcome
            })));

            if (recentBets.length > 0) {
                const lastBet = recentBets[recentBets.length - 1];
                const won = lastBet.returnValues.guess === lastBet.returnValues.outcome;
                const latestResultsSpan = document.getElementById('latestResults');
                latestResultsSpan.textContent = won ? '🎉 Won!' : '😢 Lost';
                latestResultsSpan.style.color = won ? 'green' : 'red';
            }

            // Process recent bets
            const latestResults = document.getElementById('latestResults');
            latestResults.innerHTML = recentBets.map(event => {
                const amount = web3.utils.fromWei(event.returnValues.amount.toString(), 'ether');
                const outcome = event.returnValues.outcome ? 'Win' : 'Lose';
                return `<p>${amount} FLIP - ${outcome}</p>`;
            }).join('');

            leaderboardList.appendChild(document.createElement('hr'));
        }

        // Get and process leaderboard data
        const rawLeaderboardData = await gameContract.methods.getLeaderboard().call();

        console.log("Raw Leaderboard Data:", rawLeaderboardData);

        const processedLeaderboard = rawLeaderboardData.map(entry => ({
            playerAddress: entry.playerAddress,
            gamesPlayed: BigInt(safeToString(entry.gamesPlayed)),
            wins: BigInt(safeToString(entry.wins)),
            totalBet: BigInt(safeToString(entry.totalBet))
        }));

        // Add top players section
        const topPlayersSection = document.createElement('div');
        topPlayersSection.innerHTML = '<h3>Top Players</h3>';
        leaderboardList.appendChild(topPlayersSection);

        const sortedLeaderboard = processedLeaderboard
            .filter(entry => 
                entry.playerAddress !== '0x0000000000000000000000000000000000000000' &&
                (entry.wins > 0n || entry.gamesPlayed > 0n)
            )
            .sort((a, b) => {
                if (a.wins !== b.wins) return b.wins > a.wins ? -1 : 1;
                return b.gamesPlayed > a.gamesPlayed ? -1 : 1;
            })
            .slice(0, 3);

        console.log("Sorted Leaderboard:", sortedLeaderboard);

        if (sortedLeaderboard.length > 0) {
            sortedLeaderboard.forEach((entry, index) => {
                const li = document.createElement('li');
                const winRate = entry.gamesPlayed > 0n ? 
                    Number((entry.wins * 100n) / entry.gamesPlayed).toFixed(1) : '0.0';
                const isCurrentPlayer = entry.playerAddress.toLowerCase() === currentAccount.toLowerCase();

                if (isCurrentPlayer) {
                    li.className = 'current-player-highlight';
                }

                li.innerHTML = `
                    <strong>#${index + 1}</strong> - ${shortenAddress(entry.playerAddress)} 
                    ${isCurrentPlayer ? '(You)' : ''}<br>
                    🎮 <strong>Games:</strong> ${entry.gamesPlayed}<br>
                    🏆 <strong>Wins:</strong> ${entry.wins}<br>
                    📊 <strong>Win Rate:</strong> ${winRate}%<br>
                    💰 <strong>Total Bet:</strong> ${web3.utils.fromWei(entry.totalBet.toString(), 'ether')} FLIP
                `;
                leaderboardList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'No games played yet';
            leaderboardList.appendChild(li);
        }

    } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
        const leaderboardList = document.getElementById('leaderboard');
        leaderboardList.innerHTML = '<li>Error loading leaderboard</li>';
    }
}

// Helper function to safely convert to BigInt
function toBigInt(value) {
    try {
        // Handle undefined/null
        if (value === undefined || value === null) return BigInt(0);
        // Handle string
        if (typeof value === 'string') return BigInt(value);
        // Handle number
        if (typeof value === 'number') return BigInt(Math.floor(value));
        // Already a BigInt
        if (typeof value === 'bigint') return value;
        // Handle other cases by converting to string first
        return BigInt(value.toString());
    } catch (error) {
        console.error('Error converting to BigInt:', error);
        return BigInt(0);
    }
}

async function checkForNewEvents() {
    try {
        // Get latest block number and convert to BigInt
        const latestBlock = toBigInt(await web3.eth.getBlockNumber());
        
        // Convert stored lastCheckedBlock to BigInt, defaulting to 0n if not set
        const currentLastChecked = toBigInt(lastCheckedBlock || '0');
        
        // Calculate fromBlock, ensuring it's a BigInt
        const blocksToCheck = toBigInt(BLOCKS_TO_CHECK);
        const fromBlock = currentLastChecked === 0n ? 
            (latestBlock - blocksToCheck) : 
            (currentLastChecked + 1n);

        // Ensure fromBlock isn't negative
        const safeFromBlock = fromBlock < 0n ? 0n : fromBlock;
        
        // Convert block numbers to strings for web3 calls
        const fromBlockStr = safeFromBlock.toString();
        const toBlockStr = latestBlock.toString();

        console.log('Block range:', {
            fromBlock: fromBlockStr,
            toBlock: toBlockStr,
            lastCheckedBlock: lastCheckedBlock,
            latestBlock: latestBlock.toString()
        });

        const [betEvents, leaderboardEvents] = await Promise.all([
            gameContract.getPastEvents('BetPlaced', {
                fromBlock: fromBlockStr,
                toBlock: toBlockStr
            }),
            gameContract.getPastEvents('LeaderboardUpdated', {
                fromBlock: fromBlockStr,
                toBlock: toBlockStr
            })
        ]);

        if (betEvents.length > 0 || leaderboardEvents.length > 0) {
            console.log("New events found:", {
                betEvents: betEvents.map(event => ({
                    player: event.returnValues.player,
                    amount: web3.utils.fromWei(toBigInt(event.returnValues.amount).toString(), 'ether'),
                    guess: event.returnValues.guess,
                    outcome: event.returnValues.outcome,
                    won: event.returnValues.guess === event.returnValues.outcome
                })),
                leaderboardEvents: leaderboardEvents.map(event => ({
                    player: event.returnValues.player,
                    newWins: toBigInt(event.returnValues.newWins).toString(),
                    newTotalBet: web3.utils.fromWei(toBigInt(event.returnValues.newTotalBet).toString(), 'ether'),
                    newGamesPlayed: toBigInt(event.returnValues.newGamesPlayed).toString()
                }))
            });
            await fetchLeaderboard();
        }

        // Update lastCheckedBlock as string
        lastCheckedBlock = latestBlock.toString();

    } catch (error) {
        console.error("Error checking for events:", error);
    }
}

// Add a helper function to safely convert values
function safeNumber(value) {
    try {
        return Number(value.toString());
    } catch (error) {
        console.error("Error converting value:", error);
        return 0;
    }
}

// Add function to listen for LeaderboardUpdated events
function setupLeaderboardListener() {
    if (!gameContract) return;

    let lastCheckedBlock = '0';

    async function checkForNewEvents() {
        try {
            const latestBlock = await web3.eth.getBlockNumber();
            if (lastCheckedBlock === '0') {
                lastCheckedBlock = (latestBlock - 1).toString();
            }

            const fromBlockNum = parseInt(lastCheckedBlock) + 1;

            const [betEvents, leaderboardEvents] = await Promise.all([
                gameContract.getPastEvents('BetPlaced', {
                    fromBlock: fromBlockNum.toString(),
                    toBlock: latestBlock.toString()
                }),
                gameContract.getPastEvents('LeaderboardUpdated', {
                    fromBlock: fromBlockNum.toString(),
                    toBlock: latestBlock.toString()
                })
            ]);

            if (betEvents.length > 0 || leaderboardEvents.length > 0) {
                console.log("New events found:", {
                    betEvents: betEvents.map(event => ({
                        player: event.returnValues.player,
                        amount: web3.utils.fromWei(String(event.returnValues.amount), 'ether'),
                        guess: event.returnValues.guess,
                        outcome: event.returnValues.outcome,
                        didWin: event.returnValues.guess === event.returnValues.outcome
                    })),
                    leaderboardEvents: leaderboardEvents.map(event => ({
                        player: event.returnValues.player,
                        newWins: String(event.returnValues.newWins),
                        newTotalBet: web3.utils.fromWei(String(event.returnValues.newTotalBet), 'ether'),
                        newGamesPlayed: String(event.returnValues.newGamesPlayed)
                    }))
                });
                await fetchLeaderboard();
            }

            lastCheckedBlock = String(latestBlock);
        } catch (error) {
            console.error("Error checking for events:", error);
        }
    }

    // Initial check
    checkForNewEvents();

    // Set up interval for periodic checks
    return setInterval(checkForNewEvents, 5000);
}
async function checkPlayerStats() {
    if (!gameContract || !currentAccount) {
        console.log("Contract or wallet not connected");
        return null;
    }

    try {
        const stats = await gameContract.methods.players(currentAccount).call();
        console.log("Detailed Player Stats:", {
            address: stats.playerAddress,
            wins: stats.wins.toString(), // Convert to string for clear logging
            gamesPlayed: stats.gamesPlayed.toString(),
            totalBet: web3.utils.fromWei(stats.totalBet, 'ether') + " FLIP"
        });
        return stats;
    } catch (error) {
        console.error("Error fetching player stats:", error);
        return null;
    }
}

// Add this to your placeBet function after a successful bet
async function updateAfterBet(transaction) {
    try {
        // Wait a bit for the blockchain to process the transaction
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Update player stats and leaderboard
        await checkPlayerStats();
        await fetchLeaderboard();
        
        // Update balance
        await updateBalance();
    } catch (error) {
        console.error("Error updating after bet:", error);
    }
}



async function getOdds() {
    if (!gameContract) {
        console.error("Game contract not initialized");
        return { heads: 0, tails: 0 };
    }

    try {
        const losePercentage = await gameContract.methods.losePercentage().call();
        // Convert BigInt to Number for arithmetic
        const winPercentage = 100 - Number(losePercentage); 
        return { heads: winPercentage, tails: Number(losePercentage) };
    } catch (error) {
        console.error('Failed to fetch odds:', error);
        return { heads: 0, tails: 0 }; // or some default value or null
    }
}

async function updateOdds() {
    const odds = await getOdds();
    const oddsDisplay = document.querySelector('h3');
    
    if (oddsDisplay && oddsDisplay.textContent.startsWith("Current Odds")) {
        oddsDisplay.textContent = `Current Odds: ${odds.heads}/${odds.tails}`;
    } else {
        console.error('Element for displaying odds not found or does not match expected content');
    }
}

// Complete updateLeaderboard function
async function updateLeaderboard() {
    try {
        await fetchLeaderboard();
    } catch (error) {
        console.error("Error updating leaderboard:", error);
    }
}

// Helper function to format addresses
function shortenAddress(address) {
    if (!address) return "N/A";
    return address.substring(0, 6) + '...' + address.substring(address.length - 4);
}

// Add this function to update the UI text based on selected language
function updateLanguage(lang) {
    // Store the selected language in localStorage
    localStorage.setItem('preferredLanguage', lang);
    
    // Update text content for all translatable elements
    document.getElementById('connectWallet').textContent = translations[lang].connectWallet;
    document.getElementById('disconnectWallet').textContent = translations[lang].disconnectWallet;
    document.getElementById('approveTokens').textContent = translations[lang].approveTokens;
    document.getElementById('betHeads').textContent = translations[lang].betHeads;
    document.getElementById('betTails').textContent = translations[lang].betTails;
    
    // Update placeholders
    document.getElementById('betAmount').placeholder = translations[lang].enterAmount;
    
    // Update other text elements
    document.querySelector('#betSection p strong').textContent = translations[lang].makeChoice;
    
    // Update wallet address label
    const walletAddressLabel = document.querySelector('p strong');
    if (walletAddressLabel && walletAddressLabel.textContent.includes('Wallet Address')) {
        walletAddressLabel.textContent = translations[lang].walletAddress;
    }

    // Update balance text while preserving the actual balance number
    const balanceElement = document.getElementById('currentBalanceFLIP');
    if (balanceElement) {
        const balance = balanceElement.textContent.split(':')[1];
        balanceElement.textContent = `${translations[lang].currentBalance}${balance}`;
    }

    // Update leaderboard sections if they exist
    updateLeaderboardLanguage(lang);
}

// Add this function to update leaderboard text
function updateLeaderboardLanguage(lang) {
    const playerStats = document.querySelector('.current-player-stats');
    if (playerStats) {
        const statsHTML = playerStats.innerHTML;
        // Update the headings and labels while preserving the values
        playerStats.innerHTML = statsHTML
            .replace(/Your Stats/g, translations[lang].yourStats)
            .replace(/Games Played/g, translations[lang].gamesPlayed)
            .replace(/Wins/g, translations[lang].wins)
            .replace(/Win Rate/g, translations[lang].winRate)
            .replace(/Total FLIP Bet/g, translations[lang].totalBet)
            .replace(/Latest Results/g, translations[lang].latestResults);
    }

    const topPlayersSection = document.querySelector('#leaderboard h3');
    if (topPlayersSection) {
        topPlayersSection.textContent = translations[lang].topPlayers;
    }

    // Update the "No games played yet" message if present
    const noGamesMessage = document.querySelector('#leaderboard li');
    if (noGamesMessage && noGamesMessage.textContent === 'No games played yet') {
        noGamesMessage.textContent = translations[lang].noGames;
    }
}



// Event Listeners
document.getElementById('connectWallet').addEventListener('click', connectWallet);

document.getElementById('disconnectWallet').addEventListener('click', () => {
    currentAccount = null;
    document.getElementById('walletAddress').textContent = '';
    document.getElementById('connectWallet').style.display = 'block';
    document.getElementById('disconnectWallet').style.display = 'none';
    document.getElementById('currentBalanceFLIP').textContent = 'Current FLIP Balance: 0';
    // Reset the bet buttons state
    updateBetButtons(false);
    // Clear any existing result messages
    const resultMessage = document.getElementById('resultMessage');
    if (resultMessage) {
        resultMessage.textContent = '';
        resultMessage.classList.add('hidden');
    }
    // Reset bet amount input
    const betAmountInput = document.getElementById('betAmount');
    if (betAmountInput) {
        betAmountInput.value = '';
    }
    console.log("Wallet disconnected.");
});

document.getElementById('approveTokens').addEventListener('click', async () => {
    // Get the bet amount from input
    const betAmountInput = document.getElementById('betAmount');
    const betAmount = betAmountInput.value;
    
    if (!betAmount || betAmount <= 0) {
        alert('Please enter a valid bet amount');
        return;
    }

    try {
        // Convert bet amount to Wei
        const amountToApprove = web3.utils.toWei(betAmount, 'ether');
        
        const approval = await flipToken.methods.approve(gameContractAddress, amountToApprove)
            .send({ from: currentAccount });
        
        console.log("Approval successful:", approval);
        alert(`Successfully approved ${betAmount} FLIP tokens!`);
    } catch (error) {
        console.error("Error approving tokens:", error);
        alert("Failed to approve tokens. Check console for details.");
    }
});

document.addEventListener('DOMContentLoaded', async () => {
	if (currentAccount) {
		await updateBalance();
		await updateOdds(); 
	}
	document.getElementById('betHeads').addEventListener('click', () => placeBet(true));
	document.getElementById('betTails').addEventListener('click', () => placeBet(false));
    await fetchLeaderboard(); // Move fetchLeaderboard here to ensure DOM is fully loaded

	function animateTokens() {
		const main = document.querySelector('main');
		const mainRect = main.getBoundingClientRect();
		
		const tokens = document.querySelectorAll('.pulse-logo, .flip-logo');
		tokens.forEach(token => {
			if (!token.id) {
				token.id = 'token' + Math.random().toString(36).substring(2, 11);
			}
			// Initial random position
			const randomX = Math.random() * (mainRect.width - 30);
			const randomY = Math.random() * (mainRect.height - 30);
			
			// Set initial position relative to main
			token.style.position = 'absolute';
			token.style.left = `${randomX}px`;
			token.style.top = `${randomY}px`;
			// Random velocity components
			const velocity = {
				x: (Math.random() - 0.5) * 2, // Random value between -1 and 1
				y: (Math.random() - 0.5) * 2  // Random value between -1 and 1
			};
			// Normalize the velocity to ensure consistent speed
			const speed = 0.5; // Adjust this for slower/faster movement
			const magnitude = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
			velocity.x = (velocity.x / magnitude) * speed;
			velocity.y = (velocity.y / magnitude) * speed;
			function updatePosition() {
				const currentX = parseFloat(token.style.left);
				const currentY = parseFloat(token.style.top);
				let newX = currentX + velocity.x;
				let newY = currentY + velocity.y;
				// Bounce off boundaries
				if (newX <= 0 || newX >= mainRect.width - 30) {
					velocity.x *= -1;
					newX = Math.max(0, Math.min(newX, mainRect.width - 30));
				}
				if (newY <= 0 || newY >= mainRect.height - 30) {
					velocity.y *= -1;
					newY = Math.max(0, Math.min(newY, mainRect.height - 30));
				}
				token.style.left = `${newX}px`;
				token.style.top = `${newY}px`;
				requestAnimationFrame(updatePosition);
			}
			updatePosition();
		});
	}
	// Start the animation
	animateTokens();
	// Handle window resizing
	let resizeTimeout;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(animateTokens, 250); // Debounce resize events
	});
});

document.getElementById('copyButton').addEventListener('click', copyToClipboard);

// Add event listener for language selector
document.addEventListener('DOMContentLoaded', () => {
    const langSelector = document.getElementById('langSelector');
    if (langSelector) {
        // Set initial language from localStorage or default to 'en'
        const savedLang = localStorage.getItem('preferredLanguage') || 'en';
        langSelector.value = savedLang;
        updateLanguage(savedLang);

        // Add change event listener
        langSelector.addEventListener('change', (e) => {
            updateLanguage(e.target.value);
        });
    }
});