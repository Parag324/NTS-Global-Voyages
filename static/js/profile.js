document.addEventListener('DOMContentLoaded', function() {
    console.log('Profile page loaded, initializing components...');
    
    initializeQuickActions();
    initializeTransactionFilters();
    initializeSupportButton();
    initializeProgressBar();
    initializeTransactionHover();
    initializeSearchFunctionality();
    initializeDropdowns();
    initializeKeyboardShortcuts();
    
    // Test the functionality after a short delay
    setTimeout(() => {
        testFunctionality();
    }, 1000);
});

function testFunctionality() {
    console.log('Testing functionality...');
    
    const filterBtn = document.getElementById('filterBtn');
    const latestFirstBtn = document.getElementById('latestFirstBtn');
    const transactionContainer = document.querySelector('.space-y-4');
    
    console.log('Test results:');
    console.log('- Filter button exists:', !!filterBtn);
    console.log('- Latest First button exists:', !!latestFirstBtn);
    console.log('- Transaction container exists:', !!transactionContainer);
    
    if (transactionContainer) {
        const monthGroups = transactionContainer.children;
        console.log('- Number of month groups:', monthGroups.length);
        
        for (let i = 0; i < monthGroups.length; i++) {
            const monthText = monthGroups[i].querySelector('.text-sm.font-semibold.text-gray-700.mb-2')?.textContent;
            console.log(`  - Month ${i + 1}:`, monthText);
        }
    }
    
    // Test the sorting functionality
    console.log('Testing sorting functionality...');
    if (latestFirstBtn) {
        console.log('Latest First button is ready for testing');
        console.log('Click the button to test sorting');
    }
}



function initializeQuickActions() {
    const viewStatementBtn = document.getElementById('viewStatementBtn');
    const downloadHistoryBtn = document.getElementById('downloadHistoryBtn');
    const pointsCalculatorBtn = document.getElementById('pointsCalculatorBtn');
    
    if (viewStatementBtn) {
        viewStatementBtn.addEventListener('click', function() {
            console.log('View Statement clicked');
            const originalContent = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin text-blue-600"></i><span class="text-gray-700">Loading...</span>';
            this.disabled = true;
            
            showNotification('Opening statement...', 'info');
            
            setTimeout(() => {
                openStatementModal();
                this.innerHTML = originalContent;
                this.disabled = false;
                showNotification('Statement opened successfully!', 'success');
            }, 1500);
        });
    }
    
    if (downloadHistoryBtn) {
        downloadHistoryBtn.addEventListener('click', function() {
            console.log('Download History clicked');
            const originalContent = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin text-green-600"></i><span class="text-gray-700">Downloading...</span>';
            this.disabled = true;
            
            showNotification('Downloading transaction history...', 'info');
            
            setTimeout(() => {
                triggerDownload();
                this.innerHTML = originalContent;
                this.disabled = false;
                showNotification('Download completed!', 'success');
            }, 2000);
        });
    }
    
    if (pointsCalculatorBtn) {
        pointsCalculatorBtn.addEventListener('click', function() {
            console.log('Points Calculator clicked');
            const originalContent = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin text-purple-600"></i><span class="text-gray-700">Loading...</span>';
            this.disabled = true;
            
            showNotification('Opening points calculator...', 'info');
            
            setTimeout(() => {
                openCalculatorModal();
                this.innerHTML = originalContent;
                this.disabled = false;
                showNotification('Calculator ready!', 'success');
            }, 1000);
        });
    }
}

