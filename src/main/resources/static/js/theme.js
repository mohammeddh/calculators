/**
 * Main theme JavaScript file - jQuery Enhanced
 */

$(document).ready(function() {
    // Initialize core functionality
    initializeTheme();

    // Initialize page-specific functionality
    initializePageFeatures();

    // Setup global enhancements
    setupGlobalEnhancements();
});

/**
 * Initialize core theme functionality
 */
function initializeTheme() {
    setupMobileMenu();
    setupAccessibility();
    setupGlobalEventListeners();
}

/**
 * Mobile menu functionality with jQuery
 */
function setupMobileMenu() {
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
            if (!$toggle.is(e.target) && !$toggle.has(e.target).length &&
                !$menu.is(e.target) && !$menu.has(e.target).length) {
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
}

/**
 * Accessibility enhancements
 */
function setupAccessibility() {
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

    // Improve focus management for modals
    $(document).on('keydown', function(e) {
        if (e.key === 'Tab') {
            const $modal = $('.modal.active');
            if ($modal.length) {
                trapFocus(e, $modal);
            }
        }
    });
}

/**
 * Trap focus within an element
 */
function trapFocus(e, $element) {
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
}

/**
 * Global event listeners
 */
function setupGlobalEventListeners() {
    // Handle ad clicks
    $(document).on('click', '.ad-space', function() {
        const location = $(this).data('location') || 'unknown';
        console.log('Ad clicked:', location);
        trackEvent('ad_click', { location: location });
    });

    // Handle newsletter form submissions
    $(document).on('submit', '.newsletter-form', function(e) {
        e.preventDefault();
        handleNewsletterSubmit($(this));
    });

    // Handle external links
    $(document).on('click', 'a', function() {
        const $link = $(this);
        const href = $link.attr('href');

        if (href && href.indexOf('http') === 0 && !href.includes(window.location.hostname)) {
            $link.attr('target', '_blank').attr('rel', 'noopener noreferrer');
        }
    });
}

/**
 * Newsletter submission handler
 */
function handleNewsletterSubmit($form) {
    const email = $form.find('input[name="email"]').val();
    const $submitBtn = $form.find('button[type="submit"]');

    if (!validateEmail(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }

    // Show loading state
    setLoadingState($submitBtn, true);

    // Simulate API call
    setTimeout(() => {
        setLoadingState($submitBtn, false);
        showMessage('Thank you for subscribing!', 'success');
        $form[0].reset();
        trackEvent('newsletter_signup', { email: email });
    }, 1000);
}

/**
 * Email validation
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Loading state management
 */
function setLoadingState($element, isLoading) {
    if (isLoading) {
        $element.addClass('loading').prop('disabled', true).attr('aria-busy', 'true');
    } else {
        $element.removeClass('loading').prop('disabled', false).attr('aria-busy', 'false');
    }
}

/**
 * Show messages to user
 */
function showMessage(message, type = 'info') {
    const $messageEl = $(`
        <div class="message ${type} fade-in" role="${type === 'error' ? 'alert' : 'status'}">
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
    $messageEl.on('click', function() {
        $(this).fadeOut(300, function() {
            $(this).remove();
        });
    });
}

/**
 * Event tracking
 */
function trackEvent(eventName, eventData = {}) {
    // Console log for development
    console.log('Event tracked:', eventName, eventData);

    // Google Analytics if available
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
}

/**
 * Global jQuery enhancements
 */
function setupGlobalEnhancements() {
    // Smooth reveal animation on scroll
    $(window).on('scroll', debounce(function() {
        $('.feature-card, .calculator-card').each(function() {
            const $element = $(this);
            const elementTop = $element.offset().top;
            const viewportBottom = $(window).scrollTop() + $(window).height();

            if (elementTop < viewportBottom - 50) {
                $element.addClass('slide-up');
            }
        });
    }, 100));

    // Enhanced form handling
    $('form').on('submit', function() {
        const $form = $(this);
        const $submitBtn = $form.find('button[type="submit"], input[type="submit"]');

        if ($submitBtn.length && !$form.hasClass('calculator-form')) {
            $submitBtn.prop('disabled', true).addClass('loading');
        }
    });

    // Auto-expand textareas
    $('textarea').on('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function(e) {
        const href = $(this).attr('href');
        const $target = $(href);

        if ($target.length) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: $target.offset().top - 100
            }, 600);
        }
    });

    // Image lazy loading fallback
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
                    showMessage('Copied to clipboard!', 'success');
                });
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showMessage('Copied to clipboard!', 'success');
            }
        }
    });
}

/**
 * Initialize page-specific features
 */
function initializePageFeatures() {
    // Calculator features
    if ($('.calculator-card').length) {
        initializeCalculatorCards();
    }

    // Contact form enhancements
    if ($('.contact-form').length) {
        initializeContactForm();
    }

    // Search functionality
    if ($('.search-input').length) {
        initializeSearch();
    }
}

/**
 * Calculator card functionality
 */
function initializeCalculatorCards() {
    $('.calculator-card').on('click', function(e) {
        e.preventDefault();

        const $card = $(this);

        // Add click animation
        $card.addClass('scale-in');
        setTimeout(() => {
            $card.removeClass('scale-in');
        }, 300);

        // Track interaction
        trackEvent('calculator_card_click', {
            calculator: $card.find('h3').text(),
            url: $card.attr('href')
        });

        // Navigate after animation
        setTimeout(() => {
            window.location.href = $card.attr('href');
        }, 150);
    });
}

/**
 * Contact form enhancements
 */
function initializeContactForm() {
    const $form = $('.contact-form');

    $form.on('submit', function(e) {
        e.preventDefault();

        // Validate form
        let isValid = true;
        $form.find('input[required], textarea[required]').each(function() {
            const $field = $(this);
            if (!$field.val().trim()) {
                isValid = false;
                $field.addClass('error');
            } else {
                $field.removeClass('error');
            }
        });

        if (!isValid) {
            showMessage('Please fill in all required fields.', 'error');
            return;
        }

        // Simulate form submission
        const $submitBtn = $form.find('button[type="submit"]');
        setLoadingState($submitBtn, true);

        setTimeout(() => {
            setLoadingState($submitBtn, false);
            showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
            $form[0].reset();
        }, 1500);
    });

    // Real-time validation
    $form.find('input, textarea').on('blur', function() {
        const $field = $(this);
        if ($field.attr('required') && !$field.val().trim()) {
            $field.addClass('error');
        } else {
            $field.removeClass('error');
        }
    });
}

/**
 * Search functionality
 */
function initializeSearch() {
    const $searchInput = $('.search-input');
    const $searchResults = $('.search-results');

    $searchInput.on('input', debounce(function() {
        const query = $(this).val().trim();

        if (query.length > 2) {
            // Show loading state
            $searchResults.html('<div class="skeleton skeleton-text"></div>');

            // Simulate search
            setTimeout(() => {
                const results = performSearch(query);
                displaySearchResults(results);
            }, 500);
        } else {
            $searchResults.empty();
        }
    }, 300));
}

/**
 * Perform search (mock implementation)
 */
function performSearch(query) {
    const mockResults = [
        { title: 'Mortgage Calculator', url: '/calculators/mortgage', type: 'Calculator' },
        { title: 'BMI Calculator', url: '/calculators/bmi', type: 'Calculator' },
        { title: 'Loan Calculator', url: '/calculators/loan', type: 'Calculator' }
    ];

    return mockResults.filter(result =>
        result.title.toLowerCase().includes(query.toLowerCase())
    );
}

/**
 * Display search results
 */
function displaySearchResults(results) {
    const $container = $('.search-results');
    $container.empty();

    if (results.length === 0) {
        $container.html('<div class="no-results">No results found</div>');
        return;
    }

    results.forEach(result => {
        const $item = $(`
            <a href="${result.url}" class="search-result-item">
                <div class="result-title">${result.title}</div>
                <div class="result-type">${result.type}</div>
            </a>
        `);
        $container.append($item);
    });
}

/**
 * Utility functions
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for potential use elsewhere
window.WebSpaceTheme = {
    initializeCalculatorCards,
    initializeContactForm,
    initializeSearch,
    performSearch,
    displaySearchResults,
    showMessage,
    trackEvent,
    setLoadingState,
    validateEmail
};