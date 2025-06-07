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
                .title("Mortgage Calculator - " + appName)
                .description("Calculate your monthly mortgage payments, total interest, and amortization schedule with our free mortgage calculator.")
                .keywords("mortgage calculator, home loan calculator, monthly payment calculator, amortization schedule")
                .breadcrumbs(Arrays.asList("Home", "Calculators", "Mortgage Calculator"))
                .customCss(Arrays.asList("/css/pages/calculator.css"))
                .customJs(Arrays.asList("/js/components/charts.js", "/js/calculators/mortgage.js"))
                .hideLeftSidebar() // More space for calculator
                .build();

        setupBasePage(model, config);

        return "calculators/mortgage";
    }

    @GetMapping("/bmi")
    public String bmiCalculator(Model model) {
        PageConfig config = PageConfig.builder()
                .title("BMI Calculator - " + appName)
                .description("Calculate your Body Mass Index (BMI) and understand your weight status with our easy-to-use BMI calculator.")
                .keywords("BMI calculator, body mass index, weight calculator, health calculator")
                .breadcrumbs(Arrays.asList("Home", "Calculators", "BMI Calculator"))
                .customCss(Arrays.asList("/css/pages/calculator.css"))
                .customJs(Arrays.asList("/js/calculators/bmi.js"))
                .hideLeftSidebar()
                .build();

        setupBasePage(model, config);

        return "calculators/bmi";
    }

    @GetMapping("/loan")
    public String loanCalculator(Model model) {
        PageConfig config = PageConfig.builder()
                .title("Loan Calculator - " + appName)
                .description("Calculate loan payments, interest rates, and repayment schedules for personal loans, auto loans, and more.")
                .keywords("loan calculator, personal loan calculator, auto loan calculator, payment calculator")
                .breadcrumbs(Arrays.asList("Home", "Calculators", "Loan Calculator"))
                .customCss(Arrays.asList("/css/pages/calculator.css"))
                .customJs(Arrays.asList("/js/components/charts.js", "/js/calculators/loan.js"))
                .hideLeftSidebar()
                .build();

        setupBasePage(model, config);

        return "calculators/loan";
    }
}