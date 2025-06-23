// Tab functionality
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanes = document.querySelectorAll('.tab-pane');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and panes
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Show corresponding tab pane
        const targetTab = button.getAttribute('data-tab');
        const targetPane = document.getElementById(targetTab);
        if (targetPane) {
            targetPane.classList.add('active');
        }
    });
});

// Modal functionality
const createMarketBtn = document.getElementById('createMarketBtn');
const createMarketModal = document.getElementById('createMarketModal');
const closeModal = document.getElementById('closeModal');
const cancelCreate = document.getElementById('cancelCreate');
const createMarketForm = document.getElementById('createMarketForm');

// Open modal
// createMarketBtn.addEventListener('click', () => {
//     createMarketModal.classList.add('active');
//     document.body.style.overflow = 'hidden'; // Prevent background scrolling
// });

// Close modal functions
function closeModalFunction() {
    createMarketModal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore scrolling
    createMarketForm.reset(); // Reset form
}

closeModal.addEventListener('click', closeModalFunction);
cancelCreate.addEventListener('click', closeModalFunction);

// Close modal when clicking outside
createMarketModal.addEventListener('click', (e) => {
    if (e.target === createMarketModal) {
        closeModalFunction();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && createMarketModal.classList.contains('active')) {
        closeModalFunction();
    }
});

// Handle form submission
createMarketForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(createMarketForm);
    const marketData = {
        question: formData.get('marketQuestion'),
        description: formData.get('marketDescription'),
        endDate: formData.get('endDate'),
        initialOdds: formData.get('initialOdds'),
        category: formData.get('marketCategory')
    };
    
    // Here you would typically send the data to your backend
    console.log('New market data:', marketData);
    
    // For demo purposes, add the new market to the active tab
    addNewMarket(marketData);
    
    // Close modal and reset form
    closeModalFunction();
    
    // Show success message (optional)
    showNotification('Market created successfully!', 'success');
});

// Function to add new market to the active tab
function addNewMarket(marketData) {
    const activeTab = document.getElementById('active');
    const marketGrid = activeTab.querySelector('.market-grid');
    
    const newMarketCard = document.createElement('div');
    newMarketCard.className = 'market-card';
    newMarketCard.innerHTML = `
        <h3>${marketData.question}</h3>
        <div class="market-id">Market ID: ${marketData.id}</div>
        <div class="market-stats">
            <span class="yes-odds">Yes: ${marketData.initialOdds}%</span>
            <span class="no-odds">No: ${100 - parseInt(marketData.initialOdds)}%</span>
        </div>
        <div class="market-meta">
            <span class="volume">Volume: $0</span>
            <span class="participants">Participants: 0</span>
        </div>
        <div class="market-category">Category: ${marketData.category}</div>
    `;
    
    // Add the new market at the beginning of the grid
    marketGrid.insertBefore(newMarketCard, marketGrid.firstChild);
}

// Simple notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    let bgColor, textColor;
    switch(type) {
        case 'success':
            bgColor = '#d4edda';
            textColor = '#155724';
            break;
        case 'error':
            bgColor = '#f8d7da';
            textColor = '#721c24';
            break;
        default:
            bgColor = '#d1ecf1';
            textColor = '#0c5460';
    }
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${bgColor};
        color: ${textColor};
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(102, 126, 234, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        navbar.style.backdropFilter = 'none';
    }
});

// Workshop Demo
// Connect Wallet functionality
const connectWalletBtn = document.querySelector('.connect-wallet-btn');
const claimBtn = document.getElementById('claimBtn');
const balanceDisplay = document.getElementById('balanceDisplay');
const refreshBalanceBtn = document.getElementById('refreshBalanceBtn');
const refreshMarketsBtn = document.getElementById('refreshMarketsBtn');
let isWalletConnected = false;
const WEB3AUTH_CLIENT_ID = "BMLNaXIHTT74MZJfe8t2rSrCBzZUB5Nvnx06uJ5JgPA1CmFheVwLA2ujZmRDo4GWWkmXdX92ekOqfNL9n6NYCG4";
let web3auth = null;
let web3Instance = null;
let connectedAccount = null;
// Contract addresses and instances
const USDT_CONTRACT_ADDRESS = "0xbF00A36014A2B783e954fd244954531820225db0"; // Replace with actual address
const PREDICTION_MARKET_CONTRACT_ADDRESS = "0x295Ad59D1C7d3073d68ED8393658ACBf42034712"; // Replace with actual address
const KAIROS_NODE_URL = "https://public-en-kairos.node.kaia.io";
let usdtContract = null;
let predictionMarketContract = null;
let readOnlyWeb3 = null;

