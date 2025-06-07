/**
 * Main theme JavaScript file
 * Imports and initializes all core functionality
 */

// Import core modules (in a real implementation, you'd use proper ES6 imports or build process)
// For now, we'll assume they're loaded via script tags

$(document).ready(function() {
    // Initialize core functionality
    if (typeof WebSpace !== 'undefined' && WebSpace.Core) {
        WebSpace.Core.init();
    }

    // Initialize animations
    if (typeof WebSpace !== 'undefined' && WebSpace.Animations) {
        WebSpace.Animations.init();
    }

    // jQuery-specific enhancements
    setupJQueryEnhancements();

    // Initialize page-specific functionality
    initializePageFeatures();
});

/**
 * jQuery-specific enhancements
 */
function setupJQueryEnhancements() {

    // Smooth reveal animation on scroll
    $(window).on('scroll', WebSpace.Core.utils.throttle(function() {
        $('.feature-card, .calculator-card').each(function() {
            const elementTop = $(this).offset().top;
            const viewportBottom = $(window).scrollTop() + $(window).height();

            if (elementTop < viewportBottom - 50) {
                $(this).addClass('slide-up');
            }
        });
    }, 100));

    // Enhanced form handling
    $('form').on('submit', function(e) {
        const form = $(this);

        // Add loading state to submit button
        const submitBtn = form.find('button[type="submit"], input[type="submit"]');
        if (submitBtn.length) {
            submitBtn.prop('disabled', true).addClass('loading');
        }
    });

    // Auto-expand textareas
    $('textarea').on('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function(e) {
        const target = $(this.getAttribute('href'));
        if (target.length) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top - 100
            }, 600);
        }
    });

    // Tooltip functionality (if needed)
    $('[data-tooltip]').hover(
        function() {
            const tooltip = $('<div class="tooltip"></div>').text($(this).data('tooltip'));
            $('body').append(tooltip);

            const pos = $(this).offset();
            tooltip.css({
                top: pos.top - tooltip.outerHeight() - 10,
                left: pos.left + ($(this).outerWidth() / 2) - (tooltip.outerWidth() / 2)
            }).fadeIn(200);
        },
        function() {
            $('.tooltip').fadeOut(200, function() {
                $(this).remove();
            });
        }
    );

    // Image lazy loading fallback
    $('img[data-src]').each(function() {
        const img = $(this);
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = $(entry.target);
                    target.attr('src', target.data('src')).removeAttr('data-src');
                    observer.unobserve(entry.target);
                }
            });
        });
        observer.observe(this);
    });

    // Auto-hide alerts/messages
    $('.alert, .message').delay(5000).fadeOut(500);

    // Copy to clipboard functionality
    $('.copy-btn').on('click', function() {
        const target = $($(this).data('target'));
        if (target.length) {
            const text = target.is('input, textarea') ? target.val() : target.text();
            navigator.clipboard.writeText(text).then(() => {
                WebSpace.Core.showMessage('Copied to clipboard!', 'success');
            });
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

    // Theme toggle (if implemented)
    if ($('.theme-toggle').length) {
        initializeThemeToggle();
    }
}

/**
 * Calculator card functionality
 */
function initializeCalculatorCards() {
    $('.calculator-card').on('click', function(e) {
        e.preventDefault();

        // Add click animation
        $(this).addClass('scale-in');
        setTimeout(() => {
            $(this).removeClass('scale-in');
        }, 300);

        // Track interaction
        WebSpace.Core.trackEvent('calculator_card_click', {
            calculator: $(this).find('h3').text(),
            url: $(this).attr('href')
        });

        // Navigate after animation
        setTimeout(() => {
            window.location.href = $(this).attr('href');
        }, 150);
    });
}

/**
 * Contact form enhancements
 */
function initializeContactForm() {
    const form = $('.contact-form');

    form.on('submit', function(e) {
        e.preventDefault();

        // Validate form
        let isValid = true;
        form.find('input[required], textarea[required]').each(function() {
            if (!$(this).val().trim()) {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });

        if (!isValid) {
            WebSpace.Core.showMessage('Please fill in all required fields.', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = form.find('button[type="submit"]');
        WebSpace.Core.setLoadingState(submitBtn[0], true);

        setTimeout(() => {
            WebSpace.Core.setLoadingState(submitBtn[0], false);
            WebSpace.Core.showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
            form[0].reset();
        }, 1500);
    });

    // Real-time validation
    form.find('input, textarea').on('blur', function() {
        const field = $(this);
        if (field.attr('required') && !field.val().trim()) {
            field.addClass('error');
        } else {
            field.removeClass('error');
        }
    });
}

/**
 * Search functionality
 */
function initializeSearch() {
    const searchInput = $('.search-input');
    const searchResults = $('.search-results');

    searchInput.on('input', WebSpace.Core.utils.debounce(function() {
        const query = $(this).val().trim();

        if (query.length > 2) {
            // Show loading state
            searchResults.html('<div class="skeleton skeleton-text"></div>');

            // Simulate search (replace with actual search implementation)
            setTimeout(() => {
                const results = performSearch(query);
                displaySearchResults(results);
            }, 500);
        } else {
            searchResults.empty();
        }
    }, 300));
}

/**
 * Perform search (mock implementation)
 */
function performSearch(query) {
    // This would be replaced with actual search logic
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
    const container = $('.search-results');
    container.empty();

    if (results.length === 0) {
        container.html('<div class="no-results">No results found</div>');
        return;
    }

    results.forEach(result => {
        const item = $(`
            <a href="${result.url}" class="search-result-item">
                <div class="result-title">${result.title}</div>
                <div class="result-type">${result.type}</div>
            </a>
        `);
        container.append(item);
    });
}

/**
 * Theme toggle functionality
 */
function initializeThemeToggle() {
    const toggle = $('.theme-toggle');

    toggle.on('click', function() {
        const body = $('body');
        const isDark = body.hasClass('dark-theme');

        if (isDark) {
            body.removeClass('dark-theme');
            localStorage.setItem('theme', 'light');
        } else {
            body.addClass('dark-theme');
            localStorage.setItem('theme', 'dark');
        }

        WebSpace.Core.trackEvent('theme_toggle', { theme: isDark ? 'light' : 'dark' });
    });

    // Apply saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        $('body').addClass('dark-theme');
    }
}

// Export for use in other scripts
window.WebSpaceTheme = {
    initializeCalculatorCards,
    initializeContactForm,
    initializeSearch,
    performSearch,
    displaySearchResults
};