function initializeTransactionFilters() {
    const filterBtn = document.getElementById('filterBtn');
    const latestFirstBtn = document.getElementById('latestFirstBtn');
    
    console.log('Initializing transaction filters...');
    console.log('Filter button found:', !!filterBtn);
    console.log('Latest First button found:', !!latestFirstBtn);
    
    // Track current sort state
    let currentSortDirection = 'desc'; // Default to latest first
    let isFilterActive = false;
    
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            console.log('Filter button clicked');

            // Toggle filter active state
            isFilterActive = !isFilterActive;
            
            // Update button states
            if (isFilterActive) {
                this.classList.add('bg-blue-50', 'text-blue-600');
                this.classList.remove('text-gray-600', 'hover:text-gray-900');
                latestFirstBtn.classList.remove('bg-blue-50', 'text-blue-600');
                latestFirstBtn.classList.add('text-gray-600', 'hover:text-gray-900');
            } else {
                this.classList.remove('bg-blue-50', 'text-blue-600');
                this.classList.add('text-gray-600', 'hover:text-gray-900');
                // Reset filters when deactivating
                resetTransactionFilters();
            }
            
            showNotification('Opening filter options...', 'info');
            showFilterOptions();
            
            setTimeout(() => {
                showNotification('Filter options ready!', 'success');
            }, 500);
        });
    }
    
    if (latestFirstBtn) {
        latestFirstBtn.addEventListener('click', function() {
            console.log('Latest First button clicked');

            // Toggle sort direction
            currentSortDirection = currentSortDirection === 'desc' ? 'asc' : 'desc';
            console.log('New sort direction:', currentSortDirection);
            
            // Update button states
            this.classList.add('bg-blue-50', 'text-blue-600');
            this.classList.remove('text-gray-600', 'hover:text-gray-900');
            filterBtn.classList.remove('bg-blue-50', 'text-blue-600');
            filterBtn.classList.add('text-gray-600', 'hover:text-gray-900');
            
            // Update button text and icon
            const buttonText = this.querySelector('span');
            const buttonIcon = this.querySelector('i.fas');
            
            if (currentSortDirection === 'desc') {
                buttonText.textContent = 'Latest First';
                buttonIcon.className = 'fas fa-chevron-down text-xs';
            } else {
                buttonText.textContent = 'Oldest First';
                buttonIcon.className = 'fas fa-chevron-up text-xs';
            }
            
            showNotification(`Sorting transactions by ${currentSortDirection === 'desc' ? 'latest' : 'oldest'} first...`, 'info');
            sortTransactionsByDate(currentSortDirection);
            
            setTimeout(() => {
                showNotification('Transactions sorted successfully!', 'success');
            }, 1000);
        });
    }
}

function sortTransactionsByDate(direction = 'desc') {
    console.log('Sorting transactions by date:', direction);
    
    const transactionContainer = document.querySelector('.space-y-4');
    if (!transactionContainer) {
        console.error('Transaction container not found');
        return;
    }
    
    const monthGroups = Array.from(transactionContainer.children);
    console.log('Found month groups:', monthGroups.length);

    if (monthGroups.length === 0) {
        console.log('No month groups found to sort');
        return;
    }

    // Add visual feedback during sorting
    monthGroups.forEach(group => {
        group.style.opacity = '0.5';
        group.style.transform = 'translateY(10px)';
        group.style.transition = 'all 0.3s ease';
    });

    // Sort the month groups based on their month text
    monthGroups.sort((a, b) => {
        const monthA = a.querySelector('.text-sm.font-semibold.text-gray-700.mb-2')?.textContent || '';
        const monthB = b.querySelector('.text-sm.font-semibold.text-gray-700.mb-2')?.textContent || '';
        
        console.log('Comparing months:', monthA, 'vs', monthB);
        
        if (!monthA || !monthB) {
            console.warn('Missing month text for comparison');
            return 0;
        }
        
        // Convert month names to dates for proper sorting
        const dateA = new Date(monthA + ' 1, 2023');
        const dateB = new Date(monthB + ' 1, 2023');
        
        // Check if dates are valid
        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            console.warn('Invalid date conversion:', monthA, monthB);
            return 0;
        }
        
        if (direction === 'desc') {
            return dateB - dateA; // Latest first
        } else {
            return dateA - dateB; // Oldest first
        }
    });

    // Clear the container and re-append sorted groups
    transactionContainer.innerHTML = '';
    monthGroups.forEach(group => {
        transactionContainer.appendChild(group);
    });

    // Restore visual appearance
    setTimeout(() => {
        monthGroups.forEach(group => {
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        });
    }, 300);
    
    console.log('Sorting completed successfully');
}

