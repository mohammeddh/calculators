// jQuery Mortgage Calculator - Put this in /js/calculators/mortgage.js
class MortgageCalculator extends BaseCalculator {
    constructor() {
        super('mortgage-calculator');
        this.chart = null;
        this.setupMortgageSpecificFeatures();
    }

    setupMortgageSpecificFeatures() {
        // Add thousand separators to currency inputs
        this.$form.find('input[name="loanAmount"], input[name="downPayment"], input[name="propertyTax"], input[name="homeInsurance"]')
            .on('input', function() {
                const value = $(this).val().replace(/,/g, '');
                if (!isNaN(value) && value !== '') {
                    const formatted = parseInt(value).toLocaleString();
                    $(this).val(formatted);
                }
            });

        // Add percentage formatting
        this.$form.find('input[name="interestRate"]').on('blur', function() {
            const value = parseFloat($(this).val());
            if (!isNaN(value)) {
                $(this).val(value.toFixed(2));
            }
        });

        // Down payment percentage calculator
        this.setupDownPaymentHelper();

        // Loan term change effects
        this.$form.find('select[name="loanTerm"]').on('change', () => {
            this.$form.find('.loan-term-info').remove();
            const term = parseInt(this.$form.find('select[name="loanTerm"]').val());
            const totalPayments = term * 12;

            $(`<small class="loan-term-info text-light">
                Total payments: ${totalPayments}
            </small>`).insertAfter(this.$form.find('select[name="loanTerm"]'));
        });
    }

    setupDownPaymentHelper() {
        const $loanAmount = this.$form.find('input[name="loanAmount"]');
        const $downPayment = this.$form.find('input[name="downPayment"]');

        // Add percentage display
        const $percentageDisplay = $('<span class="down-payment-percentage text-light"></span>');
        $downPayment.closest('.form-group').append($percentageDisplay);

        const updatePercentage = () => {
            const loanAmount = $.calculatorUtils.parseNumber($loanAmount.val());
            const downPayment = $.calculatorUtils.parseNumber($downPayment.val());

            if (loanAmount > 0) {
                const percentage = (downPayment / loanAmount * 100).toFixed(1);
                $percentageDisplay.text(`(${percentage}% of loan amount)`);

                // Highlight if less than 20%
                if (percentage < 20) {
                    $percentageDisplay.addClass('text-warning').removeClass('text-success');
                } else {
                    $percentageDisplay.addClass('text-success').removeClass('text-warning');
                }
            }
        };

        $loanAmount.add($downPayment).on('input', $.calculatorUtils.debounce(updatePercentage, 300));

        // Initial calculation
        updatePercentage();
    }

    validate() {
        const values = this.getInputValues();
        const errors = [];

        // Loan Amount validation
        const loanAmountErrors = this.validateInput('loanAmount', values.loanAmount, {
            required: true,
            min: 1000,
            max: 10000000,
            label: 'Loan Amount'
        });
        errors.push(...loanAmountErrors);

        // Interest Rate validation
        const interestErrors = this.validateInput('interestRate', values.interestRate, {
            required: true,
            min: 0,
            max: 30,
            label: 'Interest Rate'
        });
        errors.push(...interestErrors);

        // Loan Term validation
        const termErrors = this.validateInput('loanTerm', values.loanTerm, {
            required: true,
            min: 1,
            max: 50,
            label: 'Loan Term'
        });
        errors.push(...termErrors);

        // Down Payment validation
        if (values.downPayment < 0) {
            errors.push('Down payment cannot be negative');
            this.highlightInput('downPayment');
        }

        if (values.downPayment >= values.loanAmount) {
            errors.push('Down payment must be less than loan amount');
            this.highlightInput('downPayment');
        }

        // Property Tax validation
        if (values.propertyTax < 0) {
            errors.push('Property tax cannot be negative');
            this.highlightInput('propertyTax');
        }

        // Home Insurance validation
        if (values.homeInsurance < 0) {
            errors.push('Home insurance cannot be negative');
            this.highlightInput('homeInsurance');
        }

        return errors;
    }

