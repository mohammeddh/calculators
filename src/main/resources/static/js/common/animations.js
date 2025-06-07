/**
 * Animation utilities and scroll-based animations - jQuery Version
 */

WebSpace.Animations = {

    // Initialize animations
    init: function() {
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupLoadingAnimations();
        this.setupParallax();
    },

    // Scroll-based animations using Intersection Observer and jQuery
    setupScrollAnimations: function() {
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
                const $element = $(entry.target);
                if (entry.isIntersecting) {
                    $element.addClass('animate-in');
                    // Optional: Stop observing after animation
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements that should animate on scroll
        const $animatedElements = $('.feature-card, .calculator-card, .content-section');

        $animatedElements.each(function(index) {
            const $element = $(this);
            // Add stagger delay
            $element.css('animation-delay', `${index * 0.1}s`);
            $element.addClass('animate-on-scroll');
            observer.observe(this);
        });
    },

    // Enhanced hover animations using jQuery
    setupHoverAnimations: function() {
        // Enhanced ad space interactions
        $('.ad-space').on('click', function() {
            const $adSpace = $(this);
            $adSpace.css({
                'transform': 'scale(0.98)',
                'transition': 'transform 0.1s ease'
            });

            setTimeout(() => {
                $adSpace.css('transform', 'scale(1)');
            }, 100);
        });

        // Feature card hover effects
        $('.feature-card, .calculator-card').hover(
            function() {
                if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    $(this).css('transform', 'translateY(-2px)');
                }
            },
            function() {
                $(this).css('transform', 'translateY(0)');
            }
        );

        // Button ripple effect
        $('.btn').on('click', function(e) {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }

            const $button = $(this);
            const $ripple = $('<span class="ripple"></span>');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            $ripple.css({
                width: size + 'px',
                height: size + 'px',
                left: x + 'px',
                top: y + 'px'
            });

            $button.append($ripple);

            setTimeout(() => {
                $ripple.remove();
            }, 600);
        });
    },

    // Loading animations for dynamic content
    setupLoadingAnimations: function() {
        // Skeleton loading for dynamic content
        this.createSkeletonLoaders();
    },

    // Create skeleton loading placeholders using jQuery
    createSkeletonLoaders: function() {
        // Check if styles already exist
        if ($('#skeleton-styles').length === 0) {
            const skeletonStyles = `
                <style id="skeleton-styles">
                    .skeleton {
                        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                        background-size: 200% 100%;
                        animation: loading 1.5s infinite;
                    }

                    .skeleton-text {
                        height: 1em;
                        margin-bottom: 0.5em;
                        border-radius: 4px;
                    }

                    .skeleton-title {
                        height: 1.5em;
                        margin-bottom: 1em;
                        border-radius: 4px;
                    }

                    .skeleton-card {
                        height: 200px;
                        border-radius: var(--radius-lg);
                        margin-bottom: 1rem;
                    }

                    @keyframes loading {
                        0% { background-position: 200% 0; }
                        100% { background-position: -200% 0; }
                    }

                    .ripple {
                        position: absolute;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.3);
                        transform: scale(0);
                        animation: ripple-animation 0.6s linear;
                        pointer-events: none;
                    }

                    @keyframes ripple-animation {
                        to {
                            transform: scale(4);
                            opacity: 0;
                        }
                    }

                    .animate-on-scroll {
                        opacity: 0;
                        transform: translateY(30px);
                        transition: opacity 0.6s ease, transform 0.6s ease;
                    }

                    .animate-on-scroll.animate-in {
                        opacity: 1;
                        transform: translateY(0);
                    }

                    .pulse {
                        animation: pulse 2s infinite;
                    }

                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }

                    .bounce {
                        animation: bounce 1s infinite;
                    }

                    @keyframes bounce {
                        0%, 20%, 53%, 80%, 100% {
                            transform: translate3d(0,0,0);
                        }
                        40%, 43% {
                            transform: translate3d(0,-10px,0);
                        }
                        70% {
                            transform: translate3d(0,-5px,0);
                        }
                        90% {
                            transform: translate3d(0,-2px,0);
                        }
                    }

                    .fade-in {
                        animation: fadeIn 0.6s ease-in;
                    }

                    .slide-up {
                        animation: slideUp 0.6s ease-out;
                    }

                    .scale-in {
                        animation: scaleIn 0.3s ease-out;
                    }

                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }

                    @keyframes slideUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes scaleIn {
                        from {
                            opacity: 0;
                            transform: scale(0.95);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }

                    /* Reduced motion preferences */
                    @media (prefers-reduced-motion: reduce) {
                        *,
                        *::before,
                        *::after {
                            animation-duration: 0.01ms !important;
                            animation-iteration-count: 1 !important;
                            transition-duration: 0.01ms !important;
                            scroll-behavior: auto !important;
                        }
                    }
                </style>
            `;
            $('head').append(skeletonStyles);
        }
    },

    // Show skeleton loading using jQuery
    showSkeleton: function($container, type = 'card') {
        const $skeleton = $('<div class="skeleton skeleton-' + type + '"></div>');

        if (type === 'text') {
            for (let i = 0; i < 3; i++) {
                const $line = $('<div class="skeleton skeleton-text"></div>');
                $line.css('width', `${Math.random() * 40 + 60}%`);
                $skeleton.append($line);
            }
        }

        $container.append($skeleton);
        return $skeleton;
    },

    // Hide skeleton loading using jQuery
    hideSkeleton: function($skeleton) {
        if ($skeleton && $skeleton.length) {
            $skeleton.animate({ opacity: 0 }, 300, function() {
                $(this).remove();
            });
        }
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

    // Parallax effect for hero sections using jQuery
    setupParallax: function() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const $parallaxElements = $('.parallax');
        if ($parallaxElements.length === 0) return;

        const handleScroll = WebSpace.Core.utils.throttle(() => {
            const scrolled = $(window).scrollTop();

            $parallaxElements.each(function() {
                const $element = $(this);
                const rate = scrolled * -0.5;
                $element.css('transform', `translateY(${rate}px)`);
            });
        }, 16); // ~60fps

        $(window).on('scroll', handleScroll);
    },

    // Fade in animation for new content using jQuery
    fadeIn: function($element, duration = 300) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            $element.css('opacity', '1');
            return;
        }

        $element.css('opacity', '0').animate({ opacity: 1 }, duration);
    },

    // Scale in animation using jQuery
    scaleIn: function($element, duration = 300) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        $element.css({
            'transform': 'scale(0.9)',
            'opacity': '0'
        }).animate({
            opacity: 1
        }, {
            duration: duration,
            step: function(now, fx) {
                if (fx.prop === 'opacity') {
                    const scale = 0.9 + (0.1 * now);
                    $(this).css('transform', `scale(${scale})`);
                }
            }
        });
    },

    // Slide in from direction using jQuery
    slideIn: function($element, direction = 'up', duration = 300) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const directions = {
            up: { transform: 'translateY(20px)', animateTo: 'translateY(0)' },
            down: { transform: 'translateY(-20px)', animateTo: 'translateY(0)' },
            left: { transform: 'translateX(20px)', animateTo: 'translateX(0)' },
            right: { transform: 'translateX(-20px)', animateTo: 'translateX(0)' }
        };

        const dir = directions[direction] || directions.up;

        $element.css({
            'transform': dir.transform,
            'opacity': '0'
        });

        // Use CSS transition for transform
        $element.css('transition', `transform ${duration}ms ease, opacity ${duration}ms ease`);

        setTimeout(() => {
            $element.css({
                'transform': dir.animateTo,
                'opacity': '1'
            });
        }, 10);
    },

    // Advanced animations using jQuery
    animateCounter: function($element, start, end, duration = 1000) {
        $({ counter: start }).animate({ counter: end }, {
            duration: duration,
            easing: 'swing',
            step: function() {
                $element.text(Math.ceil(this.counter));
            },
            complete: function() {
                $element.text(end);
            }
        });
    },

    // Typewriter effect using jQuery
    typeWriter: function($element, text, speed = 100) {
        $element.text('');
        let i = 0;

        const typeInterval = setInterval(() => {
            $element.text(text.slice(0, i + 1));
            i++;

            if (i >= text.length) {
                clearInterval(typeInterval);

                // Add blinking cursor
                const $cursor = $('<span class="cursor">|</span>');
                $element.append($cursor);

                // Animate cursor blinking
                setInterval(() => {
                    $cursor.fadeToggle(500);
                }, 1000);
            }
        }, speed);
    },

    // Stagger animation for multiple elements
    staggerAnimation: function($elements, animationClass, delay = 100) {
        $elements.each(function(index) {
            const $element = $(this);
            setTimeout(() => {
                $element.addClass(animationClass);
            }, index * delay);
        });
    },

    // Progress bar animation
    animateProgressBar: function($progressBar, targetWidth, duration = 1000) {
        $progressBar.animate({
            width: targetWidth + '%'
        }, duration);
    },

    // Entrance animations for page load
    entranceAnimations: function() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        // Animate header
        $('.header').addClass('fade-in');

        // Stagger animate feature cards
        setTimeout(() => {
            this.staggerAnimation($('.feature-card'), 'slide-up', 200);
        }, 300);

        // Animate CTA section
        setTimeout(() => {
            $('.cta').addClass('scale-in');
        }, 800);
    },

    // Exit animations for page transitions
    exitAnimations: function(callback) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            if (callback) callback();
            return;
        }

        $('.main-content').addClass('fade-out');

        setTimeout(() => {
            if (callback) callback();
        }, 300);
    },

    // Smooth reveal on scroll with jQuery
    revealOnScroll: function() {
        const $revealElements = $('.reveal-on-scroll');

        if ($revealElements.length === 0) return;

        const handleScroll = WebSpace.Core.utils.throttle(() => {
            $revealElements.each(function() {
                const $element = $(this);

                if (WebSpace.Core.utils.isInViewport($element, 100)) {
                    $element.addClass('revealed');
                }
            });
        }, 100);

        $(window).on('scroll', handleScroll);
        handleScroll(); // Check on initial load
    },

    // Floating animation for decorative elements
    floatingAnimation: function($elements) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        $elements.each(function(index) {
            const $element = $(this);
            const baseDelay = index * 500;

            setInterval(() => {
                const randomY = (Math.random() - 0.5) * 20;
                const randomX = (Math.random() - 0.5) * 10;
                const randomRotation = (Math.random() - 0.5) * 10;

                $element.css({
                    'transform': `translate(${randomX}px, ${randomY}px) rotate(${randomRotation}deg)`,
                    'transition': 'transform 3s ease-in-out'
                });
            }, 3000 + baseDelay);
        });
    },

    // Morphing background animation
    morphingBackground: function($element) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const colors = ['#3498db', '#e74c3c', '#f39c12', '#2ecc71', '#9b59b6'];
        let currentIndex = 0;

        setInterval(() => {
            currentIndex = (currentIndex + 1) % colors.length;
            $element.animate({
                backgroundColor: colors[currentIndex]
            }, 2000);
        }, 3000);
    },

    // Image hover zoom effect
    setupImageHoverEffects: function() {
        $('.hover-zoom').hover(
            function() {
                $(this).css('transform', 'scale(1.05)');
            },
            function() {
                $(this).css('transform', 'scale(1)');
            }
        );
    },

    // Loading spinner with jQuery
    showLoadingSpinner: function($container, message = 'Loading...') {
        const $spinner = $(`
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        `);

        $container.append($spinner);
        return $spinner;
    },

    hideLoadingSpinner: function($spinner) {
        if ($spinner && $spinner.length) {
            $spinner.fadeOut(300, function() {
                $(this).remove();
            });
        }
    },

    // Page transition effects
    pageTransition: function(url, transitionType = 'fade') {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            window.location.href = url;
            return;
        }

        const $overlay = $('<div class="page-transition-overlay"></div>');
        $('body').append($overlay);

        switch (transitionType) {
            case 'slide':
                $overlay.css({
                    'position': 'fixed',
                    'top': 0,
                    'left': '-100%',
                    'width': '100%',
                    'height': '100%',
                    'background': 'var(--primary)',
                    'z-index': 9999
                }).animate({
                    left: 0
                }, 500, function() {
                    window.location.href = url;
                });
                break;

            case 'fade':
            default:
                $overlay.css({
                    'position': 'fixed',
                    'top': 0,
                    'left': 0,
                    'width': '100%',
                    'height': '100%',
                    'background': 'rgba(0,0,0,0.8)',
                    'z-index': 9999,
                    'opacity': 0
                }).animate({
                    opacity: 1
                }, 300, function() {
                    window.location.href = url;
                });
                break;
        }
    }
};

// Initialize animations when DOM is ready
$(document).ready(function() {
    WebSpace.Animations.init();
    WebSpace.Animations.entranceAnimations();
    WebSpace.Animations.revealOnScroll();
    WebSpace.Animations.setupImageHoverEffects();

    // Setup floating animations for decorative elements
    const $floatingElements = $('.floating-element, .decorative-element');
    if ($floatingElements.length) {
        WebSpace.Animations.floatingAnimation($floatingElements);
    }
});

// Export animations for external use
window.WebSpaceAnimations = WebSpace.Animations;