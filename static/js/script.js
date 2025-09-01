
let userState = {
    coins: 24500,
    redeemedRewards: [],
    userStats: {
        completedVoyages: 12,
        totalMiles: 24500,
        rewardsRedeemed: 8
    }
};

document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    initializeFilters();
    initializeSorting();
    initializeRewardCards();
    initializeNotifications();
    initializeLanguageSelector();
    initializeProgressBar();
    initializeResponsiveMenu();
    initializeUserStats();
});

function initializeUserStats() {
    updateUserStats();
    updateCoinDisplay();
}

function updateUserStats() {

    const voyageStats = document.querySelectorAll('.stat-value');
    if (voyageStats.length >= 3) {
        voyageStats[0].textContent = userState.userStats.completedVoyages;
        voyageStats[1].textContent = userState.userStats.totalMiles.toLocaleString();
        voyageStats[2].textContent = userState.userStats.rewardsRedeemed;
    }
}

function updateCoinDisplay() {
    const coinElement = document.querySelector('.user-coins span');
    if (coinElement) {
        coinElement.textContent = `${userState.coins.toLocaleString()} Voyage Coins`;
    }
}

function initializeSearch() {
    const headerSearch = document.querySelector('.search-bar input');
    const rewardsSearch = document.querySelector('.search-rewards input');
    
    if (headerSearch) {
        headerSearch.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            console.log('Header search:', query);
        });
    }
    
    if (rewardsSearch) {
        rewardsSearch.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            filterRewards(query);
        });
    }
}

function filterRewards(query) {
    const rewardCards = document.querySelectorAll('.reward-card');
    
    rewardCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const cost = card.querySelector('.reward-cost span').textContent.toLowerCase();
        
        const matches = title.includes(query) || 
                       description.includes(query) || 
                       cost.includes(query);
        
        card.style.display = matches ? 'block' : 'none';
        card.style.opacity = matches ? '1' : '0.5';
    });
}

function initializeFilters() {
    const filterBtn = document.querySelector('.filter-btn');
    
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            showFilterDropdown();
        });
    }
}

function showFilterDropdown() {
    const filterOptions = [
        'All Rewards',
        'Cabin Upgrades',
        'Dining Packages',
        'Spa & Wellness',
        'Experiences',
        'Travel Essentials'
    ];
    
    const dropdown = createDropdown(filterOptions, 'filter');
    const filterBtn = document.querySelector('.filter-btn');

    const rect = filterBtn.getBoundingClientRect();
    dropdown.style.position = 'absolute';
    dropdown.style.top = rect.bottom + 'px';
    dropdown.style.left = rect.left + 'px';
    
    document.body.appendChild(dropdown);

    dropdown.addEventListener('click', function(e) {
        if (e.target.classList.contains('dropdown-item')) {
            const filter = e.target.textContent;
            applyFilter(filter);
            filterBtn.innerHTML = `<i class="fas fa-filter"></i> ${filter} <i class="fas fa-chevron-down"></i>`;
            dropdown.remove();
        }
    });

    document.addEventListener('click', function closeDropdown(e) {
        if (!dropdown.contains(e.target) && !filterBtn.contains(e.target)) {
            dropdown.remove();
            document.removeEventListener('click', closeDropdown);
        }
    });
}

function applyFilter(filter) {
    const rewardCards = document.querySelectorAll('.reward-card');
    
    rewardCards.forEach(card => {
        const title = card.querySelector('h3').textContent;
        let show = true;
        
        switch(filter) {
            case 'Cabin Upgrades':
                show = title.includes('Cabin');
                break;
            case 'Dining Packages':
                show = title.includes('Dining');
                break;
            case 'Spa & Wellness':
                show = title.includes('Spa');
                break;
            case 'Experiences':
                show = title.includes('Experience') || title.includes('Cruise');
                break;
            case 'Travel Essentials':
                show = title.includes('Travel Kit');
                break;
            default:
                show = true;
        }
        
        card.style.display = show ? 'block' : 'none';
    });
}

function initializeSorting() {
    const sortBtn = document.querySelector('.sort-btn');
    
    if (sortBtn) {
        sortBtn.addEventListener('click', function() {
            showSortDropdown();
        });
    }
}

