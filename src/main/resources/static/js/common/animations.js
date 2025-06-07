/**
 * Animation utilities and scroll-based animations
 */

WebSpace.Animations = {

    // Initialize animations
    init: function() {
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupLoadingAnimations();
    },

    // Scroll-based animations using Intersection Observer
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
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    // Optional: Stop observing after animation
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements that should animate on scroll
        const animatedElements = document.querySelectorAll(
            '.feature-card, .calculator-card, .content-section'
        );

        animatedElements.forEach((el, index) => {
            // Add stagger delay
            el.style.animationDelay = `${index * 0.1}s`;
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    },

    // Enhanced hover animations
    setupHoverAnimations: function() {
        // Enhanced ad space interactions
        const adSpaces = document.querySelectorAll('.ad-space');
        adSpaces.forEach(adSpace => {
            adSpace.addEventListener('click', function() {
                this.style.transform = 'scale(0.98)';
                this.style.transition = 'transform 0.1s ease';

                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 100);
            });
        });

        // Feature card hover effects
        const featureCards = document.querySelectorAll('.feature-card, .calculator-card');
        featureCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    this.style.transform = 'translateY(-2px)';
                }
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });

        // Button ripple effect
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    return;
                }

                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');

                this.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    },

    // Loading animations for dynamic content
    setupLoadingAnimations: function() {
        // Skeleton loading for dynamic content
        this.createSkeletonLoaders();
    },

    // Create skeleton loading placeholders
    createSkeletonLoaders: function() {
        const style = document.createElement('style');
        style.textContent = `
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
        `;
        document.head.appendChild(style);
    },

    // Show skeleton loading
    showSkeleton: function(container, type = 'card') {
        const skeleton = document.createElement('div');
        skeleton.className = `skeleton skeleton-${type}`;

        if (type === 'text') {
            for (let i = 0; i < 3; i++) {
                const line = document.createElement('div');
                line.className = 'skeleton skeleton-text';
                line.style.width = `${Math.random() * 40 + 60}%`;
                skeleton.appendChild(line);
            }
        }

        container.appendChild(skeleton);
        return skeleton;
    },

    // Hide skeleton loading
    hideSkeleton: function(skeleton) {
        if (skeleton && skeleton.parentNode) {
            skeleton.style.opacity = '0';
            setTimeout(() => {
                skeleton.remove();
            }, 300);
        }
    },

    // Smooth scroll to element
    scrollTo: function(target, offset = 0) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (!element) return;

        const targetPosition = element.offsetTop - offset;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            window.scrollTo(0, targetPosition);
        } else {
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    },

    // Parallax effect for hero sections
    setupParallax: function() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const parallaxElements = document.querySelectorAll('.parallax');

        const handleScroll = WebSpace.Core.utils.throttle(() => {
            const scrolled = window.pageYOffset;

            parallaxElements.forEach(element => {
                const rate = scrolled * -0.5;
                element.style.transform = `translateY(${rate}px)`;
            });
        }, 16); // ~60fps

        window.addEventListener('scroll', handleScroll);
    },

    // Fade in animation for new content
    fadeIn: function(element, duration = 300) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            element.style.opacity = '1';
            return;
        }

        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease`;

        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
    },

    // Scale in animation
    scaleIn: function(element, duration = 300) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        element.style.transform = 'scale(0.9)';
        element.style.opacity = '0';
        element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;

        requestAnimationFrame(() => {
            element.style.transform = 'scale(1)';
            element.style.opacity = '1';
        });
    },

    // Slide in from direction
    slideIn: function(element, direction = 'up', duration = 300) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const directions = {
            up: 'translateY(20px)',
            down: 'translateY(-20px)',
            left: 'translateX(20px)',
            right: 'translateX(-20px)'
        };

        element.style.transform = directions[direction] || directions.up;
        element.style.opacity = '0';
        element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;

        requestAnimationFrame(() => {
            element.style.transform = 'translateY(0) translateX(0)';
            element.style.opacity = '1';
        });
    }
};

// Initialize animations when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        WebSpace.Animations.init();
    });
} else {
    WebSpace.Animations.init();
}