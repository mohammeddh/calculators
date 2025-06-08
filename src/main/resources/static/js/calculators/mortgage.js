/**
 * Mortgage Calculator
 * Specific functionality for mortgage calculations
 */

class MortgageCalculator extends BaseCalculator {
    constructor() {
        super('#mortgage-form');
        this.chart = null;
    }

    handleCalculation() {
        if (this.isCalculating) return;

        this.setLoadingState(true);

        try {
            const inputs = this.getInputValues();
            const results = this.calculateMortgage(inputs);
            this.updateResults(results);
            this.generateAmortizationSchedule(results);
            this.createChart(results);
            this.trackCalculation('mortgage', inputs);
        } catch (error) {
            console.error('Mortgage calculation error:', error);
        } finally {
            this.setLoadingState(false);
        }
    }

    getInputValues() {
        return {
            loanAmount: parseFloat(this.form.querySelector('#loan-amount').value) || 0,
            downPayment: parseFloat(this.form.querySelector('#down-payment').value) || 0,
            interestRate: parseFloat(this.form.querySelector('#interest-rate').value) || 0,
            loanTerm: parseInt(this.form.querySelector('#loan-term').value) || 30,
            propertyTax: parseFloat(this.form.querySelector('#property-tax').value) || 0,
            homeInsurance: parseFloat(this.form.querySelector('#home-insurance').value) || 0,
            includePMI: this.form.querySelector('#pmi').checked
        };
    }

    calculateMortgage(inputs) {
        const principal = inputs.loanAmount - inputs.downPayment;
        const monthlyRate = inputs.interestRate / 100 / 12;
        const numPayments = inputs.loanTerm * 12;

        // Calculate monthly payment (principal and interest)
        let monthlyPI = 0;
        if (monthlyRate > 0) {
            monthlyPI = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                (Math.pow(1 + monthlyRate, numPayments) - 1);
        } else {
            monthlyPI = principal / numPayments;
        }

        // Calculate other monthly costs
        const monthlyTax = inputs.propertyTax / 12;
        const monthlyInsurance = inputs.homeInsurance / 12;
        let monthlyPMI = 0;

        if (inputs.includePMI && inputs.downPayment < inputs.loanAmount * 0.2) {
            monthlyPMI = principal * 0.005 / 12; // 0.5% annually
        }

        const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI;
        const totalInterest = (monthlyPI * numPayments) - principal;
        const totalCost = principal + totalInterest;

        return {
            principal,
            monthlyPI,
            monthlyTax,
            monthlyInsurance,
            monthlyPMI,
            totalMonthly,
            totalInterest,
            totalCost,
            numPayments,
            monthlyRate
        };
    }

    updateResults(results) {
        this.updateElement('#principal-interest', CalcHubUtils.formatCurrency(results.monthlyPI));
        this.updateElement('#monthly-tax', CalcHubUtils.formatCurrency(results.monthlyTax));
        this.updateElement('#monthly-insurance', CalcHubUtils.formatCurrency(results.monthlyInsurance));
        this.updateElement('#monthly-pmi', CalcHubUtils.formatCurrency(results.monthlyPMI));
        this.updateElement('#total-payment', CalcHubUtils.formatCurrency(results.totalMonthly));
        this.updateElement('#total-loan', CalcHubUtils.formatCurrency(results.principal));
        this.updateElement('#total-interest', CalcHubUtils.formatCurrency(results.totalInterest));
        this.updateElement('#total-cost', CalcHubUtils.formatCurrency(results.totalCost));

        // Add success animation
        const resultsContainer = document.querySelector('#mortgage-results');
        if (resultsContainer) {
            resultsContainer.classList.add('success');
            setTimeout(() => resultsContainer.classList.remove('success'), 400);
        }
    }

    generateAmortizationSchedule(results) {
        const tbody = document.querySelector('#amortization-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        let balance = results.principal;
        const currentDate = new Date();

        // Show first 12 months
        for (let i = 1; i <= Math.min(12, results.numPayments); i++) {
            const interestPayment = balance * results.monthlyRate;
            const principalPayment = results.monthlyPI - interestPayment;
            balance -= principalPayment;

            const paymentDate = new Date(currentDate);
            paymentDate.setMonth(paymentDate.getMonth() + i);

            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${i}</td>
        <td>${paymentDate.toLocaleDateString()}</td>
        <td>${CalcHubUtils.formatCurrency(results.monthlyPI)}</td>
        <td>${CalcHubUtils.formatCurrency(principalPayment)}</td>
        <td>${CalcHubUtils.formatCurrency(interestPayment)}</td>
        <td>${CalcHubUtils.formatCurrency(Math.max(0, balance))}</td>
      `;
            tbody.appendChild(row);
        }
    }

    createChart(results) {
        const canvas = document.querySelector('#payment-chart');
        if (!canvas || typeof Chart === 'undefined') return;

        // Destroy existing chart if it exists
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }

        // Ensure canvas has proper size constraints
        const container = canvas.parentElement;
        const containerWidth = container.clientWidth || 300;
        const containerHeight = container.clientHeight || 250;

        // Set reasonable canvas dimensions
        canvas.width = Math.min(containerWidth - 32, 400); // Account for padding
        canvas.height = Math.min(containerHeight - 60, 200); // Account for title
        canvas.style.width = canvas.width + 'px';
        canvas.style.height = canvas.height + 'px';

        const ctx = canvas.getContext('2d');

        try {
            this.chart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Principal & Interest', 'Property Tax', 'Insurance', 'PMI'],
                    datasets: [{
                        data: [results.monthlyPI, results.monthlyTax, results.monthlyInsurance, results.monthlyPMI],
                        backgroundColor: [
                            'hsl(210, 70%, 55%)',
                            'hsl(210, 70%, 65%)',
                            'hsl(210, 70%, 75%)',
                            'hsl(210, 70%, 85%)'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: false, // Disable responsive to control size manually
                    maintainAspectRatio: false,
                    devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2), // Limit pixel ratio
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                boxWidth: 12,
                                padding: 8,
                                font: {
                                    size: 11
                                }
                            }
                        }
                    },
                    layout: {
                        padding: 10
                    }
                }
            });
        } catch (error) {
            console.error('Chart creation failed:', error);
            // Hide chart container if chart fails
            container.style.display = 'none';
        }
    }
}

// Initialize mortgage calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('#mortgage-form')) {
        new MortgageCalculator();
    }
});