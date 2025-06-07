/**
 * Core JavaScript functionality for WebSpace Calculator Tools - jQuery Version
 */

// Global app namespace
window.WebSpace = window.WebSpace || {};

// Core utilities using jQuery
WebSpace.Core = {

    // Initialize core functionality
    init: function() {
        this.setupMobileMenu();
        this.setupAccessibility();
        this.setupGlobalEventListeners();
        this.loadingState = false;
    },

    // Mobile menu functionality with jQuery
    setupMobileMenu: function() {
        const $toggle = $('.mobile-menu-toggle');
        const $menu = $('.mobile-menu');

        if ($toggle.length && $menu.length) {
            $toggle.on('click', function() {
                const isActive = $toggle.hasClass('active');

                if (isActive) {
                    $toggle.removeClass('active');
                    $menu.removeClass('active');
                    $('body').css('overflow', '');
                } else {
                    $toggle.addClass('active');
                    $menu.addClass('active');
                    $('body').css('overflow', 'hidden');
                }
            });

            // Close menu when clicking outside
            $(document).on('click', function(e) {
                if (!$toggle.is(e.target) && $toggle.has(e.target).length === 0 &&
                    !$menu.is(e.target) && $menu.has(e.target).length === 0) {
                    $toggle.removeClass('active');
                    $menu.removeClass('active');
                    $('body').css('overflow', '');
                }
            });

            // Close menu on escape key
            $(document).on('keydown', function(e) {
                if (e.key === 'Escape' && $menu.hasClass('active')) {
                    $toggle.removeClass('active');
                    $menu.removeClass('active');
                    $('body').css('overflow', '');
                }
            });
        }
    },

    // Accessibility enhancements with jQuery
    setupAccessibility: function() {
        // Add skip link if it doesn't exist
        if ($('.skip-link').length === 0) {
            const $skipLink = $('<a href="#main-content" class="skip-link">Skip to main content</a>');
            $('body').prepend($skipLink);
        }

        // Add main content ID if it doesn't exist
        const $mainContent = $('.main-content');
        if ($mainContent.length && !$mainContent.attr('id')) {
            $mainContent.attr('id', 'main-content');
        }

        // Improve focus management
        this.setupFocusManagement();
    },

    // Focus management for better keyboard navigation
    setupFocusManagement: function() {
        // Trap focus in modals (if any)
        $(document).on('keydown', function(e) {
            if (e.key === 'Tab') {
                const $modal = $('.modal.active');
                if ($modal.length) {
                    WebSpace.Core.trapFocus(e, $modal);
                }
            }
        });
    },

    // Trap focus within an element using jQuery
    trapFocus: function(e, $element) {
        const $focusableElements = $element.find('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
        const $firstElement = $focusableElements.first();
        const $lastElement = $focusableElements.last();

        if (e.shiftKey && $(document.activeElement).is($firstElement)) {
            e.preventDefault();
            $lastElement.focus();
        } else if (!e.shiftKey && $(document.activeElement).is($lastElement)) {
            e.preventDefault();
            $firstElement.focus();
        }
    },

    // Global event listeners using jQuery
    setupGlobalEventListeners: function() {
        // Handle ad clicks
        window.handleAdClick = function(location) {
            console.log('Ad clicked:', location);
            WebSpace.Core.trackEvent('ad_click', { location: location });
        };

        // Handle newsletter form submissions
        $(document).on('submit', '.newsletter-form', function(e) {
            e.preventDefault();
            WebSpace.Core.handleNewsletterSubmit($(this));
        });

        // Handle external links
        $(document).on('click', 'a', function() {
            const $link = $(this);
            const hostname = $link.prop('hostname');

            if (hostname && hostname !== window.location.hostname) {
                $link.attr('target', '_blank').attr('rel', 'noopener noreferrer');
            }
        });
    },

    // Newsletter submission handler using jQuery
    handleNewsletterSubmit: function($form) {
        const email = $form.find('input[name="email"]').val();
        const $submitBtn = $form.find('button[type="submit"]');

        if (!this.validateEmail(email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        this.setLoadingState($submitBtn, true);

        // Simulate API call (replace with actual implementation)
        setTimeout(() => {
            this.setLoadingState($submitBtn, false);
            this.showMessage('Thank you for subscribing!', 'success');
            $form[0].reset();
            this.trackEvent('newsletter_signup', { email: email });
        }, 1000);
    },

    // Email validation
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Loading state management using jQuery
    setLoadingState: function($element, isLoading) {
        if (isLoading) {
            $element.addClass('loading').prop('disabled', true).attr('aria-busy', 'true');
        } else {
            $element.removeClass('loading').prop('disabled', false).attr('aria-busy', 'false');
        }
    },

    // Show messages to user using jQuery
    showMessage: function(message, type = 'info') {
        const $messageEl = $(`
            <div class="message ${type} fade-in" role="${type === 'error' ? 'alert' : 'status'}">
                <button type="button" class="message-close" aria-label="Close message">&times;</button>
                ${message}
            </div>
        `);

        // Insert at top of main content
        const $mainContent = $('.main-content');
        if ($mainContent.length) {
            $mainContent.prepend($messageEl);
        } else {
            $('body').prepend($messageEl);
        }

        // Auto-remove after 5 seconds
        setTimeout(() => {
            $messageEl.fadeOut(500, function() {
                $(this).remove();
            });
        }, 5000);

        // Allow manual dismissal
        $messageEl.on('click', '.message-close', function() {
            $messageEl.fadeOut(300, function() {
                $(this).remove();
            });
        });

        // Click anywhere on message to dismiss
        $messageEl.on('click', function() {
            $messageEl.fadeOut(300, function() {
                $(this).remove();
            });
        });
    },

    // Event tracking (replace with your analytics solution)
    trackEvent: function(eventName, eventData = {}) {
        // Google Analytics example:
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }

        // Console log for development
        console.log('Event tracked:', eventName, eventData);
    },

    // Utility functions using jQuery
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
        },

        // Smooth scroll to element using jQuery
        scrollTo: function(target, offset = 0) {
            const $element = typeof target === 'string' ? $(target) : target;
            if (!$element.length) return;

            const targetPosition = $element.offset().top - offset;

            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                $(window).scrollTop(targetPosition);
            } else {
                $('html, body').animate({
                    scrollTop: targetPosition
                }, 600);
            }
        },

        // Get viewport dimensions
        getViewport: function() {
            return {
                width: $(window).width(),
                height: $(window).height()
            };
        },

        // Check if element is in viewport
        isInViewport: function($element, threshold = 0) {
            if (!$element.length) return false;

            const elementTop = $element.offset().top;
            const elementBottom = elementTop + $element.outerHeight();
            const viewportTop = $(window).scrollTop();
            const viewportBottom = viewportTop + $(window).height();

            return elementBottom > viewportTop + threshold &&
                elementTop < viewportBottom - threshold;
        },

        // Generate unique ID
        generateId: function(prefix = 'id') {
            return prefix + '-' + Math.random().toString(36).substr(2, 9);
        },

        // Parse query string parameters
        getUrlParams: function() {
            const params = {};
            window.location.search.substr(1).split('&').forEach(param => {
                const [key, value] = param.split('=');
                if (key) {
                    params[decodeURIComponent(key)] = decodeURIComponent(value || '');
                }
            });
            return params;
        },

        // Cookie helpers
        setCookie: function(name, value, days = 7) {
            const expires = new Date();
            expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
            document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
        },

        getCookie: function(name) {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        },

        // Local storage helpers with error handling
        setLocalStorage: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.warn('Could not save to localStorage:', e);
                return false;
            }
        },

        getLocalStorage: function(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.warn('Could not read from localStorage:', e);
                return defaultValue;
            }
        },

        // Device detection
        isMobile: function() {
            return $(window).width() <= 768;
        },

        isTablet: function() {
            const width = $(window).width();
            return width > 768 && width <= 1024;
        },

        isDesktop: function() {
            return $(window).width() > 1024;
        }
    }
};