function showFilterOptions() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold">Filter Transactions</h3>
                <button class="text-gray-500 hover:text-gray-700" onclick="this.closest('.fixed').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
                    <div class="space-y-2">
                        <label class="flex items-center">
                            <input type="checkbox" id="filter-all" class="mr-2" checked> All Transactions
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" id="filter-earned" class="mr-2"> Points Earned
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" id="filter-redeemed" class="mr-2"> Points Redeemed
                        </label>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                    <div class="grid grid-cols-2 gap-2">
                        <input type="date" id="filter-start-date" class="p-2 border border-gray-300 rounded" value="2023-01-01">
                        <input type="date" id="filter-end-date" class="p-2 border border-gray-300 rounded" value="2023-12-31">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Amount Range</label>
                    <div class="grid grid-cols-2 gap-2">
                        <input type="number" id="filter-min-amount" class="p-2 border border-gray-300 rounded" placeholder="Min points">
                        <input type="number" id="filter-max-amount" class="p-2 border border-gray-300 rounded" placeholder="Max points">
                    </div>
                </div>
                <div class="flex justify-between items-center">
                    <button class="px-4 py-2 text-red-600 hover:text-red-800" onclick="clearFilterForm(this)">Clear All</button>
                    <div class="flex space-x-2">
                        <button class="px-4 py-2 text-gray-600 hover:text-gray-800" onclick="this.closest('.fixed').remove()">Cancel</button>
                        <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onclick="applyFilters(this)">Apply Filters</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Add event listeners for filter checkboxes
    setTimeout(() => {
        const allCheckbox = modal.querySelector('#filter-all');
        const earnedCheckbox = modal.querySelector('#filter-earned');
        const redeemedCheckbox = modal.querySelector('#filter-redeemed');
        
        if (allCheckbox && earnedCheckbox && redeemedCheckbox) {
            allCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    earnedCheckbox.checked = false;
                    redeemedCheckbox.checked = false;
                }
            });
            
            earnedCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    allCheckbox.checked = false;
                }
            });
            
            redeemedCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    allCheckbox.checked = false;
                }
            });
        }
    }, 100);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function applyFilters(button) {
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Applying...';
    button.disabled = true;
    
    const modal = button.closest('.fixed');
    const filterType = modal.querySelector('#filter-all').checked ? 'all' : 
                      modal.querySelector('#filter-earned').checked ? 'earned' : 
                      modal.querySelector('#filter-redeemed').checked ? 'redeemed' : 'all';
    const startDate = modal.querySelector('#filter-start-date').value;
    const endDate = modal.querySelector('#filter-end-date').value;
    const minAmount = modal.querySelector('#filter-min-amount').value;
    const maxAmount = modal.querySelector('#filter-max-amount').value;
    
    // Apply filters to transaction list
    applyTransactionFilters(filterType, startDate, endDate, minAmount, maxAmount);
    
    setTimeout(() => {
        showNotification('Filters applied successfully!', 'success');
        modal.remove();
    }, 1500);
}

function applyTransactionFilters(type, startDate, endDate, minAmount, maxAmount) {
    console.log('Applying transaction filters:', { type, startDate, endDate, minAmount, maxAmount });
    
    const transactionContainer = document.querySelector('.space-y-4');
    if (!transactionContainer) {
        console.error('Transaction container not found for filtering');
        return;
    }
    
    const monthGroups = Array.from(transactionContainer.children);
    console.log('Found month groups for filtering:', monthGroups.length);
    
    monthGroups.forEach(group => {
        const transactions = group.querySelectorAll('.bg-gray-50.rounded-lg');
        let hasVisibleTransactions = false;
        
        console.log('Processing group with transactions:', transactions.length);
        
        transactions.forEach(transaction => {
            const transactionText = transaction.textContent.toLowerCase();
            const pointsText = transaction.querySelector('.font-semibold')?.textContent || '';
            const points = parseInt(pointsText.replace(/[^\d-]/g, '')) || 0;
            
            console.log('Transaction points:', points, 'Points text:', pointsText);
            
            let shouldShow = true;
            
            // Filter by type
            if (type === 'earned' && !pointsText.includes('+')) {
                shouldShow = false;
                console.log('Filtered out (not earned):', transactionText);
            } else if (type === 'redeemed' && !pointsText.includes('-')) {
                shouldShow = false;
                console.log('Filtered out (not redeemed):', transactionText);
            }
            
            // Filter by amount range
            if (minAmount && points < parseInt(minAmount)) {
                shouldShow = false;
                console.log('Filtered out (below min):', points, '<', minAmount);
            }
            if (maxAmount && points > parseInt(maxAmount)) {
                shouldShow = false;
                console.log('Filtered out (above max):', points, '>', maxAmount);
            }
            
            // Apply visibility
            if (shouldShow) {
                transaction.style.display = 'flex';
                hasVisibleTransactions = true;
            } else {
                transaction.style.display = 'none';
            }
        });
        
        // Show/hide month group based on visible transactions
        if (hasVisibleTransactions) {
            group.style.display = 'block';
        } else {
            group.style.display = 'none';
        }
    });
    
    console.log('Filtering completed');
}

