// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize comparison grid
    initializeComparison();

    // Initialize alerts banner close button
    const alertClose = document.querySelector('.alert-close');
    if (alertClose) {
        alertClose.addEventListener('click', () => {
            const alertsBanner = document.getElementById('alertsBanner');
            if (alertsBanner) {
                alertsBanner.style.display = 'none';
            }
        });
    }

    // Initialize back to top button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

// Initialize comparison grid
function initializeComparison() {
    try {
        const comparisonGrid = document.getElementById('comparisonGrid');
        const plans = JSON.parse(localStorage.getItem('planComparison') || '[]');

        if (plans.length < 2) {
            showAlert('Please select at least 2 plans to compare');
            setTimeout(() => {
                window.location.href = 'plans.html';
            }, 2000);
            return;
        }

        // Get benefits based on plan type
        const getBenefits = (type) => {
            switch(type) {
                case 'data':
                    return [
                        'High-speed data up to 150 Mbps',
                        'Post FUP speed of 64 Kbps',
                        'Data rollover available',
                        'Weekend data bonus'
                    ];
                case 'talktime':
                    return [
                        'Full talktime value',
                        'No additional service tax',
                        'Call rates at 1p/sec',
                        'Valid for both local and STD calls'
                    ];
                case 'unlimited':
                    return [
                        'Truly unlimited voice calls',
                        'High-speed data with daily limits',
                        'Free subscription to Prime Video Mobile',
                        'Access to Hotstar Mobile'
                    ];
                case 'combo':
                    return [
                        'Data and SMS combo pack',
                        'Unlimited local calls',
                        'Weekend data boost',
                        'Free streaming subscriptions'
                    ];
                case 'sms':
                    return [
                        'SMS to any network',
                        'Additional 100 international SMS',
                        'Special rates for bulk SMS',
                        'Free news alerts'
                    ];
                default:
                    return [];
            }
        };

        // Create comparison columns
        comparisonGrid.innerHTML = plans.map(plan => `
            <div class="plan-column">
                <div class="plan-header">
                    <div class="plan-name">${plan.name}</div>
                    <div class="plan-price">₹${plan.price}</div>
                    <div class="plan-type">${plan.type.charAt(0).toUpperCase() + plan.type.slice(1)} Plan</div>
                </div>
                <div class="plan-features">
                    <div class="feature-item">
                        <i class="fas fa-check-circle"></i>
                        <span>${plan.name}</span>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-calendar-alt"></i>
                        <span>28 Days Validity</span>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-signal"></i>
                        <span>Pan India Coverage</span>
                    </div>
                </div>
                <div class="plan-benefits">
                    <div class="benefits-title">Additional Benefits</div>
                    <ul class="benefits-list">
                        ${getBenefits(plan.type).map(benefit => `
                            <li><i class="fas fa-star"></i>${benefit}</li>
                        `).join('')}
                    </ul>
                </div>
                <div class="plan-actions">
                    <button class="btn btn-primary" onclick="selectPlan(${plan.price}, '${plan.name}')">Get This Plan</button>
                    <button class="btn btn-outline" onclick="window.location.href='plans.html'">View Details</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error in initializeComparison:', error);
        showAlert('Error loading comparison. Please try again.');
    }
}

// Select plan
function selectPlan(price, name) {
    try {
        // Check if user is logged in
        const loggedInUser = localStorage.getItem('loggedInUser');
        const storedPhoneNumber = localStorage.getItem('userPhoneNumber');

        if (!loggedInUser && !storedPhoneNumber) {
            showAlert('Please login or enter your mobile number to proceed');
            setTimeout(() => {
                window.location.href = 'plans.html';
            }, 2000);
            return;
        }

        // Store selected plan
        const selectedPlan = {
            price: price,
            name: name,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));

        // Redirect to payment page
        window.location.href = 'payment.html';
    } catch (error) {
        console.error('Error in selectPlan:', error);
        showAlert('Error selecting plan. Please try again.');
    }
}

// Share comparison
function shareComparison() {
    try {
        const modal = document.getElementById('shareModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    } catch (error) {
        console.error('Error in shareComparison:', error);
        showAlert('Error sharing comparison. Please try again.');
    }
}

// Share to platform
function shareTo(platform) {
    try {
        const plans = JSON.parse(localStorage.getItem('planComparison') || '[]');
        const shareText = `Compare ReZap Plans:\n${plans.map(plan => 
            `${plan.name} - ₹${plan.price}`
        ).join('\n')}`;
        
        let shareUrl = '';
        switch(platform) {
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
                break;
            case 'email':
                shareUrl = `mailto:?subject=ReZap Plan Comparison&body=${encodeURIComponent(shareText)}`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank');
        }
        
        closeModal('shareModal');
    } catch (error) {
        console.error('Error in shareTo:', error);
        showAlert('Error sharing. Please try again.');
    }
}

// Copy comparison link
function copyLink() {
    try {
        const plans = JSON.parse(localStorage.getItem('planComparison') || '[]');
        const shareText = `Compare ReZap Plans:\n${plans.map(plan => 
            `${plan.name} - ₹${plan.price}`
        ).join('\n')}`;
        
        navigator.clipboard.writeText(shareText).then(() => {
            showAlert('Comparison details copied to clipboard');
            closeModal('shareModal');
        });
    } catch (error) {
        console.error('Error in copyLink:', error);
        showAlert('Error copying link. Please try again.');
    }
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Show alert message
function showAlert(message) {
    const alertsBanner = document.getElementById('alertsBanner');
    const alertMessage = alertsBanner.querySelector('.alert-message');
    
    alertMessage.textContent = message;
    alertsBanner.style.display = 'flex';
    
    setTimeout(() => {
        alertsBanner.style.display = 'none';
    }, 3000);
}
