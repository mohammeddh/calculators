// jQuery Base Calculator Class - Put this in /js/common/base-calculator.js
class BaseCalculator {
    constructor(containerId) {
        this.$container = $('#' + containerId);
        this.$form = this.$container.find('.calculator-form');
        this.$results = this.$container.find('.calculator-results-section');

        if (this.$container.length) {
            this.init();
        }
    }

    init() {
        this.setupEventListeners();
        this.loadSavedValues();
        this.calculateIfReady();
    }

    setupEventListeners() {
        if (this.$form.length) {
            // Real-time calculation on input changes
            this.$form.on('input change', this.debounce(() => {
                this.calculateIfReady();
            }, 300));

            // Handle form submission
            this.$form.on('submit', (e) => {
                e.preventDefault();
                this.calculate();
            });

            // Enhanced input focus effects
            this.$form.find('input, select, textarea').on('focus', function() {
                $(this).closest('.form-group').addClass('focused');
            }).on('blur', function() {
                $(this).closest('.form-group').removeClass('focused');
            });
        }
    }

    calculateIfReady() {
        if (this.hasRequiredValues()) {
            this.calculate();
        }
    }

    hasRequiredValues() {
        let allValid = true;
        this.$form.find('[required]').each(function() {
            if (!$(this).val().trim()) {
                allValid = false;
                return false; // Break out of each loop
            }
        });
        return allValid;
    }

    getInputValues() {
        const values = {};

        this.$form.find('input, select, textarea').each(function() {
            const $input = $(this);
            const name = $input.attr('name');
            const value = $input.val();

            if (name && value !== '') {
                if ($input.attr('type') === 'checkbox') {
                    values[name] = $input.is(':checked');
                } else if (!isNaN(value) && value.trim() !== '') {
                    values[name] = parseFloat(value);
                } else {
                    values[name] = value;
                }
            }
        });

        return values;
    }

    showErrors(errors) {
        this.clearErrors();

        const $errorContainer = $(`
            <div class="error-messages alert alert-danger">
                <strong>Please fix the following errors:</strong>
                <ul class="error-list"></ul>
            </div>
        `);

        const $errorList = $errorContainer.find('.error-list');
        errors.forEach(error => {
            $errorList.append(`<li>${error}</li>`);
        });

        this.$form.prepend($errorContainer);

        // Scroll to errors
        $('html, body').animate({
            scrollTop: $errorContainer.offset().top - 100
        }, 300);

        // Auto-hide after 10 seconds
        setTimeout(() => {
            $errorContainer.fadeOut(500, function() {
                $(this).remove();
            });
        }, 10000);
    }

    clearErrors() {
        this.$form.find('.error-messages').remove();
        this.$form.find('.form-input, .form-select').removeClass('error');
    }

    showSuccess(message) {
        const $successContainer = $(`
            <div class="success-message alert alert-success">
                <strong>Success!</strong> ${message}
            </div>
        `);

        this.$form.prepend($successContainer);

        setTimeout(() => {
            $successContainer.fadeOut(500, function() {
                $(this).remove();
            });
        }, 5000);
    }

    setLoadingState(isLoading) {
        const $submitBtn = this.$form.find('button[type="submit"], .btn-calculate');

        if (isLoading) {
            $submitBtn.addClass('loading').prop('disabled', true);
            this.$form.addClass('calculating');
        } else {
            $submitBtn.removeClass('loading').prop('disabled', false);
            this.$form.removeClass('calculating');
        }
    }

