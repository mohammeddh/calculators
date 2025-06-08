/**
 * BMI Calculator
 * Specific functionality for BMI calculations
 */

class BMICalculator extends BaseCalculator {
    constructor() {
        super('#bmi-form');
        this.categories = [
            { min: 0, max: 18.5, name: 'Underweight', color: '#3b82f6' },
            { min: 18.5, max: 25, name: 'Normal weight', color: '#10b981' },
            { min: 25, max: 30, name: 'Overweight', color: '#f59e0b' },
            { min: 30, max: Infinity, name: 'Obese', color: '#ef4444' }
        ];
    }

    handleCalculation() {
        if (this.isCalculating) return;

        this.setLoadingState(true);

        try {
            const inputs = this.getInputValues();
            const results = this.calculateBMI(inputs);
            this.updateResults(results);
            this.updateCategories(results.bmi);
            this.trackCalculation('bmi', inputs);
        } catch (error) {
            console.error('BMI calculation error:', error);
        } finally {
            this.setLoadingState(false);
        }
    }

    getInputValues() {
        return {
            weight: parseFloat(this.form.querySelector('#weight').value) || 0,
            height: parseFloat(this.form.querySelector('#height').value) || 0,
            unit: this.form.querySelector('#unit').value || 'metric'
        };
    }

    calculateBMI(inputs) {
        if (inputs.weight <= 0 || inputs.height <= 0) {
            throw new Error('Invalid weight or height');
        }

        let bmi;
        if (inputs.unit === 'metric') {
            // kg and cm
            const heightM = inputs.height / 100;
            bmi = inputs.weight / (heightM * heightM);
        } else {
            // lbs and inches
            bmi = (inputs.weight / (inputs.height * inputs.height)) * 703;
        }

        const category = this.getBMICategory(bmi);
        const advice = this.getBMIAdvice(category);

        return {
            bmi: bmi,
            category: category,
            advice: advice
        };
    }

    getBMICategory(bmi) {
        return this.categories.find(cat => bmi >= cat.min && bmi < cat.max) || this.categories[0];
    }

    getBMIAdvice(category) {
        const advice = {
            'Underweight': 'Consider consulting with a healthcare provider about healthy weight gain strategies.',
            'Normal weight': 'Maintain your healthy lifestyle with balanced diet and regular exercise.',
            'Overweight': 'Consider lifestyle changes like increased physical activity and balanced nutrition.',
            'Obese': 'Consult with a healthcare provider for personalized weight management advice.'
        };

        return advice[category.name] || 'Consult with a healthcare provider for personalized advice.';
    }

    updateResults(results) {
        this.updateElement('#bmi-result', results.bmi.toFixed(1));
        this.updateElement('#bmi-category', results.category.name);
        this.updateElement('#bmi-advice', results.advice);

        // Update result container styling
        const resultContainer = document.querySelector('.bmi-result');
        if (resultContainer) {
            resultContainer.style.borderColor = results.category.color;
            resultContainer.style.backgroundColor = results.category.color + '20';
        }

        // Add success animation
        const resultsContainer = document.querySelector('#bmi-results');
        if (resultsContainer) {
            resultsContainer.classList.add('success');
            setTimeout(() => resultsContainer.classList.remove('success'), 400);
        }
    }

    updateCategories(currentBMI) {
        const categoryList = document.querySelector('.category-list');
        if (!categoryList) return;

        categoryList.innerHTML = '';

        this.categories.forEach(category => {
            const isActive = currentBMI >= category.min && currentBMI < category.max;
            const item = document.createElement('div');
            item.className = `category-item ${isActive ? 'active' : ''}`;

            const rangeText = category.max === Infinity ?
                `${category.min}+` :
                `${category.min} - ${category.max}`;

            item.innerHTML = `
        <span>${category.name}</span>
        <span>${rangeText}</span>
      `;

            if (isActive) {
                item.style.borderColor = category.color;
                item.style.backgroundColor = category.color + '20';
            }

            categoryList.appendChild(item);
        });
    }
}

// Initialize BMI calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('#bmi-form')) {
        new BMICalculator();
    }
});