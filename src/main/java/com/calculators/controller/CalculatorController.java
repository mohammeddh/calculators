package com.calculators.controller;

import com.calculators.config.PageConfig;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Arrays;

@Controller
@RequestMapping("/calculators")
public class CalculatorController extends BaseController {

    @GetMapping("/mortgage")
    public String mortgageCalculator(Model model) {
        PageConfig config = PageConfig.builder()
                .title("Mortgage Calculator - Calculate Monthly Payments & Amortization - " + appName)
                .description("Free mortgage calculator with amortization schedule. Calculate monthly payments, total interest, and compare loan scenarios. Includes property taxes, insurance, PMI, and extra payments.")
                .keywords("mortgage calculator, home loan calculator, monthly payment calculator, amortization schedule, mortgage payment, loan calculator, home financing, mortgage rates, property tax calculator, PMI calculator")
                .breadcrumbs(Arrays.asList("Home", "Tools", "Mortgage Calculator"))
                .canonicalUrl(appUrl + "/calculators/mortgage")
                .customCss(Arrays.asList(
                        "/css/calculators/base-calculator.css",
                        "/css/calculators/mortgage.css"
                ))
                .customJs(Arrays.asList(
                        "/js/calculators/base-calculator.js",
                        "/js/calculators/mortgage.js"
                ))
                .hideLeftSidebar() // More space for calculator
                .build();

        setupBasePage(model, config);
        return "calculators/mortgage";
    }

    @GetMapping("/bmi")
    public String bmiCalculator(Model model) {
        PageConfig config = PageConfig.builder()
                .title("BMI Calculator - Body Mass Index Calculator - " + appName)
                .description("Calculate your Body Mass Index (BMI) and understand your weight status with our easy-to-use BMI calculator. Supports both metric and imperial units.")
                .keywords("BMI calculator, body mass index, weight calculator, health calculator, obesity calculator, underweight calculator, normal weight")
                .breadcrumbs(Arrays.asList("Home", "Tools", "BMI Calculator"))
                .canonicalUrl(appUrl + "/calculators/bmi")
                .customCss(Arrays.asList(
                        "/css/calculators/base-calculator.css",
                        "/css/calculators/bmi.css"
                ))
                .customJs(Arrays.asList(
                        "/js/calculators/base-calculator.js",
                        "/js/calculators/bmi.js"
                ))
                .hideLeftSidebar()
                .build();

        setupBasePage(model, config);
        return "calculators/bmi";
    }

    @GetMapping("/loan")
    public String loanCalculator(Model model) {
        PageConfig config = PageConfig.builder()
                .title("Loan Calculator - Personal & Auto Loan Payment Calculator - " + appName)
                .description("Calculate loan payments, interest rates, and repayment schedules for personal loans, auto loans, and more. Compare different loan terms and rates.")
                .keywords("loan calculator, personal loan calculator, auto loan calculator, payment calculator, loan payment, interest calculator, car loan calculator")
                .breadcrumbs(Arrays.asList("Home", "Tools", "Loan Calculator"))
                .canonicalUrl(appUrl + "/calculators/loan")
                .customCss(Arrays.asList(
                        "/css/calculators/base-calculator.css"
                ))
                .customJs(Arrays.asList(
                        "/js/calculators/base-calculator.js",
                        "/js/calculators/loan.js"
                ))
                .hideLeftSidebar()
                .build();

        setupBasePage(model, config);
        return "calculators/loan";
    }

    @GetMapping("/investment")
    public String investmentCalculator(Model model) {
        PageConfig config = PageConfig.builder()
                .title("Investment Calculator - Compound Interest & Returns - " + appName)
                .description("Calculate investment returns, compound interest, and future value of your investments. Plan your financial goals with our investment calculator.")
                .keywords("investment calculator, compound interest calculator, retirement calculator, savings calculator, investment returns, financial planning")
                .breadcrumbs(Arrays.asList("Home", "Tools", "Investment Calculator"))
                .canonicalUrl(appUrl + "/calculators/investment")
                .customCss(Arrays.asList(
                        "/css/calculators/base-calculator.css"
                ))
                .customJs(Arrays.asList(
                        "/js/calculators/base-calculator.js",
                        "/js/calculators/investment.js"
                ))
                .hideLeftSidebar()
                .build();

        setupBasePage(model, config);
        return "calculators/investment";
    }

    @GetMapping("/tax")
    public String taxCalculator(Model model) {
        PageConfig config = PageConfig.builder()
                .title("Tax Calculator - Income Tax Estimator - " + appName)
                .description("Estimate your federal and state income taxes, calculate tax refunds, and plan your tax strategy with our comprehensive tax calculator.")
                .keywords("tax calculator, income tax calculator, tax estimator, tax refund calculator, federal tax, state tax, tax planning")
                .breadcrumbs(Arrays.asList("Home", "Tools", "Tax Calculator"))
                .canonicalUrl(appUrl + "/calculators/tax")
                .customCss(Arrays.asList(
                        "/css/calculators/base-calculator.css"
                ))
                .customJs(Arrays.asList(
                        "/js/calculators/base-calculator.js",
                        "/js/calculators/tax.js"
                ))
                .hideLeftSidebar()
                .build();

        setupBasePage(model, config);
        return "calculators/tax";
    }

