/**
 * Base Calculator Class
 * Generic functionality for all calculator types
 */

class BaseCalculator {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        this.isCalculating = false;

        if (this.form) {
            this.init();
        }
    }

    init() {
        this.setupEventListeners();
        this.setupInputFormatters();
        this.setupValidation();
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCalculation();
        });

        // Real-time calculation on input change
        this.form.addEventListener('input', CalcHubUtils.debounce(() => {
            if (this.validateInputs()) {
                this.handleCalculation();
            }
        }, 300));
    }

    setupInputFormatters() {
        // Format number inputs
        this.form.addEventListener('input', (e) => {
            if (e.target.type === 'number') {
                this.formatNumberInput(e.target);
            }
        });
    }

    setupValidation() {
        // Real-time validation
        this.form.addEventListener('blur', (e) => {
            if (e.target.matches?.('input[required]')) {
                this.validateField(e.target);
            }
        }, true);
    }

    formatNumberInput(input) {
        // Remove non-numeric characters except decimal point
        let value = input.value.replace(/[^0-9.]/g, '');

        // Ensure only one decimal point
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }

        input.value = value;
    }

    validateField(field) {
        const value = parseFloat(field.value);
        const min = parseFloat(field.min);
        const max = parseFloat(field.max);

        let isValid = true;
        let errorMessage = '';

        if (field.required && !field.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (isNaN(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid number';
        } else if (min !== undefined && value < min) {
            isValid = false;
            errorMessage = `Value must be at least ${min}`;
        } else if (max !== undefined && value > max) {
            isValid = false;
            errorMessage = `Value must not exceed ${max}`;
        }

        this.showFieldError(field, isValid ? null : errorMessage);
        return isValid;
    }

    showFieldError(field, message) {
        // Remove existing error
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        if (message) {
            field.classList.add('error');
            field.setAttribute('aria-invalid', 'true');

            const errorEl = document.createElement('div');
            errorEl.className = 'error-message';
            errorEl.textContent = message;
            field.parentNode.appendChild(errorEl);
        } else {
            field.classList.remove('error');
            field.removeAttribute('aria-invalid');
        }
    }

    validateInputs() {
        const requiredInputs = this.form.querySelectorAll('input[required]');
        let allValid = true;

        requiredInputs.forEach(input => {
            if (!this.validateField(input)) {
                allValid = false;
            }
        });

        return allValid;
    }

    setLoadingState(isLoading) {
        this.form.classList.toggle('loading', isLoading);
        this.isCalculating = isLoading;
    }

    updateElement(selector, value) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = value;
        }
    }

    handleCalculation() {
        // Override in child classes
        console.warn('handleCalculation should be overridden in child class');
    }

    trackCalculation(calculatorType, inputs = {}) {
        // Track calculation events
        console.log('Calculation tracked:', calculatorType, inputs);

        // If analytics is available, use it
        if (typeof gtag !== 'undefined') {
            gtag('event', `${calculatorType}_calculation`, inputs);
        }
    }
}

// Export for use in other calculator files
window.BaseCalculator = BaseCalculator;