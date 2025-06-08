/**
 * Loan Calculator
 * Specific functionality for loan calculations
 */

class LoanCalculator extends BaseCalculator {
    constructor() {
        super('#loan-form');
        this.chart = null;
    }

    handleCalculation() {
        if (this.isCalculating) return;

        this.setLoadingState(true);

        try {
            const inputs = this.getInputValues();
            const results = this.calculateLoan(inputs);
            this.updateResults(results);
            this.createChart(results);
            this.trackCalculation('loan', inputs);
        } catch (error) {
            console.error('Loan calculation error:', error);
        } finally {
            this.setLoadingState(false);
        }
    }

    getInputValues() {
        return {
            loanAmount: parseFloat(this.form.querySelector('#loan-amount').value) || 0,
            interestRate: parseFloat(this.form.querySelector('#interest-rate').value) || 0,
            loanTerm: parseInt(this.form.querySelector('#loan-term').value) || 12,
            loanType: this.form.querySelector('#loan-type').value || 'personal'
        };
    }

    calculateLoan(inputs) {
        const principal = inputs.loanAmount;
        const monthlyRate = inputs.interestRate / 100 / 12;
        const numPayments = inputs.loanTerm;

        // Calculate monthly payment
        let monthlyPayment = 0;
        if (monthlyRate > 0) {
            monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                (Math.pow(1 + monthlyRate, numPayments) - 1);
        } else {
            monthlyPayment = principal / numPayments;
        }

        const totalPayment = monthlyPayment * numPayments;
        const totalInterest = totalPayment - principal;

        return {
            principal,
            monthlyPayment,
            totalPayment,
            totalInterest,
            numPayments,
            monthlyRate
        };
    }

    updateResults(results) {
        this.updateElement('#monthly-payment', CalcHubUtils.formatCurrency(results.monthlyPayment));
        this.updateElement('#total-payment', CalcHubUtils.formatCurrency(results.totalPayment));
        this.updateElement('#total-interest', CalcHubUtils.formatCurrency(results.totalInterest));
        this.updateElement('#loan-principal', CalcHubUtils.formatCurrency(results.principal));

        // Add success animation
        const resultsContainer = document.querySelector('#loan-results');
        if (resultsContainer) {
            resultsContainer.classList.add('success');
            setTimeout(() => resultsContainer.classList.remove('success'), 400);
        }
    }

    createChart(results) {
        const canvas = document.querySelector('#loan-chart');
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
                    labels: ['Principal', 'Interest'],
                    datasets: [{
                        data: [results.principal, results.totalInterest],
                        backgroundColor: [
                            'hsl(210, 70%, 55%)',
                            'hsl(210, 70%, 75%)'
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

// Initialize loan calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('#loan-form')) {
        new LoanCalculator();
    }
});