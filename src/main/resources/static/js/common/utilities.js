/**
 * Common utility functions for WebSpace - jQuery Enhanced
 */

WebSpace.Utils = {

    // Form handling utilities
    forms: {
        // Serialize form data to object
        serializeToObject: function($form) {
            const formData = {};
            $form.serializeArray().forEach(function(item) {
                if (formData[item.name]) {
                    if (Array.isArray(formData[item.name])) {
                        formData[item.name].push(item.value);
                    } else {
                        formData[item.name] = [formData[item.name], item.value];
                    }
                } else {
                    formData[item.name] = item.value;
                }
            });
            return formData;
        },

        // Validate form fields
        validateForm: function($form, rules = {}) {
            const errors = [];
            const data = this.serializeToObject($form);

            Object.keys(rules).forEach(fieldName => {
                const rule = rules[fieldName];
                const value = data[fieldName];
                const $field = $form.find(`[name="${fieldName}"]`);

                // Clear previous error state
                $field.removeClass('error');

                // Required validation
                if (rule.required && (!value || value.trim() === '')) {
                    errors.push({
                        field: fieldName,
                        message: rule.requiredMessage || `${fieldName} is required`,
                        $element: $field
                    });
                    $field.addClass('error');
                    return;
                }

                // Skip other validations if field is empty and not required
                if (!value || value.trim() === '') return;

                // Email validation
                if (rule.email && !WebSpace.Utils.validation.isEmail(value)) {
                    errors.push({
                        field: fieldName,
                        message: rule.emailMessage || 'Please enter a valid email address',
                        $element: $field
                    });
                    $field.addClass('error');
                }

                // Min length validation
                if (rule.minLength && value.length < rule.minLength) {
                    errors.push({
                        field: fieldName,
                        message: rule.minLengthMessage || `${fieldName} must be at least ${rule.minLength} characters`,
                        $element: $field
                    });
                    $field.addClass('error');
                }

                // Max length validation
                if (rule.maxLength && value.length > rule.maxLength) {
                    errors.push({
                        field: fieldName,
                        message: rule.maxLengthMessage || `${fieldName} cannot exceed ${rule.maxLength} characters`,
                        $element: $field
                    });
                    $field.addClass('error');
                }

                // Custom pattern validation
                if (rule.pattern && !rule.pattern.test(value)) {
                    errors.push({
                        field: fieldName,
                        message: rule.patternMessage || `${fieldName} format is invalid`,
                        $element: $field
                    });
                    $field.addClass('error');
                }

                // Custom validator function
                if (rule.custom && typeof rule.custom === 'function') {
                    const customResult = rule.custom(value, data);
                    if (customResult !== true) {
                        errors.push({
                            field: fieldName,
                            message: customResult || `${fieldName} is invalid`,
                            $element: $field
                        });
                        $field.addClass('error');
                    }
                }
            });

            return errors;
        },

        // Show form errors
        showErrors: function($form, errors) {
            // Remove existing errors
            $form.find('.field-error').remove();
            $form.find('.form-errors').remove();

            if (errors.length === 0) return;

            // Show field-specific errors
            errors.forEach(error => {
                if (error.$element && error.$element.length) {
                    const $errorMsg = $(`<div class="field-error">${error.message}</div>`);
                    error.$element.closest('.form-group').append($errorMsg);
                }
            });

            // Show general error summary
            const $errorSummary = $(`
                <div class="form-errors alert alert-danger">
                    <strong>Please correct the following errors:</strong>
                    <ul></ul>
                </div>
            `);

            const $errorList = $errorSummary.find('ul');
            errors.forEach(error => {
                $errorList.append(`<li>${error.message}</li>`);
            });

            $form.prepend($errorSummary);

            // Scroll to first error
            if (errors[0].$element) {
                WebSpace.Core.utils.scrollTo(errors[0].$element, 100);
            }
        }
    },

    // Validation utilities
    validation: {
        isEmail: function(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        isPhone: function(phone) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
        },

        isURL: function(url) {
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        },

        isCreditCard: function(number) {
            // Simple Luhn algorithm check
            const cleanNumber = number.replace(/\D/g, '');
            if (cleanNumber.length < 13 || cleanNumber.length > 19) return false;

            let sum = 0;
            let isEven = false;

            for (let i = cleanNumber.length - 1; i >= 0; i--) {
                let digit = parseInt(cleanNumber.charAt(i));

                if (isEven) {
                    digit *= 2;
                    if (digit > 9) {
                        digit -= 9;
                    }
                }

                sum += digit;
                isEven = !isEven;
            }

            return sum % 10 === 0;
        },

        isStrongPassword: function(password) {
            // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
            const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
            return strongRegex.test(password);
        }
    },

    // Data formatting utilities
    format: {
        currency: function(amount, currency = 'USD', locale = 'en-US') {
            return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: currency
            }).format(amount);
        },

        number: function(number, decimals = 2, locale = 'en-US') {
            return new Intl.NumberFormat(locale, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            }).format(number);
        },

        percentage: function(value, decimals = 1) {
            return `${(value * 100).toFixed(decimals)}%`;
        },

        date: function(date, format = 'short', locale = 'en-US') {
            const options = {
                short: { year: 'numeric', month: 'short', day: 'numeric' },
                long: { year: 'numeric', month: 'long', day: 'numeric' },
                full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
            };

            return new Intl.DateTimeFormat(locale, options[format] || options.short).format(new Date(date));
        },

        time: function(date, format = 'short', locale = 'en-US') {
            const options = {
                short: { hour: '2-digit', minute: '2-digit' },
                long: { hour: '2-digit', minute: '2-digit', second: '2-digit' }
            };

            return new Intl.DateTimeFormat(locale, options[format] || options.short).format(new Date(date));
        },

        fileSize: function(bytes) {
            if (bytes === 0) return '0 Bytes';

            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));

            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },

        truncate: function(str, length = 100, suffix = '...') {
            if (str.length <= length) return str;
            return str.substring(0, length) + suffix;
        }
    },

    // String utilities
    string: {
        capitalize: function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        },

        camelCase: function(str) {
            return str.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '');
        },

        kebabCase: function(str) {
            return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase().replace(/[\s_]+/g, '-');
        },

        slugify: function(str) {
            return str
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');
        },

        stripHtml: function(html) {
            const tmp = document.createElement('div');
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || '';
        },

        highlight: function(text, query) {
            if (!query) return text;
            const regex = new RegExp(`(${query})`, 'gi');
            return text.replace(regex, '<mark>$1</mark>');
        }
    },

    // Array utilities
    array: {
        chunk: function(array, size) {
            const chunks = [];
            for (let i = 0; i < array.length; i += size) {
                chunks.push(array.slice(i, i + size));
            }
            return chunks;
        },

        unique: function(array) {
            return [...new Set(array)];
        },

        shuffle: function(array) {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        },

        groupBy: function(array, key) {
            return array.reduce((groups, item) => {
                const group = item[key];
                groups[group] = groups[group] || [];
                groups[group].push(item);
                return groups;
            }, {});
        },

        sortBy: function(array, key, direction = 'asc') {
            return [...array].sort((a, b) => {
                const aVal = a[key];
                const bVal = b[key];

                if (aVal < bVal) return direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
    },

    // DOM utilities
    dom: {
        // Create element with jQuery
        createElement: function(tag, attributes = {}, content = '') {
            const $element = $(`<${tag}>`);

            Object.keys(attributes).forEach(key => {
                if (key === 'class') {
                    $element.addClass(attributes[key]);
                } else if (key === 'data') {
                    Object.keys(attributes[key]).forEach(dataKey => {
                        $element.data(dataKey, attributes[key][dataKey]);
                    });
                } else {
                    $element.attr(key, attributes[key]);
                }
            });

            if (content) {
                $element.html(content);
            }

            return $element;
        },

        // Get element dimensions
        getDimensions: function($element) {
            return {
                width: $element.outerWidth(),
                height: $element.outerHeight(),
                innerWidth: $element.width(),
                innerHeight: $element.height()
            };
        },

        // Get element position relative to document
        getPosition: function($element) {
            const offset = $element.offset();
            return {
                top: offset.top,
                left: offset.left,
                bottom: offset.top + $element.outerHeight(),
                right: offset.left + $element.outerWidth()
            };
        },

        // Check if element is visible in viewport
        isInViewport: function($element, threshold = 0) {
            if (!$element.length) return false;

            const rect = $element[0].getBoundingClientRect();
            const windowHeight = $(window).height();
            const windowWidth = $(window).width();

            return (
                rect.top >= -threshold &&
                rect.left >= -threshold &&
                rect.bottom <= windowHeight + threshold &&
                rect.right <= windowWidth + threshold
            );
        }
    },

    // Math utilities
    math: {
        clamp: function(value, min, max) {
            return Math.min(Math.max(value, min), max);
        },

        lerp: function(start, end, factor) {
            return start + (end - start) * factor;
        },

        roundTo: function(number, decimals) {
            const factor = Math.pow(10, decimals);
            return Math.round(number * factor) / factor;
        },

        randomBetween: function(min, max) {
            return Math.random() * (max - min) + min;
        },

        randomInt: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        percentage: function(value, total) {
            return total === 0 ? 0 : (value / total) * 100;
        }
    },

    // Performance utilities
    performance: {
        debounce: function(func, wait, immediate) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    timeout = null;
                    if (!immediate) func.apply(this, args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(this, args);
            };
        },

        throttle: function(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        memoize: function(func) {
            const cache = new Map();
            return function(...args) {
                const key = JSON.stringify(args);
                if (cache.has(key)) {
                    return cache.get(key);
                }
                const result = func.apply(this, args);
                cache.set(key, result);
                return result;
            };
        }
    }
};

// Export utilities
window.WebSpaceUtils = WebSpace.Utils;