    @GetMapping("/retirement")
    public String retirementCalculator(Model model) {
        PageConfig config = PageConfig.builder()
                .title("Retirement Calculator - Plan Your Retirement Savings - " + appName)
                .description("Calculate how much you need to save for retirement, estimate retirement income, and plan your retirement strategy.")
                .keywords("retirement calculator, retirement planning, 401k calculator, retirement savings, pension calculator, retirement income")
                .breadcrumbs(Arrays.asList("Home", "Tools", "Retirement Calculator"))
                .canonicalUrl(appUrl + "/calculators/retirement")
                .customCss(Arrays.asList(
                        "/css/calculators/base-calculator.css"
                ))
                .customJs(Arrays.asList(
                        "/js/calculators/base-calculator.js",
                        "/js/calculators/retirement.js"
                ))
                .hideLeftSidebar()
                .build();

        setupBasePage(model, config);
        return "calculators/retirement";
    }

    @GetMapping("/percentage")
    public String percentageCalculator(Model model) {
        PageConfig config = PageConfig.builder()
                .title("Percentage Calculator - Calculate Percentages & Changes - " + appName)
                .description("Calculate percentages, percentage increases, decreases, and percentage of a number with our easy-to-use percentage calculator.")
                .keywords("percentage calculator, percent calculator, percentage increase, percentage decrease, percent change calculator")
                .breadcrumbs(Arrays.asList("Home", "Tools", "Percentage Calculator"))
                .canonicalUrl(appUrl + "/calculators/percentage")
                .customCss(Arrays.asList(
                        "/css/calculators/base-calculator.css"
                ))
                .customJs(Arrays.asList(
                        "/js/calculators/base-calculator.js",
                        "/js/calculators/percentage.js"
                ))
                .hideLeftSidebar()
                .build();

        setupBasePage(model, config);
        return "calculators/percentage";
    }

    @GetMapping("/compound-interest")
    public String compoundInterestCalculator(Model model) {
        PageConfig config = PageConfig.builder()
                .title("Compound Interest Calculator - Investment Growth Calculator - " + appName)
                .description("Calculate compound interest and see how your investments grow over time. Includes regular contributions and different compounding frequencies.")
                .keywords("compound interest calculator, investment growth, savings calculator, compound growth, investment returns")
                .breadcrumbs(Arrays.asList("Home", "Tools", "Compound Interest Calculator"))
                .canonicalUrl(appUrl + "/calculators/compound-interest")
                .customCss(Arrays.asList(
                        "/css/calculators/base-calculator.css"
                ))
                .customJs(Arrays.asList(
                        "/js/calculators/base-calculator.js",
                        "/js/calculators/compound-interest.js"
                ))
                .hideLeftSidebar()
                .build();

        setupBasePage(model, config);
        return "calculators/compound-interest";
    }

    @GetMapping("/calorie")
    public String calorieCalculator(Model model) {
        PageConfig config = PageConfig.builder()
                .title("Calorie Calculator - Daily Calorie Needs & Weight Goals - " + appName)
                .description("Calculate your daily calorie needs based on age, gender, activity level, and weight goals. Plan your diet and fitness routine.")
                .keywords("calorie calculator, daily calorie needs, weight loss calculator, BMR calculator, TDEE calculator, diet calculator")
                .breadcrumbs(Arrays.asList("Home", "Tools", "Calorie Calculator"))
                .canonicalUrl(appUrl + "/calculators/calorie")
                .customCss(Arrays.asList(
                        "/css/calculators/base-calculator.css"
                ))
                .customJs(Arrays.asList(
                        "/js/calculators/base-calculator.js",
                        "/js/calculators/calorie.js"
                ))
                .hideLeftSidebar()
                .build();

        setupBasePage(model, config);
        return "calculators/calorie";
    }

    @GetMapping("/body-fat")
    public String bodyFatCalculator(Model model) {
        PageConfig config = PageConfig.builder()
                .title("Body Fat Calculator - Estimate Body Fat Percentage - " + appName)
                .description("Calculate your body fat percentage using various measurement methods. Track your fitness progress and body composition.")
                .keywords("body fat calculator, body fat percentage, body composition, fitness calculator, health calculator")
                .breadcrumbs(Arrays.asList("Home", "Tools", "Body Fat Calculator"))
                .canonicalUrl(appUrl + "/calculators/body-fat")
                .customCss(Arrays.asList(
                        "/css/calculators/base-calculator.css"
                ))
                .customJs(Arrays.asList(
                        "/js/calculators/base-calculator.js",
                        "/js/calculators/body-fat.js"
                ))
                .hideLeftSidebar()
                .build();

        setupBasePage(model, config);
        return "calculators/body-fat";
    }

    @GetMapping("/unit-converter")
    public String unitConverter(Model model) {
        PageConfig config = PageConfig.builder()
                .title("Unit Converter - Convert Between Units of Measurement - " + appName)
                .description("Convert between different units of length, weight, temperature, volume, and more. Comprehensive unit conversion tool.")
                .keywords("unit converter, measurement converter, length converter, weight converter, temperature converter, metric converter")
                .breadcrumbs(Arrays.asList("Home", "Tools", "Unit Converter"))
                .canonicalUrl(appUrl + "/calculators/unit-converter")
                .customCss(Arrays.asList(
                        "/css/calculators/base-calculator.css"
                ))
                .customJs(Arrays.asList(
                        "/js/calculators/base-calculator.js",
                        "/js/calculators/unit-converter.js"
                ))
                .hideLeftSidebar()
                .build();

        setupBasePage(model, config);
        return "calculators/unit-converter";
    }
}