function showSortDropdown() {
    const sortOptions = [
        'Price: Low to High',
        'Price: High to Low',
        'Name: A to Z',
        'Name: Z to A',
        'Most Popular'
    ];
    
    const dropdown = createDropdown(sortOptions, 'sort');
    const sortBtn = document.querySelector('.sort-btn');

    const rect = sortBtn.getBoundingClientRect();
    dropdown.style.position = 'absolute';
    dropdown.style.top = rect.bottom + 'px';
    dropdown.style.left = rect.left + 'px';
    
    document.body.appendChild(dropdown);

    dropdown.addEventListener('click', function(e) {
        if (e.target.classList.contains('dropdown-item')) {
            const sort = e.target.textContent;
            applySort(sort);
            sortBtn.innerHTML = `Sort by ${sort.split(':')[0]} <i class="fas fa-chevron-down"></i>`;
            dropdown.remove();
        }
    });

    document.addEventListener('click', function closeDropdown(e) {
        if (!dropdown.contains(e.target) && !sortBtn.contains(e.target)) {
            dropdown.remove();
            document.removeEventListener('click', closeDropdown);
        }
    });
}

function applySort(sortType) {
    const rewardsGrid = document.querySelector('.rewards-grid');
    const rewardCards = Array.from(document.querySelectorAll('.reward-card'));
    
    rewardCards.sort((a, b) => {
        const titleA = a.querySelector('h3').textContent;
        const titleB = b.querySelector('h3').textContent;
        const costA = parseInt(a.querySelector('.reward-cost span').textContent.replace(',', ''));
        const costB = parseInt(b.querySelector('.reward-cost span').textContent.replace(',', ''));
        
        switch(sortType) {
            case 'Price: Low to High':
                return costA - costB;
            case 'Price: High to Low':
                return costB - costA;
            case 'Name: A to Z':
                return titleA.localeCompare(titleB);
            case 'Name: Z to A':
                return titleB.localeCompare(titleA);
            default:
                return 0;
        }
    });

    rewardCards.forEach(card => {
        rewardsGrid.appendChild(card);
    });
}

function createDropdown(options, type) {
    const dropdown = document.createElement('div');
    dropdown.className = 'custom-dropdown';
    dropdown.style.cssText = `
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        min-width: 200px;
        max-height: 300px;
        overflow-y: auto;
    `;
    
    options.forEach(option => {
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.textContent = option;
        item.style.cssText = `
            padding: 12px 16px;
            cursor: pointer;
            border-bottom: 1px solid #f0f0f0;
            transition: background-color 0.2s;
        `;
        
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f8f9fa';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'white';
        });
        
        dropdown.appendChild(item);
    });
    
    return dropdown;
}

function initializeRewardCards() {
    const redeemButtons = document.querySelectorAll('.redeem-btn');
    
    redeemButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.reward-card');
            const title = card.querySelector('h3').textContent;
            const cost = parseInt(card.querySelector('.reward-cost span').textContent.replace(',', ''));
            if (userState.coins < cost) {
                showErrorMessage(`Insufficient coins. You need ${cost.toLocaleString()} coins but have ${userState.coins.toLocaleString()}.`);
                return;
            }
            
            showRedeemModal(title, cost, card);
        });
    });

    const rewardCards = document.querySelectorAll('.reward-card');
    rewardCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