    // Utility methods using jQuery
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    formatCurrencyDetailed(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    formatPercentage(rate) {
        return `${rate.toFixed(2)}%`;
    }

    formatNumber(number, decimals = 2) {
        return number.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    updateElement(selector, value) {
        const $element = $(selector);
        if ($element.length) {
            $element.text(value);
            // Add a subtle flash effect
            $element.addClass('updated');
            setTimeout(() => $element.removeClass('updated'), 300);
        }
    }

    animateNumber(selector, start, end, duration = 1000, formatter = null) {
        const $element = $(selector);
        if (!$element.length) return;

        $({ value: start }).animate({ value: end }, {
            duration: duration,
            easing: 'swing',
            step: function() {
                const current = Math.round(this.value);
                const displayValue = formatter ? formatter(current) : current;
                $element.text(displayValue);
            },
            complete: function() {
                const finalValue = formatter ? formatter(end) : end;
                $element.text(finalValue);
            }
        });
    }

    debounce(func, wait) {
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

    saveValues() {
        const values = this.getInputValues();
        try {
            localStorage.setItem(`calculator_${this.constructor.name}`, JSON.stringify(values));
        } catch (e) {
            console.warn('Could not save values to localStorage:', e);
        }
    }

    loadSavedValues() {
        try {
            const saved = localStorage.getItem(`calculator_${this.constructor.name}`);
            if (saved) {
                const values = JSON.parse(saved);

                Object.entries(values).forEach(([key, value]) => {
                    const $input = this.$form.find(`[name="${key}"]`);
                    if ($input.length && $input.val() === $input.prop('defaultValue')) {
                        if ($input.attr('type') === 'checkbox') {
                            $input.prop('checked', value);
                        } else {
                            $input.val(value);
                        }
                    }
                });
            }
        } catch (e) {
            console.warn('Could not load saved values:', e);
        }
    }

    showResults() {
        if (this.$results.length) {
            this.$results.show().addClass('fade-in');

            // Smooth scroll to results
            $('html, body').animate({
                scrollTop: this.$results.offset().top - 100
            }, 500);
        }
    }

    hideResults() {
        if (this.$results.length) {
            this.$results.removeClass('fade-in').hide();
        }
    }

    // Input validation helpers
    validateInput(name, value, rules) {
        const errors = [];

        if (rules.required && (!value || value === '')) {
            errors.push(`${rules.label || name} is required`);
            return errors;
        }

        if (rules.min !== undefined && value < rules.min) {
            errors.push(`${rules.label || name} must be at least ${rules.min}`);
        }

        if (rules.max !== undefined && value > rules.max) {
            errors.push(`${rules.label || name} cannot exceed ${rules.max}`);
        }

        if (rules.pattern && !rules.pattern.test(value)) {
            errors.push(`${rules.label || name} format is invalid`);
        }

        return errors;
    }

    highlightInput(name, isError = true) {
        const $input = this.$form.find(`[name="${name}"]`);
        if ($input.length) {
            $input.toggleClass('error', isError);
            if (isError) {
                $input.focus();
            }
        }
    }

    // Abstract methods - must be implemented by subclasses
    validate() {
        throw new Error('Must implement validate() method');
    }

    calculate() {
        throw new Error('Must implement calculate() method');
    }

    displayResults(results) {
        throw new Error('Must implement displayResults() method');
    }
}

// Enhanced jQuery utilities for calculators
$.extend({
    calculatorUtils: {
        formatCurrency: function(amount, options = {}) {
            const defaults = {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            };

            const config = $.extend({}, defaults, options);
            return new Intl.NumberFormat('en-US', config).format(amount);
        },

        formatNumber: function(number, decimals = 2) {
            return number.toLocaleString('en-US', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            });
        },

        parseNumber: function(str) {
            // Remove commas and currency symbols, then parse
            const cleaned = str.toString().replace(/[$,\s]/g, '');
            return parseFloat(cleaned) || 0;
        },

        validateEmail: function(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        },

        debounce: function(func, wait) {
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
    }
});

// jQuery plugin for easy calculator initialization
$.fn.calculator = function(calculatorClass) {
    return this.each(function() {
        const id = $(this).attr('id');
        if (id && calculatorClass) {
            new calculatorClass(id);
        }
    });
};

// Initialize WebSpace namespace for compatibility
window.WebSpace = window.WebSpace || {};
window.WebSpace.Core = {
    utils: {
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func.apply(this, args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

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

        formatCurrency: function(amount) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(amount);
        }
    },

    trackEvent: function(eventName, eventData = {}) {
        // Console log for development
        console.log('Event tracked:', eventName, eventData);

        // Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }
    }
};