// Initialize when DOM is ready
$(document).ready(function() {
    WebSpace.Core.init();
});

// Additional jQuery enhancements for WebSpace
$(document).ready(function() {
    // Enhanced form handling
    $('form').on('submit', function() {
        const $form = $(this);
        const $submitBtn = $form.find('button[type="submit"], input[type="submit"]');

        // Don't add loading to calculator forms (they handle their own)
        if (!$form.hasClass('calculator-form') && !$form.hasClass('newsletter-form')) {
            WebSpace.Core.setLoadingState($submitBtn, true);
        }
    });

    // Auto-expand textareas
    $('textarea').on('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Enhanced link handling
    $('a[href^="#"]').on('click', function(e) {
        const href = $(this).attr('href');
        const $target = $(href);

        if ($target.length) {
            e.preventDefault();
            WebSpace.Core.utils.scrollTo($target, 100);
        }
    });

    // Image lazy loading enhancement
    $('img[data-src]').each(function() {
        const $img = $(this);

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const $target = $(entry.target);
                        $target.attr('src', $target.data('src')).removeAttr('data-src');
                        observer.unobserve(entry.target);
                    }
                });
            });
            observer.observe(this);
        } else {
            // Fallback for older browsers
            $img.attr('src', $img.data('src')).removeAttr('data-src');
        }
    });

    // Auto-hide alerts/messages
    $('.alert, .message').delay(5000).fadeOut(500);

    // Copy to clipboard functionality
    $('.copy-btn').on('click', function() {
        const $btn = $(this);
        const target = $btn.data('target');
        const $target = $(target);

        if ($target.length) {
            const text = $target.is('input, textarea') ? $target.val() : $target.text();

            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    WebSpace.Core.showMessage('Copied to clipboard!', 'success');
                });
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                WebSpace.Core.showMessage('Copied to clipboard!', 'success');
            }
        }
    });

    // Keyboard navigation improvements
    $(document).on('keydown', function(e) {
        // Escape key handling
        if (e.key === 'Escape') {
            // Close any open modals, dropdowns, etc.
            $('.modal.active, .dropdown.active').removeClass('active');
            $('.message').fadeOut(300, function() { $(this).remove(); });
        }
    });

    // Print preparation
    window.addEventListener('beforeprint', function() {
        // Hide unnecessary elements when printing
        $('.sidebar, .mobile-menu, .message').hide();
    });

    window.addEventListener('afterprint', function() {
        // Restore elements after printing
        $('.sidebar, .mobile-menu').show();
    });
});