// loadMarkets
// simulateWalletConnection
// placeBet

// Manual refresh markets button functionality
refreshMarketsBtn.addEventListener('click', async () => {
    try {
        // Add spinning animation
        refreshMarketsBtn.classList.add('refreshing');
        refreshMarketsBtn.disabled = true;
        
        // Reload markets
        await loadMarkets();
        
        // Show success notification
        showNotification('Markets refreshed successfully!', 'success');
        
    } catch (error) {
        console.error('Error refreshing markets:', error);
        showNotification('Failed to refresh markets', 'error');
    } finally {
        // Remove spinning animation
        refreshMarketsBtn.classList.remove('refreshing');
        refreshMarketsBtn.disabled = false;
    }
});

// Manual refresh balance button functionality
refreshBalanceBtn.addEventListener('click', async () => {
    if (!isWalletConnected || !connectedAccount) {
        showNotification('Please connect your wallet first', 'error');
        return;
    }
    
    try {
        // Add spinning animation
        refreshBalanceBtn.classList.add('refreshing');
        refreshBalanceBtn.disabled = true;
        
        // Update balances
        await updateBalances();
        
        // Show success notification
        showNotification('Balances refreshed successfully!', 'success');
        
    } catch (error) {
        console.error('Error refreshing balances:', error);
        showNotification('Failed to refresh balances', 'error');
    } finally {
        // Remove spinning animation
        refreshBalanceBtn.classList.remove('refreshing');
        refreshBalanceBtn.disabled = false;
    }
});

connectWalletBtn.addEventListener('click', async () => {
    if (!isWalletConnected) {
        try {
            // Simulate wallet connection (replace with actual wallet integration)
            await simulateWalletConnection();
            isWalletConnected = true;
            updateWalletButton();
            
            // Show balance display and claim button after successful connection
            balanceDisplay.classList.remove('hidden');
            claimBtn.classList.remove('hidden');
            
            await updateBalances();
            await checkClaimEligibility();
            showNotification('Wallet connected successfully!', 'success');
        } catch (error) {
            showNotification('Failed to connect wallet. Please try again.', 'error');
        }
    } else {
        // Disconnect wallet
        await web3auth.logout({ cleanup: true });
        web3auth = null;
        web3Instance = null;
        connectedAccount = null;
        isWalletConnected = false;
        updateWalletButton();
        
        // Hide balance display and claim button after disconnection
        balanceDisplay.classList.add('hidden');
        claimBtn.classList.add('hidden');
        
        await updateBalances();
        showNotification('Wallet disconnected.', 'info');
    }
});

// Initialize read-only Web3 connection for contract reading
function initializeReadOnlyWeb3() {
    try {
        readOnlyWeb3 = new Web3(KAIROS_NODE_URL);
        console.log('Read-only Web3 initialized with Kaia node');
        return true;
    } catch (error) {
        console.error('Error initializing read-only Web3:', error);
        return false;
    }
}

// Initialize contracts for reading (works without wallet connection)
async function initializeContractsForReading() {
    if (!readOnlyWeb3) {
        if (!initializeReadOnlyWeb3()) {
            showNotification('Failed to connect to blockchain network', 'error');
            return false;
        }
    }
    
    try {
        usdtContract = new readOnlyWeb3.eth.Contract(abi_usdt, USDT_CONTRACT_ADDRESS);
        predictionMarketContract = new readOnlyWeb3.eth.Contract(abi_predictionMarket, PREDICTION_MARKET_CONTRACT_ADDRESS);
        
        console.log('Contracts initialized for reading');
        
        // Load markets after contract initialization
        await loadMarkets();
        return true;
    } catch (error) {
        console.error('Error initializing contracts for reading:', error);
        showNotification('Failed to initialize contracts', 'error');
        return false;
    }
}

