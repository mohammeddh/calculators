/**
 * Core JavaScript functionality for WebSpace Calculator Tools
 */

// Global app namespace
window.WebSpace = window.WebSpace || {};

// Core utilities
WebSpace.Core = {

    // Initialize core functionality
    init: function() {
        this.setupMobileMenu();
        this.setupAccessibility();
        this.setupGlobalEventListeners();
        this.loadingState = false;
    },

    // Mobile menu functionality
    setupMobileMenu: function() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const menu = document.querySelector('.mobile-menu');

        if (toggle && menu) {
            toggle.addEventListener('click', function() {
                const isActive = toggle.classList.contains('active');

                if (isActive) {
                    toggle.classList.remove('active');
                    menu.classList.remove('active');
                    document.body.style.overflow = '';
                } else {
                    toggle.classList.add('active');
                    menu.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                    toggle.classList.remove('active');
                    menu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && menu.classList.contains('active')) {
                    toggle.classList.remove('active');
                    menu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    },

    // Accessibility enhancements
    setupAccessibility: function() {
        // Add skip link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main content ID
        const mainContent = document.querySelector('.main-content');
        if (mainContent && !mainContent.id) {
            mainContent.id = 'main-content';
        }

        // Improve focus management
        this.setupFocusManagement();
    },

    // Focus management for better keyboard navigation
    setupFocusManagement: function() {
        // Trap focus in modals (if any)
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                const modal = document.querySelector('.modal.active');
                if (modal) {
                    WebSpace.Core.trapFocus(e, modal);
                }
            }
        });
    },

    // Trap focus within an element
    trapFocus: function(e, element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    },

    // Global event listeners
    setupGlobalEventListeners: function() {
        // Handle ad clicks
        window.handleAdClick = function(location) {
            console.log('Ad clicked:', location);
            // Add analytics tracking here
            WebSpace.Core.trackEvent('ad_click', { location: location });
        };

        // Handle newsletter form submissions
        document.addEventListener('submit', function(e) {
            if (e.target.classList.contains('newsletter-form')) {
                e.preventDefault();
                WebSpace.Core.handleNewsletterSubmit(e.target);
            }
        });

        // Handle external links
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (link && link.hostname !== window.location.hostname) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    },

    // Newsletter submission handler
    handleNewsletterSubmit: function(form) {
        const email = form.querySelector('input[name="email"]').value;
        const submitBtn = form.querySelector('button[type="submit"]');

        if (!this.validateEmail(email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        this.setLoadingState(submitBtn, true);

        // Simulate API call (replace with actual implementation)
        setTimeout(() => {
            this.setLoadingState(submitBtn, false);
            this.showMessage('Thank you for subscribing!', 'success');
            form.reset();
            this.trackEvent('newsletter_signup', { email: email });
        }, 1000);
    },

    // Email validation
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Loading state management
    setLoadingState: function(element, isLoading) {
        if (isLoading) {
            element.classList.add('loading');
            element.disabled = true;
            element.setAttribute('aria-busy', 'true');
        } else {
            element.classList.remove('loading');
            element.disabled = false;
            element.setAttribute('aria-busy', 'false');
        }
    },

    // Show messages to user
    showMessage: function(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type} fade-in`;
        messageEl.textContent = message;
        messageEl.setAttribute('role', type === 'error' ? 'alert' : 'status');

        // Insert at top of main content
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.insertBefore(messageEl, mainContent.firstChild);
        }

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);

        // Allow manual dismissal
        messageEl.addEventListener('click', function() {
            messageEl.remove();
        });
    },

    // Event tracking (replace with your analytics solution)
    trackEvent: function(eventName, eventData = {}) {
        // Google Analytics example:
        // gtag('event', eventName, eventData);

        // Console log for development
        console.log('Event tracked:', eventName, eventData);
    },

    // Utility functions
    utils: {
        // Debounce function
        debounce: function(func, wait, immediate) {
            let timeout;
            return function executedFunction() {
                const context = this;
                const args = arguments;
                const later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        },

        // Throttle function
        throttle: function(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        // Format number with commas
        formatNumber: function(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },

        // Format currency
        formatCurrency: function(amount, currency = 'USD') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency
            }).format(amount);
        }
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        WebSpace.Core.init();
    });
} else {
    WebSpace.Core.init();
}