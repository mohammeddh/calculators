/**
 * Home page specific JavaScript functionality - jQuery Enhanced
 */

$(document).ready(function() {
    initializeHomePage();
});

function initializeHomePage() {
    setupFeatureCardAnimations();
    setupCalculatorGrid();
    setupCTAButtons();
    setupHeroAnimations();
}

/**
 * Enhanced feature card animations with jQuery
 */
function setupFeatureCardAnimations() {
    const $featureCards = $('.feature-card');

    // Staggered entrance animation
    $featureCards.each(function(index) {
        const $card = $(this);
        $card.css({
            'opacity': '0',
            'transform': 'translateY(30px)'
        });

        setTimeout(() => {
            $card.css({
                'opacity': '1',
                'transform': 'translateY(0)',
                'transition': 'all 0.6s ease'
            });
        }, index * 200);
    });

    // Enhanced hover interactions
    $featureCards.hover(
        function() {
            $(this).css('transform', 'translateY(-8px) scale(1.02)');
            $(this).find('.feature-icon').css('transform', 'scale(1.1)');
        },
        function() {
            $(this).css('transform', 'translateY(0) scale(1)');
            $(this).find('.feature-icon').css('transform', 'scale(1)');
        }
    );

    // Track feature card interactions
    $featureCards.on('click', function() {
        const featureName = $(this).find('h2').text();
        trackEvent('feature_card_interaction', {
            feature: featureName,
            location: 'home_page'
        });
    });
}

/**
 * Calculator grid functionality with jQuery
 */
function setupCalculatorGrid() {
    const $calculatorCards = $('.calculator-card');

    if ($calculatorCards.length === 0) return;

    // Add loading state to calculator cards
    $calculatorCards.each(function() {
        const $card = $(this);

        $card.on('mouseenter', function() {
            // Preload calculator page (optional)
            const url = $card.attr('href');
            if (url && !$card.data('preloaded')) {
                $card.data('preloaded', true);
                // Prefetch the page
                $('<link rel="prefetch">').attr('href', url).appendTo('head');
            }
        });

        $card.on('click', function(e) {
            e.preventDefault();

            // Add click feedback
            $card.css('transform', 'scale(0.98)');

            setTimeout(() => {
                $card.css('transform', '');

                // Track calculator access
                trackEvent('calculator_access', {
                    calculator: $card.find('h3').text(),
                    source: 'home_featured'
                });

                // Navigate to calculator
                window.location.href = $card.attr('href');
            }, 150);
        });
    });

    // Load more functionality (if needed)
    $('.load-more-calculators').on('click', function() {
        loadMoreCalculators();
    });
}

/**
 * CTA button enhancements with jQuery
 */
function setupCTAButtons() {
    const $ctaSection = $('.cta');
    const $ctaButtons = $ctaSection.find('.btn');

    // Add entrance animation for CTA section using Intersection Observer
    if ('IntersectionObserver' in window && $ctaSection.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    $(entry.target).addClass('fade-in');
                    $ctaButtons.each(function(index) {
                        const $btn = $(this);
                        setTimeout(() => {
                            $btn.addClass('scale-in');
                        }, index * 100);
                    });
                }
            });
        }, { threshold: 0.5 });

        observer.observe($ctaSection[0]);
    }

    // Enhanced button interactions
    $ctaButtons.each(function() {
        const $btn = $(this);
        const originalText = $btn.text();

        $btn.hover(
            function() {
                // Optional: Change button text on hover
                if ($btn.hasClass('btn-primary')) {
                    // $btn.text('Let\'s Go! →');
                }
            },
            function() {
                $btn.text(originalText);
            }
        );

        $btn.on('click', function() {
            trackEvent('cta_click', {
                button_text: originalText,
                button_type: $btn.hasClass('btn-primary') ? 'primary' : 'secondary',
                location: 'home_page'
            });
        });
    });
}

/**
 * Hero section animations with jQuery
 */
function setupHeroAnimations() {
    const $pageHeader = $('.page-header');

    if ($pageHeader.length === 0) return;

    // Typewriter effect for main heading (optional)
    const $mainHeading = $pageHeader.find('h1');
    if ($mainHeading.length && $mainHeading.data('typewriter')) {
        typewriterEffect($mainHeading, $mainHeading.text());
    }

    // Floating animation for decorative elements
    const $decorativeElements = $pageHeader.find('.decorative-element');
    $decorativeElements.each(function(index) {
        const $element = $(this);

        // Random floating animation
        setInterval(() => {
            const randomY = Math.random() * 10 - 5;
            const randomX = Math.random() * 5 - 2.5;

            $element.css({
                'transform': `translate(${randomX}px, ${randomY}px)`,
                'transition': 'transform 2s ease-in-out'
            });
        }, 3000 + (index * 500));
    });

    // Parallax effect for header background
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        $(window).on('scroll', throttle(() => {
            const scrolled = window.pageYOffset;
            const $headerBg = $pageHeader.find('.header-bg');

            if ($headerBg.length) {
                $headerBg.css('transform', `translateY(${scrolled * 0.3}px)`);
            }
        }, 16));
    }
}

/**
 * Typewriter effect for text with jQuery
 */
function typewriterEffect($element, text, speed = 100) {
    $element.text('');
    let i = 0;

    const timer = setInterval(() => {
        $element.text(text.slice(0, i + 1));
        i++;

        if (i >= text.length) {
            clearInterval(timer);
            // Add blinking cursor
            $element.append('<span class="cursor">|</span>');

            // Remove cursor after 3 seconds
            setTimeout(() => {
                $element.find('.cursor').fadeOut();
            }, 3000);
        }
    }, speed);
}

/**
 * Load more calculators (for infinite scroll) with jQuery
 */
function loadMoreCalculators() {
    const $container = $('.calculator-grid');
    const $loadBtn = $('.load-more-calculators');

    // Show loading state
    $loadBtn.addClass('loading').prop('disabled', true);

    // Simulate API call
    setTimeout(() => {
        // Mock additional calculators
        const newCalculators = [
            { name: 'Tax Calculator', url: '/calculators/tax', icon: '📊' },
            { name: 'Investment Calculator', url: '/calculators/investment', icon: '📈' },
            { name: 'Retirement Calculator', url: '/calculators/retirement', icon: '🏖️' }
        ];

        newCalculators.forEach((calc, index) => {
            const $calcCard = $(`
                <a href="${calc.url}" class="calculator-card" style="opacity: 0; transform: translateY(20px);">
                    <div class="calculator-icon">${calc.icon}</div>
                    <h3>${calc.name}</h3>
                    <p>Quick and easy calculations</p>
                </a>
            `);

            $container.append($calcCard);

            // Animate in
            setTimeout(() => {
                $calcCard.css({
                    'opacity': '1',
                    'transform': 'translateY(0)',
                    'transition': 'all 0.4s ease'
                });
            }, index * 100);
        });

        // Hide load button or reset it
        $loadBtn.removeClass('loading').prop('disabled', false);

        // If this was the last batch, hide the button
        // $loadBtn.hide();

        trackEvent('load_more_calculators', {
            count: newCalculators.length,
            total_loaded: $container.find('.calculator-card').length
        });

    }, 1000);
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

function throttle(func, limit) {
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
}

function trackEvent(eventName, eventData = {}) {
    // Console log for development
    console.log('Event tracked:', eventName, eventData);

    // Google Analytics if available
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
}

// Export functions for potential use elsewhere
window.HomePageFunctions = {
    setupFeatureCardAnimations,
    setupCalculatorGrid,
    typewriterEffect,
    loadMoreCalculators,
    trackEvent
};