function showRedeemModal(title, cost, card) {
    const modal = document.createElement('div');
    modal.className = 'redeem-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 32px;
        border-radius: 12px;
        max-width: 400px;
        width: 90%;
        text-align: center;
    `;
    
    modalContent.innerHTML = `
        <h3 style="margin-bottom: 16px; color: #2c3e50;">Redeem Reward</h3>
        <p style="margin-bottom: 8px; color: #7f8c8d;">You're about to redeem:</p>
        <h4 style="margin-bottom: 16px; color: #2c3e50;">${title}</h4>
        <p style="margin-bottom: 8px; color: #7f8c8d;">Cost: <i class="fas fa-coins" style="color: #f39c12;"></i> ${cost.toLocaleString()}</p>
        <p style="margin-bottom: 8px; color: #7f8c8d;">Current Balance: <i class="fas fa-coins" style="color: #f39c12;"></i> ${userState.coins.toLocaleString()}</p>
        <p style="margin-bottom: 24px; color: #7f8c8d;">Remaining after redemption: <i class="fas fa-coins" style="color: #f39c12;"></i> ${(userState.coins - cost).toLocaleString()}</p>
        <div style="display: flex; gap: 12px; justify-content: center;">
            <button class="modal-btn cancel" style="
                padding: 12px 24px;
                border: 1px solid #e0e0e0;
                background: white;
                color: #2c3e50;
                border-radius: 6px;
                cursor: pointer;
            ">Cancel</button>
            <button class="modal-btn confirm" style="
                padding: 12px 24px;
                border: none;
                background: #2c3e50;
                color: white;
                border-radius: 6px;
                cursor: pointer;
            ">Confirm Redemption</button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
 
    modal.querySelector('.cancel').addEventListener('click', function() {
        modal.remove();
    });
    
    modal.querySelector('.confirm').addEventListener('click', function() {

        fetch('/api/redeem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                reward_name: title,
                cost: cost
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                userState.coins -= cost;
                userState.redeemedRewards.push({
                    name: title,
                    cost: cost,
                    redeemedAt: new Date()
                });
                userState.userStats.rewardsRedeemed++;

                updateCoinDisplay();
                updateUserStats();
                updateRewardCard(card, title);
                showSuccessMessage(data.message);

                updateProgressBar();

                showRedeemedRewards();
            } else {
                showErrorMessage('Failed to redeem reward. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showErrorMessage('An error occurred. Please try again.');
        });
        
        modal.remove();
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function updateRewardCard(card, title) {
    const badge = document.createElement('div');
    badge.style.cssText = `
        position: absolute;
        top: 12px;
        right: 12px;
        background: #27ae60;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        z-index: 10;
    `;
    badge.textContent = 'REDEEMED';
    
    const rewardImage = card.querySelector('.reward-image');
    rewardImage.style.position = 'relative';
    rewardImage.appendChild(badge);

    const redeemBtn = card.querySelector('.redeem-btn');
    redeemBtn.disabled = true;
    redeemBtn.textContent = 'Redeemed';
    redeemBtn.style.cssText = `
        background-color: #95a5a6;
        color: #ffffff;
        border: none;
        border-radius: 6px;
        padding: 12px 24px;
        font-size: 14px;
        font-weight: 600;
        cursor: not-allowed;
        width: 100%;
        opacity: 0.7;
    `;

    card.style.opacity = '0.8';
    card.style.filter = 'grayscale(20%)';
}

function showRedeemedRewards() {
    const redeemedSection = document.getElementById('redeemed-rewards');
    const redeemedGrid = document.getElementById('redeemed-grid');
    
    if (redeemedSection && redeemedGrid) {
        redeemedSection.style.display = 'block';

        redeemedGrid.innerHTML = '';

        userState.redeemedRewards.forEach(reward => {
            const redeemedCard = document.createElement('div');
            redeemedCard.className = 'redeemed-card';
            
            const date = new Date(reward.redeemedAt);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
                               redeemedCard.innerHTML = `
                       <h3>${reward.name}</h3>
                       <div class="redeemed-date">Redeemed on ${formattedDate}</div>
                       <div class="redeemed-cost">
                           <i class="fas fa-coins"></i>
                           <span>${reward.cost.toLocaleString()} coins</span>
                       </div>
                       <div class="redeemed-status">Redeemed</div>
                   `;
            
            redeemedGrid.appendChild(redeemedCard);
        });

        redeemedSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function updateProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill && progressText) {
        const targetCoins = 30000;
        const progress = Math.min((userState.coins / targetCoins) * 100, 100);
        const remaining = Math.max(targetCoins - userState.coins, 0);
        
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${remaining.toLocaleString()} coins until Platinum status`;

        progressFill.style.transition = 'width 1s ease-in-out';
    }
}

function showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 16px 24px;
        border-radius: 6px;
        z-index: 10001;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function showErrorMessage(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #e74c3c;
        color: white;
        padding: 16px 24px;
        border-radius: 6px;
        z-index: 10001;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}



function initializeNotifications() {
    const notificationBtn = document.querySelector('.notifications');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            showNotifications();
        });
    }
}

function showNotifications() {
    const notifications = [
        'New reward available: Premium Spa Package',
        'Your voyage to Bali has been confirmed',
        'Earn 500 bonus coins this week!',
        'Special offer: 20% off next booking'
    ];
    
    const dropdown = document.createElement('div');
    dropdown.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        min-width: 300px;
        z-index: 1000;
        max-height: 400px;
        overflow-y: auto;
    `;
    
    dropdown.innerHTML = `
        <div style="padding: 16px; border-bottom: 1px solid #e0e0e0; font-weight: 600; color: #2c3e50;">
            Notifications
        </div>
        ${notifications.map(notification => `
            <div style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; cursor: pointer; transition: background-color 0.2s;" 
                 onmouseover="this.style.backgroundColor='#f8f9fa'" 
                 onmouseout="this.style.backgroundColor='white'">
                ${notification}
            </div>
        `).join('')}
    `;
    
    const notificationBtn = document.querySelector('.notifications');
    notificationBtn.style.position = 'relative';
    notificationBtn.appendChild(dropdown);

    document.addEventListener('click', function closeNotifications(e) {
        if (!dropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
            dropdown.remove();
            document.removeEventListener('click', closeNotifications);
        }
    });
}

function initializeLanguageSelector() {
    const languageBtn = document.querySelector('.language');
    
    if (languageBtn) {
        languageBtn.addEventListener('click', function() {
            showLanguageDropdown();
        });
    }
}

function showLanguageDropdown() {
    const languages = ['English', 'Spanish', 'French', 'German', 'Italian'];
    
    const dropdown = document.createElement('div');
    dropdown.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        min-width: 150px;
        z-index: 1000;
    `;
    
    dropdown.innerHTML = languages.map(lang => `
        <div style="padding: 12px 16px; cursor: pointer; transition: background-color 0.2s;" 
             onmouseover="this.style.backgroundColor='#f8f9fa'" 
             onmouseout="this.style.backgroundColor='white'">
            ${lang}
        </div>
    `).join('');
    
    const languageBtn = document.querySelector('.language');
    languageBtn.style.position = 'relative';
    languageBtn.appendChild(dropdown);

    dropdown.addEventListener('click', function(e) {
        if (e.target.textContent) {
            const selectedLang = e.target.textContent;
            languageBtn.innerHTML = `<i class="fas fa-globe"></i> ${selectedLang.substring(0, 2).toUpperCase()} <i class="fas fa-chevron-down"></i>`;
            dropdown.remove();
            showSuccessMessage(`Language changed to ${selectedLang}`);
        }
    });
    

    document.addEventListener('click', function closeLanguageDropdown(e) {
        if (!dropdown.contains(e.target) && !languageBtn.contains(e.target)) {
            dropdown.remove();
            document.removeEventListener('click', closeLanguageDropdown);
        }
    });
}

function initializeProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    
    if (progressFill) {
        setTimeout(() => {
            progressFill.style.transition = 'width 1s ease-in-out';
            progressFill.style.width = '60%';
        }, 500);
    }
}

function initializeResponsiveMenu() {
    const header = document.querySelector('.header-content');

    if (window.innerWidth <= 768) {
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuBtn.style.cssText = `
            display: none;
            background: none;
            border: none;
            color: #2c3e50;
            font-size: 18px;
            cursor: pointer;
        `;
        
        header.appendChild(mobileMenuBtn);
        
        mobileMenuBtn.addEventListener('click', function() {
            const navLinks = document.querySelector('.nav-links');
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });

        if (window.innerWidth <= 768) {
            mobileMenuBtn.style.display = 'block';
            document.querySelector('.nav-links').style.display = 'none';
        }
    }
}

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
    
    .nav-link.active {
        color: #3498db !important;
    }
    
    .reward-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .custom-dropdown {
        animation: fadeIn 0.2s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .redeem-btn:disabled {
        cursor: not-allowed !important;
    }
`;
document.head.appendChild(style); 