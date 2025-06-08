/**
 * CalcHub - Core JavaScript
 * Optimized for modern browsers (Chrome 88+, Firefox 85+, Safari 14+, Edge 88+)
 */

class CalcHubCore {
    constructor() {
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.setupMobileMenu();
        this.setupBasicForms();
        this.setupAnimations();
        this.setupUtilities();
        this.setupAccessibility();
    }

    // Mobile menu functionality
    setupMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const menu = document.querySelector('.mobile-menu');

        if (!toggle || !menu) return;

        toggle.addEventListener('click', () => {
            const isOpen = menu.classList.contains('active');
            isOpen ? this.closeMobileMenu(toggle, menu) : this.openMobileMenu(toggle, menu);
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                this.closeMobileMenu(toggle, menu);
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                this.closeMobileMenu(toggle, menu);
            }
        });
    }

    openMobileMenu(toggle, menu) {
        toggle.classList.add('active');
        menu.classList.add('active');
        document.body.style.overflow = 'hidden';
        toggle.setAttribute('aria-expanded', 'true');
    }

    closeMobileMenu(toggle, menu) {
        toggle.classList.remove('active');
        menu.classList.remove('active');
        document.body.style.overflow = '';
        toggle.setAttribute('aria-expanded', 'false');
    }

    // Form handling
    setupBasicForms() {
        document.addEventListener('submit', (e) => {
            if (this.elementMatches(e.target, '.newsletter-form')) {
                e.preventDefault();
                this.handleNewsletterSubmit(e.target);
            }

            if (this.elementMatches(e.target, '.contact-form')) {
                e.preventDefault();
                this.handleContactSubmit(e.target);
            }
        });

        // Real-time validation
        document.addEventListener('blur', (e) => {
            if (this.elementMatches(e.target, 'input[required], textarea[required]')) {
                this.validateField(e.target);
            }
        }, true);

        // Auto-expand textareas
        document.addEventListener('input', (e) => {
            if (this.elementMatches(e.target, 'textarea')) {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
            }
        });
    }

    // Safe element matching
    elementMatches(element, selector) {
        return element?.matches?.(selector) ?? false;
    }

    async handleNewsletterSubmit(form) {
        const email = form.querySelector('input[name="email"]')?.value;
        const submitBtn = form.querySelector('button[type="submit"]');

        if (!this.isValidEmail(email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return;
        }

        this.setLoadingState(submitBtn, true);

        try {
            await this.delay(1000); // Simulate API call
            this.showMessage('Thank you for subscribing!', 'success');
            form.reset();
            this.trackEvent('newsletter_signup', { email });
        } catch (error) {
            this.showMessage('Something went wrong. Please try again.', 'error');
        } finally {
            this.setLoadingState(submitBtn, false);
        }
    }

    async handleContactSubmit(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const requiredFields = form.querySelectorAll('input[required], textarea[required]');

        let isValid = true;
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.validateField(field);
                isValid = false;
            }
        });

        if (!isValid) {
            this.showMessage('Please fill in all required fields.', 'error');
            return;
        }

        this.setLoadingState(submitBtn, true);

        try {
            await this.delay(1500); // Simulate API call
            this.showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
            form.reset();
            this.trackEvent('contact_form_submit');
        } catch (error) {
            this.showMessage('Failed to send message. Please try again.', 'error');
        } finally {
            this.setLoadingState(submitBtn, false);
        }
    }

    // Animation setup with Intersection Observer
    setupAnimations() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.feature-card, .calculator-card, .card')
            .forEach((el, index) => {
                el.style.animationDelay = `${index * 0.1}s`;
                el.classList.add('animate-on-scroll');
                observer.observe(el);
            });
    }

    // Utility functions
    setupUtilities() {
        // Ad click handling
        window.handleAdClick = (location) => {
            this.trackEvent('ad_click', { location });
        };

        // Smooth scrolling for anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                target?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });

        // External link handling
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.hostname !== window.location.hostname) {
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
            }
        });

        // Copy to clipboard functionality
        document.addEventListener('click', (e) => {
            if (this.elementMatches(e.target, '.copy-btn')) {
                const target = document.querySelector(e.target.dataset.target);
                if (target) {
                    const text = target.tagName === 'INPUT' ? target.value : target.textContent;
                    this.copyToClipboard(text);
                }
            }
        });
    }

    // Accessibility enhancements
    setupAccessibility() {
        // Add skip link if it doesn't exist
        if (!document.querySelector('.skip-link')) {
            const skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.className = 'skip-link';
            skipLink.textContent = 'Skip to main content';
            skipLink.style.cssText = `
                position: absolute;
                top: -40px;
                left: 6px;
                background: var(--primary);
                color: white;
                padding: 8px;
                text-decoration: none;
                z-index: 1000;
                border-radius: 0 0 4px 4px;
            `;
            document.body.insertBefore(skipLink, document.body.firstChild);

            skipLink.addEventListener('focus', () => skipLink.style.top = '0');
            skipLink.addEventListener('blur', () => skipLink.style.top = '-40px');
        }

        // Add main content ID if it doesn't exist
        const mainContent = document.querySelector('.main-content');
        if (mainContent && !mainContent.id) {
            mainContent.id = 'main-content';
        }
    }

    // Helper functions
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    validateField(field) {
        const isValid = field.value.trim() !== '';
        field.classList.toggle('error', !isValid);
        field.setAttribute('aria-invalid', !isValid);
        return isValid;
    }

    setLoadingState(element, isLoading) {
        if (!element) return;

        element.classList.toggle('loading', isLoading);
        element.disabled = isLoading;
        element.setAttribute('aria-busy', isLoading);
    }

    showMessage(message, type = 'info') {
        // Remove existing messages
        document.querySelectorAll('.app-message').forEach(el => el.remove());

        const messageEl = document.createElement('div');
        messageEl.className = `app-message app-message--${type}`;
        messageEl.textContent = message;
        messageEl.setAttribute('role', type === 'error' ? 'alert' : 'status');

        const colors = {
            error: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
            success: { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
            info: { bg: '#f0f9ff', text: '#1e40af', border: '#bfdbfe' }
        };

        const color = colors[type] || colors.info;

        Object.assign(messageEl.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '1000',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius)',
            backgroundColor: color.bg,
            color: color.text,
            border: `1px solid ${color.border}`,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            animation: 'slideInRight 0.3s ease',
            cursor: 'pointer'
        });

        document.body.appendChild(messageEl);

        // Auto remove after 5 seconds
        const removeMessage = () => {
            if (messageEl.parentNode) {
                messageEl.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => messageEl.remove(), 300);
            }
        };

        setTimeout(removeMessage, 5000);
        messageEl.addEventListener('click', removeMessage);

        // Add animation keyframes if not exists
        if (!document.querySelector('#message-animations')) {
            const style = document.createElement('style');
            style.id = 'message-animations';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    trackEvent(eventName, data = {}) {
        // Replace with your analytics solution
        console.log('Event tracked:', eventName, data);

        // Example for Google Analytics
        // if (typeof gtag !== 'undefined') {
        //   gtag('event', eventName, data);
        // }
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showMessage('Copied to clipboard!', 'success');
            return true;
        } catch (err) {
            this.showMessage('Failed to copy to clipboard', 'error');
            return false;
        }
    }

    // Utility: Promise delay
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Utility: Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the core app
new CalcHubCore();

// Export utilities for global use
window.CalcHubUtils = {
    formatNumber: (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),

    formatCurrency: (amount, currency = 'USD') =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount),

    formatDate: (date) =>
        new Intl.DateTimeFormat('en-US').format(new Date(date)),

    copyToClipboard: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            return false;
        }
    },

    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    validateEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
};