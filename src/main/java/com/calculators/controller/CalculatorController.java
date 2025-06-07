package com.calculators.controller;

import com.calculators.config.PageConfig;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/calculators")
public class CalculatorController extends BaseController {

    @GetMapping("/mortgage")
    public String mortgageCalculator(Model model) {
        // Add structured data for SEO
        Map<String, Object> structuredData = new HashMap<>();
        structuredData.put("@context", "https://schema.org");
        structuredData.put("@type", "WebApplication");
        structuredData.put("name", "Mortgage Calculator");
        structuredData.put("applicationCategory", "FinanceApplication");
        structuredData.put("description", "Calculate mortgage payments with detailed amortization schedules");
        structuredData.put("url", appUrl + "/calculators/mortgage");
        structuredData.put("operatingSystem", "Any");

        Map<String, Object> offer = new HashMap<>();
        offer.put("@type", "Offer");
        offer.put("price", "0");
        offer.put("priceCurrency", "USD");
        structuredData.put("offers", offer);

        // Create custom data map
        Map<String, Object> customData = new HashMap<>();
        customData.put("structuredData", structuredData);

        PageConfig config = PageConfig.builder()
                .title("Mortgage Calculator - Calculate Monthly Payments & Amortization | " + appName)
                .description("Free mortgage calculator to compute monthly payments, total interest, and detailed amortization schedules. Compare different loan scenarios instantly.")
                .keywords("mortgage calculator, home loan calculator, monthly payment calculator, amortization schedule, mortgage payment, home buying calculator")
                .canonicalUrl(appUrl + "/calculators/mortgage")
                .breadcrumbs(Arrays.asList("Home", "Calculators", "Mortgage Calculator"))
                .customCss(Arrays.asList("/css/pages/calculator.css"))
                .customJs(Arrays.asList("/js/common/base-calculator.js", "/js/calculators/mortgage.js"))
                .customData(customData)
                .hideLeftSidebar() // More space for calculator
                .build();

        setupBasePage(model, config);

        // Add default calculator values for SEO/pre-rendering
        Map<String, Object> defaultValues = new HashMap<>();
        defaultValues.put("loanAmount", 300000);
        defaultValues.put("interestRate", 6.5);
        defaultValues.put("loanTerm", 30);
        defaultValues.put("downPayment", 60000);
        defaultValues.put("propertyTax", 3600);
        defaultValues.put("homeInsurance", 1200);
        defaultValues.put("pmi", true);

        model.addAttribute("defaultValues", defaultValues);

        return "calculators/mortgage";
    }

    @GetMapping("/bmi")
    public String bmiCalculator(Model model) {
        // BMI structured data
        Map<String, Object> structuredData = new HashMap<>();
        structuredData.put("@context", "https://schema.org");
        structuredData.put("@type", "WebApplication");
        structuredData.put("name", "BMI Calculator");
        structuredData.put("applicationCategory", "HealthApplication");
        structuredData.put("description", "Calculate your Body Mass Index and get health recommendations");
        structuredData.put("url", appUrl + "/calculators/bmi");

        Map<String, Object> offer = new HashMap<>();
        offer.put("@type", "Offer");
        offer.put("price", "0");
        offer.put("priceCurrency", "USD");
        structuredData.put("offers", offer);

        // Create custom data map
        Map<String, Object> customData = new HashMap<>();
        customData.put("structuredData", structuredData);

        PageConfig config = PageConfig.builder()
                .title("BMI Calculator - Body Mass Index Calculator | " + appName)
                .description("Free BMI calculator to determine your Body Mass Index and understand your weight status with health recommendations.")
                .keywords("BMI calculator, body mass index, weight calculator, health calculator, BMI chart")
                .canonicalUrl(appUrl + "/calculators/bmi")
                .breadcrumbs(Arrays.asList("Home", "Calculators", "BMI Calculator"))
                .customCss(Arrays.asList("/css/pages/calculator.css"))
                .customJs(Arrays.asList("/js/common/base-calculator.js", "/js/calculators/bmi.js"))
                .customData(customData)
                .hideLeftSidebar()
                .build();

        setupBasePage(model, config);

        // Default BMI values
        Map<String, Object> defaultValues = new HashMap<>();
        defaultValues.put("weight", 150);
        defaultValues.put("height", 68);
        defaultValues.put("units", "imperial");

        model.addAttribute("defaultValues", defaultValues);

        return "calculators/bmi";
    }

    @GetMapping("/loan")
    public String loanCalculator(Model model) {
        // Loan structured data
        Map<String, Object> structuredData = new HashMap<>();
        structuredData.put("@context", "https://schema.org");
        structuredData.put("@type", "WebApplication");
        structuredData.put("name", "Loan Calculator");
        structuredData.put("applicationCategory", "FinanceApplication");
        structuredData.put("description", "Calculate loan payments and compare different loan scenarios");
        structuredData.put("url", appUrl + "/calculators/loan");

        Map<String, Object> offer = new HashMap<>();
        offer.put("@type", "Offer");
        offer.put("price", "0");
        offer.put("priceCurrency", "USD");
        structuredData.put("offers", offer);

        // Create custom data map
        Map<String, Object> customData = new HashMap<>();
        customData.put("structuredData", structuredData);

        PageConfig config = PageConfig.builder()
                .title("Loan Calculator - Personal & Auto Loan Payment Calculator | " + appName)
                .description("Calculate loan payments for personal loans, auto loans, and more. Compare different loan terms and interest rates.")
                .keywords("loan calculator, personal loan calculator, auto loan calculator, payment calculator, loan comparison")
                .canonicalUrl(appUrl + "/calculators/loan")
                .breadcrumbs(Arrays.asList("Home", "Calculators", "Loan Calculator"))
                .customCss(Arrays.asList("/css/pages/calculator.css"))
                .customJs(Arrays.asList("/js/common/base-calculator.js", "/js/calculators/loan.js"))
                .customData(customData)
                .hideLeftSidebar()
                .build();

        setupBasePage(model, config);

        // Default loan values
        Map<String, Object> defaultValues = new HashMap<>();
        defaultValues.put("loanAmount", 25000);
        defaultValues.put("interestRate", 8.5);
        defaultValues.put("loanTerm", 5);
        defaultValues.put("loanType", "personal");

        model.addAttribute("defaultValues", defaultValues);

        return "calculators/loan";
    }

