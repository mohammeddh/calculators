package com.calculators.controller;

import com.calculators.config.PageConfig;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Controller
public class HomeController extends BaseController {

    @GetMapping("/")
    public String home(Model model) {
        // Create page configuration
        PageConfig config = PageConfig.builder()
                .title("Beautiful Calculator Tools - " + appName)
                .description("Clean, lightweight calculators for finance, health, math, and everyday use. Simple, fast, and beautifully designed.")
                .keywords("calculator, online calculator, mortgage calculator, loan calculator, BMI calculator, finance calculator, math calculator")
                .canonicalUrl(appUrl + "/")
                .breadcrumbs(Arrays.asList("Home"))
                .customCss(Arrays.asList("/css/pages/home.css"))
                .customJs(Arrays.asList("/js/pages/home.js"))
                .build();

        // Add custom data for home page
        Map<String, Object> customData = new HashMap<>();
        customData.put("featuredCalculators", getFeaturedCalculators());
        config.setCustomData(customData);

        setupBasePage(model, config, "home");

        return "pages/home";
    }

    @GetMapping("/about")
    public String about(Model model) {
        PageConfig config = PageConfig.builder()
                .title("About Us - " + appName)
                .description("Learn about our mission to provide beautiful, accessible calculator tools for everyone.")
                .breadcrumbs(Arrays.asList("Home", "About"))
                .customCss(Arrays.asList("/css/pages/about.css"))
                .build();

        setupBasePage(model, config, "about");

        return "pages/about";
    }

    @GetMapping("/contact")
    public String contact(Model model) {
        PageConfig config = PageConfig.builder()
                .title("Contact Us - " + appName)
                .description("Get in touch with our team. We'd love to hear from you!")
                .breadcrumbs(Arrays.asList("Home", "Contact"))
                .hideRightSidebar()
                .build();

        setupBasePage(model, config, "contact");

        return "pages/contact";
    }

    @GetMapping("/tools")
    public String tools(Model model) {
        PageConfig config = PageConfig.builder()
                .title("Calculator Tools - " + appName)
                .description("Browse our complete collection of calculator tools for finance, health, math, and more.")
                .breadcrumbs(Arrays.asList("Home", "Tools"))
                .customJs(Arrays.asList("/js/components/charts.js"))
                .build();

        setupBasePage(model, config, "tools");

        return "pages/tools";
    }

    private Object getFeaturedCalculators() {
        // This would typically come from a service or database
        return Arrays.asList(
                Map.of("name", "Mortgage Calculator", "url", "/calculators/mortgage", "icon", "🏠"),
                Map.of("name", "BMI Calculator", "url", "/calculators/bmi", "icon", "⚖️"),
                Map.of("name", "Loan Calculator", "url", "/calculators/loan", "icon", "💰")
        );
    }
}