    calculate() {
        this.setLoadingState(true);

        setTimeout(() => {
            const errors = this.validate();
            if (errors.length > 0) {
                this.showErrors(errors);
                this.setLoadingState(false);
                return;
            }

            this.clearErrors();
            const inputs = this.getInputValues();
            const results = this.performMortgageCalculation(inputs);

            this.displayResults(results);
            this.updateChart(results);
            this.generateAmortizationTable(results);
            this.saveValues();
            this.showResults();

            this.setLoadingState(false);

            // Track calculation event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'calculator_used', {
                    calculator_type: 'mortgage',
                    loan_amount: inputs.loanAmount,
                    interest_rate: inputs.interestRate,
                    loan_term: inputs.loanTerm
                });
            }
        }, 500); // Small delay for better UX
    }

    performMortgageCalculation(inputs) {
        const {
            loanAmount,
            interestRate,
            loanTerm,
            downPayment = 0,
            propertyTax = 0,
            homeInsurance = 0,
            pmi = false
        } = inputs;

        const principal = loanAmount - downPayment;
        const monthlyRate = (interestRate / 100) / 12;
        const numPayments = loanTerm * 12;

        // Calculate monthly principal and interest
        let monthlyPI = 0;
        if (monthlyRate > 0) {
            monthlyPI = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                (Math.pow(1 + monthlyRate, numPayments) - 1);
        } else {
            monthlyPI = principal / numPayments; // 0% interest rate
        }

        // Calculate other monthly costs
        const monthlyTax = propertyTax / 12;
        const monthlyInsurance = homeInsurance / 12;

        // PMI calculation (typically 0.5% to 1% annually, we'll use 0.5%)
        const monthlyPMI = (pmi && downPayment < loanAmount * 0.2) ?
            (principal * 0.005 / 12) : 0;

        const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI;
        const totalInterest = (monthlyPI * numPayments) - principal;
        const totalCost = totalMonthly * numPayments;

        // Generate amortization schedule
        const amortizationSchedule = this.calculateAmortizationSchedule(
            principal, monthlyRate, numPayments, monthlyPI
        );

        return {
            loanAmount,
            principal,
            downPayment,
            monthlyPI,
            monthlyTax,
            monthlyInsurance,
            monthlyPMI,
            totalMonthly,
            totalInterest,
            totalCost,
            amortizationSchedule,
            effectiveRate: interestRate,
            paymentNumber: numPayments
        };
    }

    calculateAmortizationSchedule(principal, monthlyRate, numPayments, monthlyPayment) {
        const schedule = [];
        let remainingBalance = principal;
        const startDate = new Date();

        for (let payment = 1; payment <= numPayments && payment <= 360; payment++) {
            const interestPayment = remainingBalance * monthlyRate;
            const principalPayment = monthlyPayment - interestPayment;
            remainingBalance = Math.max(0, remainingBalance - principalPayment);

            const paymentDate = new Date(startDate);
            paymentDate.setMonth(paymentDate.getMonth() + payment);

            schedule.push({
                paymentNumber: payment,
                date: paymentDate.toLocaleDateString(),
                payment: monthlyPayment,
                principal: principalPayment,
                interest: interestPayment,
                balance: remainingBalance
            });

            if (remainingBalance <= 0) break;
        }

        return schedule;
    }

    displayResults(results) {
        // Update payment breakdown with animations
        this.updateElement('#principal-interest', this.formatCurrency(results.monthlyPI));
        this.updateElement('#monthly-tax', this.formatCurrency(results.monthlyTax));
        this.updateElement('#monthly-insurance', this.formatCurrency(results.monthlyInsurance));
        this.updateElement('#monthly-pmi', this.formatCurrency(results.monthlyPMI));

        // Update loan summary
        this.updateElement('#total-loan', this.formatCurrency(results.principal));
        this.updateElement('#total-interest', this.formatCurrency(results.totalInterest));
        this.updateElement('#total-cost', this.formatCurrency(results.totalCost));

        // Animate the main payment with emphasis
        this.animateNumber('#total-payment', 0, results.totalMonthly, 1500, (value) => {
            return this.formatCurrency(value);
        });

        // Add summary insights
        this.displayInsights(results);
    }

    displayInsights(results) {
        // Remove existing insights
        $('.mortgage-insights').remove();

        const insights = [];

        // Interest vs Principal insight
        const interestPercentage = (results.totalInterest / results.totalCost * 100).toFixed(1);
        insights.push(`You'll pay ${interestPercentage}% of the total cost in interest`);

        // PMI insight
        if (results.monthlyPMI > 0) {
            const annualPMI = results.monthlyPMI * 12;
            insights.push(`PMI adds $${this.formatNumber(annualPMI, 0)} annually to your costs`);
        }

        // Down payment insight
        const downPaymentPercent = (results.downPayment / results.loanAmount * 100).toFixed(1);
        if (downPaymentPercent < 20) {
            insights.push(`Consider saving for a 20% down payment to avoid PMI`);
        } else {
            insights.push(`Great! Your ${downPaymentPercent}% down payment avoids PMI`);
        }

        // Create insights display
        if (insights.length > 0) {
            const $insightsContainer = $(`
                <div class="mortgage-insights mt-3">
                    <h4 class="text-lg font-semibold mb-2">💡 Key Insights</h4>
                    <ul class="insights-list"></ul>
                </div>
            `);

            const $insightsList = $insightsContainer.find('.insights-list');
            insights.forEach(insight => {
                $insightsList.append(`<li class="insight-item">${insight}</li>`);
            });

            this.$results.find('.results-container').append($insightsContainer);
        }
    }

    updateChart(results) {
        const $canvas = $('#payment-chart');
        if (!$canvas.length) return;

        // Destroy existing chart
        if (this.chart) {
            this.chart.destroy();
        }

        // Only create chart if Chart.js is available
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded');
            return;
        }

        const data = [];
        const labels = [];
        const colors = [];

        if (results.monthlyPI > 0) {
            data.push(results.monthlyPI);
            labels.push('Principal & Interest');
            colors.push('#3498db');
        }

        if (results.monthlyTax > 0) {
            data.push(results.monthlyTax);
            labels.push('Property Tax');
            colors.push('#e74c3c');
        }

        if (results.monthlyInsurance > 0) {
            data.push(results.monthlyInsurance);
            labels.push('Insurance');
            colors.push('#f39c12');
        }

        if (results.monthlyPMI > 0) {
            data.push(results.monthlyPMI);
            labels.push('PMI');
            colors.push('#9b59b6');
        }

        this.chart = new Chart($canvas[0].getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = this.formatCurrency(context.raw);
                                const percentage = ((context.raw / results.totalMonthly) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 1000
                }
            }
        });
    }

    generateAmortizationTable(results) {
        const $tbody = $('#amortization-table tbody');
        if (!$tbody.length) return;

        $tbody.empty();

        // Show first 12 payments and then every 12th payment
        const schedule = results.amortizationSchedule;
        const paymentsToShow = [];

        // First year (monthly)
        for (let i = 0; i < Math.min(12, schedule.length); i++) {
            paymentsToShow.push(schedule[i]);
        }

        // Then yearly summaries
        for (let i = 12; i < schedule.length; i += 12) {
            if (schedule[i]) {
                paymentsToShow.push(schedule[i]);
            }
        }

        // Add rows with animation
        paymentsToShow.forEach((payment, index) => {
            const $row = $(`
                <tr class="amortization-row" style="opacity: 0;">
                    <td class="text-center">${payment.paymentNumber}</td>
                    <td>${payment.date}</td>
                    <td class="text-right">${this.formatCurrencyDetailed(payment.payment)}</td>
                    <td class="text-right">${this.formatCurrencyDetailed(payment.principal)}</td>
                    <td class="text-right">${this.formatCurrencyDetailed(payment.interest)}</td>
                    <td class="text-right">${this.formatCurrencyDetailed(payment.balance)}</td>
                </tr>
            `);

            $tbody.append($row);

            // Animate row appearance
            setTimeout(() => {
                $row.animate({ opacity: 1 }, 200);
            }, index * 50);
        });

        // Show the amortization section
        $('.amortization-section').show().addClass('slide-up');
    }
}

// jQuery document ready
$(document).ready(function() {
    // Initialize mortgage calculator if on the page
    if ($('#mortgage-calculator').length) {
        new MortgageCalculator();
    }

    // Add some enhanced styling
    $('<style>')
        .text(`
            .updated {
                background-color: #e3f2fd !important;
                transition: background-color 0.3s ease;
            }
            
            .form-group.focused {
                transform: scale(1.02);
                transition: transform 0.2s ease;
            }
            
            .insight-item {
                padding: 0.5rem 0;
                border-bottom: 1px solid var(--border-light);
                color: var(--text-secondary);
            }
            
            .insight-item:last-child {
                border-bottom: none;
            }
            
            .down-payment-percentage {
                display: block;
                margin-top: 0.25rem;
                font-size: 0.8rem;
            }
            
            .loan-term-info {
                display: block;
                margin-top: 0.25rem;
                font-size: 0.8rem;
            }
            
            .amortization-row:hover {
                background-color: var(--background-lighter);
            }
            
            .calculating {
                opacity: 0.8;
                pointer-events: none;
            }
        `)
        .appendTo('head');
});

// Export for potential use elsewhere
window.MortgageCalculator = MortgageCalculator;