function resetTransactionFilters() {
    const transactionContainer = document.querySelector('.space-y-4');
    if (!transactionContainer) return;
    
    const monthGroups = Array.from(transactionContainer.children);
    
    monthGroups.forEach(group => {
        group.style.display = 'block';
        const transactions = group.querySelectorAll('.bg-gray-50.rounded-lg');
        
        transactions.forEach(transaction => {
            transaction.style.display = 'flex';
        });
    });
    
    showNotification('Filters reset successfully!', 'success');
}

function clearFilterForm(button) {
    const modal = button.closest('.fixed');
    
    // Reset checkboxes
    modal.querySelector('#filter-all').checked = true;
    modal.querySelector('#filter-earned').checked = false;
    modal.querySelector('#filter-redeemed').checked = false;
    
    // Reset date inputs
    modal.querySelector('#filter-start-date').value = '2023-01-01';
    modal.querySelector('#filter-end-date').value = '2023-12-31';
    
    // Reset amount inputs
    modal.querySelector('#filter-min-amount').value = '';
    modal.querySelector('#filter-max-amount').value = '';
    
    showNotification('Filter form cleared!', 'info');
}

function initializeSupportButton() {
    const supportButton = document.getElementById('contactSupportBtn');
    
    if (supportButton) {
        supportButton.addEventListener('click', function() {
            console.log('Contact support clicked');

            const originalText = this.textContent;
            this.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Connecting...`;
            this.disabled = true;
            
            showNotification('Opening support chat...', 'info');
 
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
                showNotification('Support team will contact you shortly!', 'success');
                openSupportChat();
            }, 2000);
        });
    }
}

function initializeProgressBar() {
    const progressBar = document.querySelector('.bg-gradient-to-r.from-blue-500.to-purple-600');
    
    if (progressBar) {
        progressBar.style.width = '0%';

        setTimeout(() => {
            progressBar.style.transition = 'width 1.5s ease-in-out';
            progressBar.style.width = '75%';
        }, 500);
    }
}

function initializeTransactionHover() {
    const transactions = document.querySelectorAll('.bg-gray-50.rounded-lg');
    
    transactions.forEach(transaction => {
        transaction.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            this.style.transition = 'all 0.2s ease';
            this.style.cursor = 'pointer';
        });
        
        transaction.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });

        transaction.addEventListener('click', function() {
            const transactionTitle = this.querySelector('.font-medium.text-gray-900');
            if (transactionTitle) {
                showNotification(`Viewing details for: ${transactionTitle.textContent}`, 'info');
                openTransactionDetails(transactionTitle.textContent);
            }
        });
    });
}

function initializeSearchFunctionality() {
    const searchInput = document.querySelector('input[placeholder="Search destinati..."]');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            console.log('Search query:', query);
            
            if (query.length > 2) {
                showNotification(`Searching for: ${query}`, 'info');
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value;
                if (query.trim()) {
                    showNotification(`Searching destinations for: ${query}`, 'info');
                }
            }
        });
    }
}

function initializeDropdowns() {
    const dropdownButtons = document.querySelectorAll('.fas.fa-chevron-down');
    
    dropdownButtons.forEach(button => {
        button.parentElement.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdownType = this.textContent.includes('Profile') ? 'profile' : 'language';
            console.log(`${dropdownType} dropdown clicked`);
            
            showNotification(`${dropdownType.charAt(0).toUpperCase() + dropdownType.slice(1)} menu opened`, 'info');
        });
    });
}

function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            showNotification('Opening statement...', 'info');
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            showNotification('Downloading transaction history...', 'info');
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
            e.preventDefault();
            showNotification('Opening support chat...', 'info');
        }
    });
}

function openStatementModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold">Monthly Statement - July 2023</h3>
                <button class="text-gray-500 hover:text-gray-700" onclick="this.closest('.fixed').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="space-y-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="flex items-center justify-between mb-3">
                        <div>
                            <h4 class="font-semibold text-gray-900">John Smith</h4>
                            <p class="text-sm text-gray-600">Gold Member</p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm text-gray-600">Statement Period</p>
                            <p class="font-semibold">July 1-31, 2023</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p class="text-gray-600">Opening Balance</p>
                            <p class="font-semibold">9,950 points</p>
                        </div>
                        <div>
                            <p class="text-gray-600">Closing Balance</p>
                            <p class="font-semibold">12,450 points</p>
                        </div>
                        <div>
                            <p class="text-gray-600">Points Earned</p>
                            <p class="font-semibold text-green-600">+2,500 points</p>
                        </div>
                        <div>
                            <p class="text-gray-600">Points Redeemed</p>
                            <p class="font-semibold text-red-600">0 points</p>
                        </div>
                    </div>
                </div>
                <div class="border-t pt-4">
                    <h5 class="font-semibold mb-2">Transactions This Month:</h5>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span>Mediterranean Cruise Booking</span>
                            <span class="text-green-600">+2,500</span>
                        </div>
                    </div>
                </div>
                <div class="flex justify-end space-x-2">
                    <button class="px-4 py-2 text-gray-600 hover:text-gray-800" onclick="this.closest('.fixed').remove()">Close</button>
                    <button class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" onclick="downloadStatement()">
                        <i class="fas fa-download mr-2"></i>Download PDF
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function downloadStatement() {
    const statementContent = `NTS Global Voyage - Monthly Statement
===========================================

Customer: John Smith
Member Level: Gold
Statement Period: July 1-31, 2023

OPENING BALANCE: 9,950 points
CLOSING BALANCE: 12,450 points

TRANSACTIONS:
- Mediterranean Cruise Booking (MED23071501): +2,500 points

SUMMARY:
Points Earned: +2,500
Points Redeemed: 0
Net Change: +2,500

Generated on: ${new Date().toLocaleDateString()}
`;

    const blob = new Blob([statementContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `statement_july_2023_${new Date().toISOString().split('T')[0]}.txt`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showNotification('Statement downloaded successfully!', 'success');
    } else {
        window.open('data:text/plain;charset=utf-8,' + encodeURIComponent(statementContent));
    }
}

function openCalculatorModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

    const modalId = 'calculator-' + Date.now();
    const activitySelectId = 'activitySelect-' + modalId;
    const amountInputId = 'amountInput-' + modalId;
    const estimatedPointsId = 'estimatedPoints-' + modalId;
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 border border-gray-100">
            <div class="flex justify-between items-center mb-6">
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <i class="fas fa-calculator text-blue-600"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900">Points Calculator</h3>
                </div>
                <button class="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100" onclick="this.closest('.fixed').remove()">
                    <i class="fas fa-times text-lg"></i>
                </button>
            </div>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Select Activity</label>
                    <select id="${activitySelectId}" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200">
                        <option value="cruise">🚢 Cruise Booking</option>
                        <option value="hotel">🏨 Hotel Stay</option>
                        <option value="flight">✈️ Flight Booking</option>
                        <option value="dining">🍽️ Dining</option>
                        <option value="spa">💆 Spa & Wellness</option>
                        <option value="excursion">🏝️ Shore Excursion</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Amount ($)</label>
                    <input type="number" id="${amountInputId}" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" placeholder="Enter amount" min="0" step="0.01">
                </div>
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-700">Estimated Points</p>
                            <p class="text-xs text-gray-500 mt-1">Based on activity type and amount spent</p>
                        </div>
                        <div class="text-right">
                            <span id="${estimatedPointsId}" class="text-2xl font-bold text-blue-600">0</span>
                            <p class="text-xs text-gray-500">points</p>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 class="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                        <i class="fas fa-info-circle text-blue-500 mr-2"></i>Points Rates
                    </h4>
                    <div class="grid grid-cols-1 gap-2 text-xs text-gray-600">
                        <div class="flex justify-between items-center">
                            <span>🚢 Cruise Booking</span>
                            <span class="font-semibold text-blue-600">10 points/$1</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span>🏨 Hotel Stay</span>
                            <span class="font-semibold text-blue-600">8 points/$1</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span>✈️ Flight Booking</span>
                            <span class="font-semibold text-blue-600">6 points/$1</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span>🍽️ Dining</span>
                            <span class="font-semibold text-blue-600">5 points/$1</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span>💆 Spa & Wellness</span>
                            <span class="font-semibold text-blue-600">7 points/$1</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span>🏝️ Shore Excursion</span>
                            <span class="font-semibold text-blue-600">9 points/$1</span>
                        </div>
                    </div>
                </div>
                <div class="flex justify-end space-x-2">
                    <button class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200" onclick="this.closest('.fixed').remove()">Close</button>
                    <button onclick="window.calculatePoints()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <i class="fas fa-calculator mr-2"></i>Calculate
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    setTimeout(() => {
        const calculateBtn = modal.querySelector('button[onclick*="calculatePoints"]');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Calculate button clicked via backup event listener');
                window.calculatePoints();
            });
        }
    }, 50);

    const activitySelect = modal.querySelector(`#${activitySelectId}`);
    const amountInput = modal.querySelector(`#${amountInputId}`);
    const calculateBtn = modal.querySelector('#calculateBtn');
    
    activitySelect.addEventListener('change', () => calculatePointsInModal(modal, activitySelectId, amountInputId, estimatedPointsId));
    amountInput.addEventListener('input', () => calculatePointsInModal(modal, activitySelectId, amountInputId, estimatedPointsId));

    window.calculatePoints = function() {
        console.log('Global calculatePoints function called');

        const modal = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50');
        if (!modal) {
            console.error('No modal found');
            return;
        }

        const activitySelect = modal.querySelector('select');
        const amountInput = modal.querySelector('input[type="number"]');
        const estimatedPoints = modal.querySelector('.font-bold.text-blue-600');
        
        console.log('Found elements:', { activitySelect, amountInput, estimatedPoints });
        
        if (!activitySelect || !amountInput || !estimatedPoints) {
            console.error('Could not find required elements');
            return;
        }
        
        const activity = activitySelect.value;
        const amount = parseFloat(amountInput.value) || 0;
        
        console.log('Values:', { activity, amount });

        const rates = {
            'cruise': 10,
            'hotel': 8,
            'flight': 6,
            'dining': 5,
            'spa': 7,
            'excursion': 9
        };
        
        const rate = rates[activity] || 5;
        const points = Math.round(amount * rate);
        
        console.log('Calculation:', { rate, points });
        
        estimatedPoints.textContent = points.toLocaleString();

        estimatedPoints.style.transform = 'scale(1.1)';
        estimatedPoints.style.transition = 'transform 0.2s ease';
        setTimeout(() => {
            estimatedPoints.style.transform = 'scale(1)';
        }, 200);
        
        console.log('Points calculated:', { activity, amount, rate, points });

        showNotification(`Points calculated: ${points.toLocaleString()} points for ${activity}`, 'success');
    };
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function calculatePointsInModal(modal, activitySelectId, amountInputId, estimatedPointsId) {
    console.log('calculatePointsInModal called with:', { modal, activitySelectId, amountInputId, estimatedPointsId });

    const activitySelect = document.getElementById(activitySelectId);
    const amountInput = document.getElementById(amountInputId);
    const estimatedPoints = document.getElementById(estimatedPointsId);
    
    console.log('Found elements:', { activitySelect, amountInput, estimatedPoints });
    
    if (!activitySelect || !amountInput || !estimatedPoints) {
        console.error('Could not find required elements:', { activitySelectId, amountInputId, estimatedPointsId });
        return;
    }
    
    const activity = activitySelect.value;
    const amount = parseFloat(amountInput.value) || 0;
    
    console.log('Values:', { activity, amount });

    const rates = {
        'cruise': 10,
        'hotel': 8,
        'flight': 6,
        'dining': 5,
        'spa': 7,
        'excursion': 9
    };
    
    const rate = rates[activity] || 5;
    const points = Math.round(amount * rate);
    
    console.log('Calculation:', { rate, points });
    
    estimatedPoints.textContent = points.toLocaleString();
    estimatedPoints.style.transform = 'scale(1.1)';
    estimatedPoints.style.transition = 'transform 0.2s ease';
    setTimeout(() => {
        estimatedPoints.style.transform = 'scale(1)';
    }, 200);
    
    console.log('Points calculated:', { activity, amount, rate, points });
}

function openSupportChat() {
    const modal = document.createElement('div');
    modal.className = 'fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border w-80 z-50';
    modal.innerHTML = `
        <div class="p-4 border-b">
            <div class="flex justify-between items-center">
                <h3 class="font-bold">Support Chat</h3>
                <button class="text-gray-500 hover:text-gray-700" onclick="this.closest('.fixed').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="p-4 h-64 overflow-y-auto">
            <div class="bg-blue-100 p-3 rounded-lg mb-3">
                <p class="text-sm">Hello! How can we help you today?</p>
            </div>
            <div class="bg-gray-100 p-3 rounded-lg mb-3">
                <p class="text-sm">I need help with my points balance</p>
            </div>
        </div>
        <div class="p-4 border-t">
            <div class="flex space-x-2">
                <input type="text" placeholder="Type your message..." class="flex-1 p-2 border border-gray-300 rounded">
                <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function openTransactionDetails(transactionName) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold">Transaction Details</h3>
                <button class="text-gray-500 hover:text-gray-700" onclick="this.closest('.fixed').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="space-y-4">
                <div>
                    <h4 class="font-semibold">${transactionName}</h4>
                    <p class="text-gray-600">Transaction ID: TXN123456789</p>
                    <p class="text-gray-600">Date: July 15, 2023</p>
                    <p class="text-gray-600">Status: Completed</p>
                </div>
                <div class="bg-gray-50 p-3 rounded">
                    <p class="text-sm text-gray-600">Points: <span class="font-bold text-green-600">+2,500</span></p>
                </div>
                <div class="flex justify-end">
                    <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onclick="this.closest('.fixed').remove()">Close</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function triggerDownload() {
    const csvContent = `Transaction History for John Smith
Date,Description,Transaction ID,Points,Type
2023-07-15,Mediterranean Cruise Booking,MED23071501,+2500,Earned
2023-06-28,Airport Lounge Access,LHR28062023,-1000,Redeemed
2023-06-12,Caribbean Island Hopping Tour,CAR23061202,+1750,Earned
2023-05-25,Hotel Booking Bonus,Hilton Resort Maldives,+980,Earned
2023-05-03,Cabin Upgrade,Alaska Cruise AS23050301,-1780,Redeemed

Summary:
Total Points Earned: 5230
Total Points Redeemed: 2780
Current Balance: 12450
Generated on: ${new Date().toLocaleDateString()}`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `transaction_history_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } else {
        window.open('data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    }
}

function showNotification(message, type = 'info') {
    console.log(`${type.toUpperCase()}: ${message}`);
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 16px 24px;
        border-radius: 6px;
        z-index: 10001;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .bg-gray-50.rounded-lg {
        transition: all 0.2s ease;
    }
    
    .bg-gray-50.rounded-lg:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
`;
document.head.appendChild(style);

function handleResize() {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
        const mainContent = document.querySelector('.max-w-7xl.mx-auto.px-4.sm\\:px-6.lg\\:px-8.py-8');
        if (mainContent) {
            mainContent.style.padding = '1rem';
        }
    }
}

window.addEventListener('resize', handleResize);
handleResize(); 