// Initialize contracts after wallet connection (for writing transactions)
async function initializeContractsForWriting() {
    if (!web3Instance) return;
    
    try {
        usdtContract = new web3Instance.eth.Contract(abi_usdt, USDT_CONTRACT_ADDRESS);
        predictionMarketContract = new web3Instance.eth.Contract(abi_predictionMarket, PREDICTION_MARKET_CONTRACT_ADDRESS);
        
        console.log('Contracts initialized for writing');
        
        // Reload markets to update UI with wallet connection
        await loadMarkets();
    } catch (error) {
        console.error('Error initializing contracts for writing:', error);
        showNotification('Failed to initialize contracts', 'error');
    }
}

// Load all markets from the contract
async function loadMarkets() {
    if (!predictionMarketContract) return;
    
    try {
        const marketCount = await predictionMarketContract.methods.marketCount().call();
        console.log('Total markets:', marketCount);
        
        const markets = [];
        
        // Fetch all markets
        for (let i = 0; i < marketCount; i++) {
            try {
                const marketInfo = await predictionMarketContract.methods.getMarketInfo(i).call();
                markets.push({
                    id: i,
                    ...marketInfo
                });
            } catch (error) {
                console.error(`Error fetching market ${i}:`, error);
            }
        }
        
        // Populate UI with market data
        await populateMarketCards(markets);
        
    } catch (error) {
        console.error('Error loading markets:', error);
        showNotification('Failed to load markets', 'error');
    }
}