    // Generic calculator route for easy addition of new calculators
    @GetMapping("/{calculatorType}")
    public String genericCalculator(@PathVariable String calculatorType, Model model) {

        // Define calculator metadata
        Map<String, Map<String, Object>> calculatorMeta = getCalculatorMetadata();

        if (!calculatorMeta.containsKey(calculatorType)) {
            // Calculator not found, redirect to tools page
            return "redirect:/tools";
        }

        Map<String, Object> meta = calculatorMeta.get(calculatorType);

        // Add structured data
        Map<String, Object> structuredData = new HashMap<>();
        structuredData.put("@context", "https://schema.org");
        structuredData.put("@type", "WebApplication");
        structuredData.put("name", meta.get("name"));
        structuredData.put("applicationCategory", meta.get("category") + "Application");
        structuredData.put("description", meta.get("description"));
        structuredData.put("url", appUrl + "/calculators/" + calculatorType);

        Map<String, Object> offer = new HashMap<>();
        offer.put("@type", "Offer");
        offer.put("price", "0");
        offer.put("priceCurrency", "USD");
        structuredData.put("offers", offer);

        // Create custom data map
        Map<String, Object> customData = new HashMap<>();
        customData.put("structuredData", structuredData);

        PageConfig config = PageConfig.builder()
                .title(meta.get("title").toString())
                .description(meta.get("description").toString())
                .keywords(meta.get("keywords").toString())
                .canonicalUrl(appUrl + "/calculators/" + calculatorType)
                .breadcrumbs(Arrays.asList("Home", "Calculators", meta.get("name").toString()))
                .customCss(Arrays.asList("/css/pages/calculator.css"))
                .customJs(Arrays.asList("/js/common/base-calculator.js", "/js/calculators/" + calculatorType + ".js"))
                .customData(customData)
                .hideLeftSidebar()
                .build();

        setupBasePage(model, config);

        model.addAttribute("calculatorType", calculatorType);
        model.addAttribute("defaultValues", meta.get("defaultValues"));

        // Try to return specific template, fall back to generic
        try {
            return "calculators/" + calculatorType;
        } catch (Exception e) {
            return "calculators/generic";
        }
    }

    /**
     * Define metadata for all calculators in one place
     * This makes it easy to add new calculators
     */
    private Map<String, Map<String, Object>> getCalculatorMetadata() {
        Map<String, Map<String, Object>> calculators = new HashMap<>();

        // Savings Calculator
        Map<String, Object> savings = new HashMap<>();
        savings.put("name", "Savings Calculator");
        savings.put("title", "Savings Calculator - Compound Interest Growth | " + appName);
        savings.put("description", "Calculate compound interest and track your savings growth over time with our free savings calculator.");
        savings.put("keywords", "savings calculator, compound interest, financial planning, investment growth");
        savings.put("category", "Finance");

        Map<String, Object> savingsDefaults = new HashMap<>();
        savingsDefaults.put("initialAmount", 1000);
        savingsDefaults.put("monthlyContribution", 100);
        savingsDefaults.put("interestRate", 4.0);
        savingsDefaults.put("years", 10);
        savings.put("defaultValues", savingsDefaults);

        calculators.put("savings", savings);

        // Retirement Calculator
        Map<String, Object> retirement = new HashMap<>();
        retirement.put("name", "Retirement Calculator");
        retirement.put("title", "Retirement Calculator - Plan Your Financial Future | " + appName);
        retirement.put("description", "Calculate how much you need to save for retirement and track your progress toward financial independence.");
        retirement.put("keywords", "retirement calculator, 401k calculator, retirement planning, financial independence");
        retirement.put("category", "Finance");

        Map<String, Object> retirementDefaults = new HashMap<>();
        retirementDefaults.put("currentAge", 30);
        retirementDefaults.put("retirementAge", 65);
        retirementDefaults.put("currentSavings", 50000);
        retirementDefaults.put("monthlyContribution", 500);
        retirementDefaults.put("expectedReturn", 7.0);
        retirement.put("defaultValues", retirementDefaults);

        calculators.put("retirement", retirement);

        // Tax Calculator
        Map<String, Object> tax = new HashMap<>();
        tax.put("name", "Tax Calculator");
        tax.put("title", "Tax Calculator - Estimate Your Tax Liability | " + appName);
        tax.put("description", "Calculate your estimated tax liability and plan your tax strategy with our comprehensive tax calculator.");
        tax.put("keywords", "tax calculator, income tax, tax estimation, tax planning, tax liability");
        tax.put("category", "Finance");

        Map<String, Object> taxDefaults = new HashMap<>();
        taxDefaults.put("income", 75000);
        taxDefaults.put("filingStatus", "single");
        taxDefaults.put("deductions", 12550); // Standard deduction 2023
        taxDefaults.put("state", "");
        tax.put("defaultValues", taxDefaults);

        calculators.put("tax", tax);

        return calculators;
    }
}