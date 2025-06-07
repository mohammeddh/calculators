package com.calculators.controller;

import com.calculators.config.PageConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.ui.Model;

import java.util.Map;

public abstract class BaseController {

    @Value("${app.name}")
    protected String appName;

    @Value("${app.title}")
    protected String appTitle;

    @Value("${app.description}")
    protected String appDescription;

    @Value("${app.url}")
    protected String appUrl;

    @Value("${app.author}")
    protected String appAuthor;

    @Value("${seo.keywords}")
    protected String defaultKeywords;

    @Value("${seo.og-image}")
    protected String defaultOgImage;

    /**
     * Set up common model attributes for all pages
     */
    protected void setupBasePage(Model model, PageConfig config) {
        setupBasePage(model, config, null);
    }

    /**
     * Set up common model attributes for all pages with active page indicator
     */
    protected void setupBasePage(Model model, PageConfig config, String activePage) {
        // App configuration
        model.addAttribute("appName", appName);
        model.addAttribute("appTitle", appTitle);
        model.addAttribute("appDescription", appDescription);
        model.addAttribute("appUrl", appUrl);
        model.addAttribute("appAuthor", appAuthor);

        // Page configuration with defaults
        model.addAttribute("pageTitle", config.getTitle() != null ? config.getTitle() : appTitle);
        model.addAttribute("pageDescription", config.getDescription() != null ? config.getDescription() : appDescription);
        model.addAttribute("pageKeywords", config.getKeywords() != null ? config.getKeywords() : defaultKeywords);
        model.addAttribute("canonicalUrl", config.getCanonicalUrl() != null ? config.getCanonicalUrl() : appUrl);
        model.addAttribute("ogImage", config.getOgImage() != null ? config.getOgImage() : defaultOgImage);

        // Layout configuration
        model.addAttribute("showLeftSidebar", config.isShowLeftSidebar());
        model.addAttribute("showRightSidebar", config.isShowRightSidebar());

        // Active page for navigation
        model.addAttribute("activePage", activePage);

        // Custom resources
        model.addAttribute("customCss", config.getCustomCss());
        model.addAttribute("customJs", config.getCustomJs());

        // Breadcrumbs
        model.addAttribute("breadcrumbs", config.getBreadcrumbs());

        // Custom data
        if (config.getCustomData() != null) {
            for (Map.Entry<String, Object> entry : config.getCustomData().entrySet()) {
                model.addAttribute(entry.getKey(), entry.getValue());
            }
        }

        // Page-specific configuration
        model.addAttribute("pageConfig", config);
    }

    /**
     * Create default page configuration
     */
    protected PageConfig createDefaultConfig(String title, String description) {
        return PageConfig.builder()
                .title(title)
                .description(description)
                .build();
    }
}