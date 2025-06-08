/**
 * CalcHub - Core JavaScript
 * Contains only essential functionality loaded on every page
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

            if (isOpen) {
                this.closeMobileMenu(toggle, menu);
            } else {
                this.openMobileMenu(toggle, menu);
            }
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

    // Basic form handling (newsletter, contact)
    setupBasicForms() {
        // Newsletter forms
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

    // Helper method to safely check element matches
    elementMatches(element, selector) {
        if (!element || !element.matches) return false;
        return element.matches(selector);
    }

    async handleNewsletterSubmit(form) {
        const email = form.querySelector('input[name="email"]').value;
        const submitBtn = form.querySelector('button[type="submit"]');

        if (!this.isValidEmail(email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return;
        }

        this.setLoadingState(submitBtn, true);

        try {
            // Simulate API call - replace with your actual endpoint
            await this.delay(1000);

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
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');

        // Basic validation
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
            // Replace with your actual form submission
            await this.delay(1500);

            this.showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
            form.reset();
            this.trackEvent('contact_form_submit');

        } catch (error) {
            this.showMessage('Failed to send message. Please try again.', 'error');
        } finally {
            this.setLoadingState(submitBtn, false);
        }
    }

    // Animation setup
    setupAnimations() {
        // Check if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements that should animate
        const animateElements = document.querySelectorAll(
            '.feature-card, .calculator-card, .card'
        );

        animateElements.forEach((el, index) => {
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
            console.log('Ad clicked:', location);
        };

        // Smooth scrolling for anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
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

            skipLink.addEventListener('focus', () => {
                skipLink.style.top = '0';
            });

            skipLink.addEventListener('blur', () => {
                skipLink.style.top = '-40px';
            });
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

        if (!isValid) {
            field.classList.add('error');
            field.setAttribute('aria-invalid', 'true');
        } else {
            field.classList.remove('error');
            field.removeAttribute('aria-invalid');
        }

        return isValid;
    }

    setLoadingState(element, isLoading) {
        if (isLoading) {
            element.classList.add('loading');
            element.disabled = true;
            element.setAttribute('aria-busy', 'true');
        } else {
            element.classList.remove('loading');
            element.disabled = false;
            element.setAttribute('aria-busy', 'false');
        }
    }

    showMessage(message, type = 'info') {
        // Remove existing messages
        const existing = document.querySelectorAll('.app-message');
        existing.forEach(el => el.remove());

        const messageEl = document.createElement('div');
        messageEl.className = `app-message app-message--${type}`;
        messageEl.textContent = message;
        messageEl.setAttribute('role', type === 'error' ? 'alert' : 'status');

        // Style the message
        Object.assign(messageEl.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '1000',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius)',
            backgroundColor: type === 'error' ? '#fef2f2' :
                type === 'success' ? '#f0fdf4' : '#f0f9ff',
            color: type === 'error' ? '#dc2626' :
                type === 'success' ? '#166534' : '#1e40af',
            border: `1px solid ${type === 'error' ? '#fecaca' :
                type === 'success' ? '#bbf7d0' : '#bfdbfe'}`,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            animation: 'slideInRight 0.3s ease',
            cursor: 'pointer'
        });

        document.body.appendChild(messageEl);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => messageEl.remove(), 300);
            }
        }, 5000);

        // Allow manual dismissal
        messageEl.addEventListener('click', () => {
            messageEl.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => messageEl.remove(), 300);
        });

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

    // Utility: Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
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

    validateEmail: (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
};