// Populate market cards in the UI
async function populateMarketCards(markets) {
    const activeTab = document.getElementById('active');
    const pendingTab = document.getElementById('pending');
    const resolvedTab = document.getElementById('resolved');
    
    // Clear existing cards
    activeTab.querySelector('.market-grid').innerHTML = '';
    pendingTab.querySelector('.market-grid').innerHTML = '';
    resolvedTab.querySelector('.market-grid').innerHTML = '';
    
    // Categorize markets
    const activeMarkets = markets.filter(m => !m.resolved && !isMarketPending(m));
    const pendingMarkets = markets.filter(m => isMarketPending(m));
    const resolvedMarkets = markets.filter(m => m.resolved);
    
    // Populate active markets
    if (activeMarkets.length > 0) {
        const activeCards = await Promise.all(activeMarkets.map(market => createMarketCard(market)));
        activeCards.forEach(card => {
            activeTab.querySelector('.market-grid').appendChild(card);
        });
    } else {
        activeTab.querySelector('.market-grid').innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📊</div>
                <h3>No Active Markets</h3>
                <p>There are currently no active prediction markets. Check back later or create a new market!</p>
            </div>
        `;
    }
    
    // Populate pending markets
    if (pendingMarkets.length > 0) {
        const pendingCards = await Promise.all(pendingMarkets.map(market => createMarketCard(market)));
        pendingCards.forEach(card => {
            pendingTab.querySelector('.market-grid').appendChild(card);
        });
    } else {
        pendingTab.querySelector('.market-grid').innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⏳</div>
                <h3>No Pending Markets</h3>
                <p>No markets are currently awaiting resolution.</p>
            </div>
        `;
    }
    
    // Populate resolved markets
    if (resolvedMarkets.length > 0) {
        const resolvedCards = await Promise.all(resolvedMarkets.map(market => createMarketCard(market)));
        resolvedCards.forEach(card => {
            resolvedTab.querySelector('.market-grid').appendChild(card);
        });
    } else {
        resolvedTab.querySelector('.market-grid').innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">✅</div>
                <h3>No Resolved Markets</h3>
                <p>No markets have been resolved yet. Participate in active markets to see results here!</p>
            </div>
        `;
    }
    
    // Update market counts in tab headers
    updateMarketCounts(markets);
}

// Create a market card element
async function createMarketCard(market) {
    const card = document.createElement('div');
    card.className = `market-card ${market.resolved ? 'resolved' : isMarketPending(market) ? 'pending' : ''}`;
    
    // Convert bigint endTime to number and then to Date
    const endTimeNumber = parseInt(market.endTime.toString());
    const endDate = new Date(endTimeNumber * 1000); // Convert seconds to milliseconds
    const isExpired = endDate < new Date();
    
    // Calculate odds
    const totalOptionAShares = parseInt(market.totalOptionAShares.toString());
    const totalOptionBShares = parseInt(market.totalOptionBShares.toString());
    const totalShares = totalOptionAShares + totalOptionBShares;
    const optionAOdds = totalShares > 0 ? Math.round((totalOptionAShares / totalShares) * 100) : 50;
    const optionBOdds = 100 - optionAOdds;
    
    let cardContent = `
        <h3>${market.question}</h3>
        <div class="market-id">Market ID: ${market.id}</div>
        <div class="market-stats">
    `;
    
    if (market.resolved) {
        debugger;
        const outcomeStr = market.outcome.toString();
        const outcome = outcomeStr === '1' ? market.optionA : market.optionB;
        const isWinning = outcomeStr === '1' ? 'yes' : 'no';
        cardContent += `
            <span class="result ${isWinning}">Result: ${outcome} ${isWinning === 'yes' ? '✓' : '✗'}</span>
        `;
    } else {
        cardContent += `
            <span class="yes-odds">${market.optionA}: ${optionAOdds}%</span>
            <span class="no-odds">${market.optionB}: ${optionBOdds}%</span>
        `;
    }
    
    cardContent += `
        </div>
        <div class="market-meta">
            <span class="volume">Total Pool: ${web3Instance ? web3Instance.utils.fromWei(totalShares.toString(), 'ether') : readOnlyWeb3.utils.fromWei(totalShares.toString(), 'ether')} USDT</span>
            <span class="end-date">Ends: ${endDate.toLocaleDateString()}</span>
        </div>
    `;
    
    if (market.resolved) {
        cardContent += `
            <div class="resolution-status">Resolved: ${endDate.toLocaleDateString()}</div>
        `;
        
        // Check if user is eligible to claim winnings
        if (isWalletConnected && connectedAccount) {
            const isEligible = await checkMarketClaimEligibility(market.id);
            if (isEligible) {
                cardContent += `
                    <div class="market-actions">
                        <button class="claim-btn" onclick="claimMarketWinnings(${market.id})">
                            Claim Winnings
                        </button>
                    </div>
                `;
            }
        }
    } else if (isExpired) {
        cardContent += `
            <div class="resolution-status">Awaiting resolution</div>
        `;
    }
    
    // Add betting buttons for active markets
    if (!market.resolved && !isExpired) {
        cardContent += `
            <div class="market-actions">
                <button class="bet-btn bet-option-a" onclick="placeBet(${market.id}, true)">
                    Bet on ${market.optionA}
                </button>
                <button class="bet-btn bet-option-b" onclick="placeBet(${market.id}, false)">
                    Bet on ${market.optionB}
                </button>
            </div>
        `;
    }
    
    cardContent += `</div>`;
    card.innerHTML = cardContent;
    
    return card;
}

// Check if market is pending resolution
function isMarketPending(market) {
    // Convert bigint endTime to number and then to Date
    const endTimeNumber = parseInt(market.endTime.toString());
    const endDate = new Date(endTimeNumber * 1000); // Convert seconds to milliseconds
    return endDate < new Date() && !market.resolved;
}

// Update market counts in tab headers
function updateMarketCounts(markets) {
    const activeCount = markets.filter(m => !m.resolved && !isMarketPending(m)).length;
    const pendingCount = markets.filter(m => isMarketPending(m)).length;
    const resolvedCount = markets.filter(m => m.resolved).length;
    
    // Update tab button text with counts
    const activeTabBtn = document.querySelector('[data-tab="active"]');
    const pendingTabBtn = document.querySelector('[data-tab="pending"]');
    const resolvedTabBtn = document.querySelector('[data-tab="resolved"]');
    
    activeTabBtn.textContent = `Active (${activeCount})`;
    pendingTabBtn.textContent = `Pending Resolution (${pendingCount})`;
    resolvedTabBtn.textContent = `Resolved (${resolvedCount})`;
}

// Place a bet on a market
async function placeBet(marketId, isOptionA) {
    if (!isWalletConnected || !web3Instance) {
        showNotification('Please connect your wallet to place bets', 'error');
        return;
    }
    
    if (!predictionMarketContract || !usdtContract) {
        showNotification('Contracts not initialized. Please try again.', 'error');
        return;
    }
    
    try {
        // Show betting modal or prompt for amount
        const amount = prompt('Enter amount to bet (in USDT):');
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            showNotification('Please enter a valid amount', 'error');
            return;
        }
        
        const amountInWei = web3Instance.utils.toWei(amount, 'ether');
        
        // Check USDT balance first
        const balance = await usdtContract.methods.balanceOf(connectedAccount).call();
        if (parseInt(balance) < parseInt(amountInWei)) {
            showNotification('Insufficient USDT balance', 'error');
            return;
        }
        
        // Approve USDT spending
        showNotification('Approving USDT spending...', 'info');
        const approveTx = await usdtContract.methods.approve(PREDICTION_MARKET_CONTRACT_ADDRESS, amountInWei)
            .send({ from: connectedAccount });
        
        if (approveTx.status) {
            // Place the bet
            showNotification('Placing your bet...', 'info');
            const betTx = await predictionMarketContract.methods.buyShares(marketId, isOptionA, amountInWei)
                .send({ from: connectedAccount });
            
            if (betTx.status) {
                showNotification('Bet placed successfully!', 'success');
                // Reload markets to update UI
                await loadMarkets();
            }
        }
        
    } catch (error) {
        console.error('Error placing bet:', error);
        showNotification('Failed to place bet. Please try again.', 'error');
    }
}

// Update the wallet connection function to initialize contracts
async function simulateWalletConnection() {
    debugger;
    web3auth = new Modal.Web3Auth({
        clientId: WEB3AUTH_CLIENT_ID,
        web3AuthNetwork: "sapphire_devnet",
        defaultChainId: "0x3e9",
        modalConfig: {
          connectors: {
            auth: {
              label: "auth",
              loginMethods: {
                google: {
                  name: "google",
                  showOnModal: true
                }
              }
            },
            metamask: { 
              label: "metamask",
              showOnModal: false,
            }
          }
        },
      });
    
    await web3auth.init();
    const _provider = await web3auth.connect();
    console.log(_provider);

    web3Instance = new Web3(_provider);

    let accounts = await web3Instance.eth.getAccounts();
    console.log(accounts);
    connectedAccount = accounts[0];
    console.log('Connected account:', connectedAccount);
    
    // Initialize contracts for writing after wallet connection
    await initializeContractsForWriting();
}

// Initialize the application on page load
async function initializeApp() {
    console.log('Initializing Kaia Prediction Market App...');
    
    // Ensure balance display and claim button are hidden initially
    balanceDisplay.classList.add('hidden');
    claimBtn.classList.add('hidden');
    
    // Initialize contracts for reading immediately
    await initializeContractsForReading();
    
    // Update wallet button to show disconnected state
    updateWalletButton();
    
    // Initialize balances to 0
    await updateBalances();
}

// Call initialization when page loads
document.addEventListener('DOMContentLoaded', initializeApp);

// Update wallet button appearance
function updateWalletButton() {
    if (isWalletConnected && connectedAccount) {
        // Show shortened address with copy button
        const shortAddress = `${connectedAccount.slice(0, 6)}...${connectedAccount.slice(-4)}`;
        connectWalletBtn.innerHTML = `
            <span class="wallet-icon">✅</span>
            <span class="wallet-address">${shortAddress}</span>
            <button class="copy-address-btn" title="Copy address">
                <span class="copy-icon">📋</span>
            </button>
        `;
        connectWalletBtn.style.background = 'rgba(40, 167, 69, 0.2)';
        connectWalletBtn.style.borderColor = 'rgba(40, 167, 69, 0.5)';
        
        // Add tooltip with full address
        connectWalletBtn.title = `Connected: ${connectedAccount}`;
        
        // Add click event for copy button
        const copyBtn = connectWalletBtn.querySelector('.copy-address-btn');
        copyBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent wallet disconnect
            copyAddressToClipboard();
        });
    } else {
        connectWalletBtn.innerHTML = `
            <span class="wallet-icon">🔗</span>
            Connect Wallet
        `;
        connectWalletBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        connectWalletBtn.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        connectWalletBtn.title = 'Click to connect wallet';
    }
}

// Copy address to clipboard function
async function copyAddressToClipboard() {
    try {
        await navigator.clipboard.writeText(connectedAccount);
        showNotification('Address copied to clipboard!', 'success');
        
        // Visual feedback on copy button
        const copyBtn = connectWalletBtn.querySelector('.copy-address-btn');
        const copyIcon = copyBtn.querySelector('.copy-icon');
        copyIcon.textContent = '✅';
        copyBtn.style.background = 'rgba(40, 167, 69, 0.3)';
        
        // Reset after 2 seconds
        setTimeout(() => {
            copyIcon.textContent = '📋';
            copyBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        }, 2000);
        
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = connectedAccount;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        showNotification('Address copied to clipboard!', 'success');
    }
}

// Claim button functionality
claimBtn.addEventListener('click', async () => {
    if (!isWalletConnected || !web3Instance) {
        showNotification('Please connect your wallet first to claim USDT', 'error');
        return;
    }
    
    try {
        // Check if user is eligible to claim
        const canClaim = await checkClaimEligibility();
        if (!canClaim) {
            showNotification('You are not eligible to claim USDT at this time', 'error');
            return;
        }
        
        // Get claim amount
        const claimAmount = await usdtContract.methods.CLAIM_AMOUNT().call();
        const claimAmountFormatted = parseFloat(web3Instance.utils.fromWei(claimAmount, 'ether')).toFixed(2);
        
        // Confirm claim with user
        const confirmed = confirm(`You are about to claim ${claimAmountFormatted} USDT. Do you want to continue?`);
        if (!confirmed) {
            return;
        }
        
        claimBtn.disabled = true;
        claimBtn.innerHTML = '<span class="claim-icon">⏳</span> Claiming...';
        
        // Call the claim function on the USDT contract
        const claimTx = await usdtContract.methods.claim()
            .send({ from: connectedAccount });
        
        if (claimTx.status) {
            showNotification(`Successfully claimed ${claimAmountFormatted} USDT!`, 'success');
            // Refresh balances after claiming
            await updateBalances();
            // Disable claim button after successful claim
            claimBtn.disabled = true;
            claimBtn.innerHTML = '<span class="claim-icon">✅</span> Claimed';
        }
        
    } catch (error) {
        console.error('Error claiming USDT:', error);
        
        // Handle specific error cases
        if (error.message.includes('already claimed')) {
            showNotification('You have already claimed your USDT tokens', 'error');
            claimBtn.disabled = true;
            claimBtn.innerHTML = '<span class="claim-icon">✅</span> Already Claimed';
        } else if (error.message.includes('insufficient funds')) {
            showNotification('Insufficient funds for transaction', 'error');
        } else if (error.message.includes('user rejected')) {
            showNotification('Transaction was cancelled', 'info');
        } else {
            showNotification('Failed to claim USDT. Please try again.', 'error');
        }
    } finally {
        if (!claimBtn.disabled) {
            claimBtn.disabled = false;
            claimBtn.innerHTML = '<span class="claim-icon">💰</span> Claim USDT';
        }
    }
});

// Update balances function
async function updateBalances() {
    if (!connectedAccount) {
        // Reset balances to 0 when not connected
        document.getElementById('usdtBalance').textContent = '0.00';
        document.getElementById('kaiaBalance').textContent = '0.00';
        return;
    }
    
    try {
        // Get USDT balance
        const usdtBalance = await usdtContract.methods.balanceOf(connectedAccount).call();
        const usdtFormatted = parseFloat(web3Instance.utils.fromWei(usdtBalance, 'ether')).toFixed(2);
        document.getElementById('usdtBalance').textContent = usdtFormatted;
        
        // Get native KAIA balance
        const kaiaBalance = await web3Instance.eth.getBalance(connectedAccount);
        const kaiaFormatted = parseFloat(web3Instance.utils.fromWei(kaiaBalance, 'ether')).toFixed(4);
        document.getElementById('kaiaBalance').textContent = kaiaFormatted;
        
        console.log('Balances updated:', { usdt: usdtFormatted, kaia: kaiaFormatted });
        
    } catch (error) {
        console.error('Error updating balances:', error);
        // Keep previous values if there's an error
    }
}

// Check if user can claim USDT
async function checkClaimEligibility() {
    if (!connectedAccount || !usdtContract) return false;
    
    try {
        // Check if user has already claimed by checking their balance
        const balance = await usdtContract.methods.balanceOf(connectedAccount).call();
        const hasBalance = parseInt(balance) > 0;
        
        // Check if user has claimed before (you might need to add a mapping in your contract)
        // For now, we'll assume they can claim if they have no balance
        const canClaim = !hasBalance;
        
        // Update claim button state
        if (canClaim) {
            claimBtn.disabled = false;
            claimBtn.innerHTML = '<span class="claim-icon">💰</span> Claim USDT';
        } else {
            claimBtn.disabled = true;
            claimBtn.innerHTML = '<span class="claim-icon">✅</span> Already Claimed';
        }
        
        return canClaim;
        
    } catch (error) {
        console.error('Error checking claim eligibility:', error);
        claimBtn.disabled = true;
        return false;
    }
}

// Check if user is eligible to claim winnings for a specific market
async function checkMarketClaimEligibility(marketId) {
    if (!isWalletConnected || !connectedAccount || !predictionMarketContract) {
        return false;
    }
    
    try {
        // Get user's shares in this market
        const sharesBalance = await predictionMarketContract.methods.getSharesBalance(marketId, connectedAccount).call();
        const optionAShares = parseInt(sharesBalance.optionAShares.toString());
        const optionBShares = parseInt(sharesBalance.optionBShares.toString());
        
        // User is eligible if they have shares in the winning option
        return optionAShares > 0 || optionBShares > 0;
    } catch (error) {
        console.error('Error checking market claim eligibility:', error);
        return false;
    }
}

// Claim winnings for a specific market
async function claimMarketWinnings(marketId) {
    if (!isWalletConnected || !web3Instance) {
        showNotification('Please connect your wallet to claim winnings', 'error');
        return;
    }
    
    if (!predictionMarketContract) {
        showNotification('Contracts not initialized. Please try again.', 'error');
        return;
    }
    
    try {
        showNotification('Claiming winnings...', 'info');
        const claimTx = await predictionMarketContract.methods.claimWinnings(marketId)
            .send({ from: connectedAccount });
        
        if (claimTx.status) {
            showNotification('Winnings claimed successfully!', 'success');
            // Reload markets to update UI
            await loadMarkets();
            // Update balances
            await updateBalances();
        }
    } catch (error) {
        console.error('Error claiming winnings:', error);
        if (error.message.includes('No winnings to claim')) {
            showNotification('No winnings to claim for this market', 'error');
        } else {
            showNotification('Failed to claim winnings. Please try again.', 'error');
        }
    }
}

let abi_usdt = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
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
		"inputs": [],
		"name": "CLAIM_AMOUNT",
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
				"name": "amount",
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
		"inputs": [],
		"name": "claim",
		"outputs": [],
		"stateMutability": "nonpayable",
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
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "subtractedValue",
				"type": "uint256"
			}
		],
		"name": "decreaseAllowance",
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
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "addedValue",
				"type": "uint256"
			}
		],
		"name": "increaseAllowance",
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
		"inputs": [
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "safeTransfer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "_data",
				"type": "bytes"
			}
		],
		"name": "safeTransfer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "_data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
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
				"name": "amount",
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
				"name": "amount",
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
	}
];

let abi_predictionMarket = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_bettingToken",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "marketId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Claimed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "marketId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "question",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "optionA",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "optionB",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "endTime",
				"type": "uint256"
			}
		],
		"name": "MarketCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "marketId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "enum PredictionMarket.MarketOutcome",
				"name": "outcome",
				"type": "uint8"
			}
		],
		"name": "MarketResolved",
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
				"indexed": true,
				"internalType": "uint256",
				"name": "marketId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "isOptionA",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "SharesPurchased",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "bettingToken",
		"outputs": [
			{
				"internalType": "contract IKIP7",
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
				"internalType": "uint256",
				"name": "_marketId",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_isOptionA",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "buyShares",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_marketId",
				"type": "uint256"
			}
		],
		"name": "claimWinnings",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_question",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_optionA",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_optionB",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_duration",
				"type": "uint256"
			}
		],
		"name": "createMarket",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_marketId",
				"type": "uint256"
			}
		],
		"name": "getMarketInfo",
		"outputs": [
			{
				"internalType": "string",
				"name": "question",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "optionA",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "optionB",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "endTime",
				"type": "uint256"
			},
			{
				"internalType": "enum PredictionMarket.MarketOutcome",
				"name": "outcome",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "totalOptionAShares",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalOptionBShares",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "resolved",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_marketId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "getSharesBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "optionAShares",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "optionBShares",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "marketCount",
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
				"name": "",
				"type": "uint256"
			}
		],
		"name": "markets",
		"outputs": [
			{
				"internalType": "string",
				"name": "question",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "endTime",
				"type": "uint256"
			},
			{
				"internalType": "enum PredictionMarket.MarketOutcome",
				"name": "outcome",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "optionA",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "optionB",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "totalOptionAShares",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalOptionBShares",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "resolved",
				"type": "bool"
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_marketId",
				"type": "uint256"
			},
			{
				"internalType": "enum PredictionMarket.MarketOutcome",
				"name": "_outcome",
				"type": "uint8"
			}
		],
		"name": "resolveMarket",
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

