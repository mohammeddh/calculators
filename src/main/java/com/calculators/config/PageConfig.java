package com.calculators.config;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class PageConfig {
    private String title;
    private String description;
    private String keywords;
    private String canonicalUrl;
    private String ogImage;
    private List<String> breadcrumbs;
    private List<String> customCss;
    private List<String> customJs;
    private Map<String, Object> customData;
    private boolean showLeftSidebar = true;
    private boolean showRightSidebar = true;

    // Constructors
    public PageConfig() {}

    public PageConfig(String title, String description) {
        this.title = title;
        this.description = description;
    }

    // Builder pattern for easy configuration
    public static PageConfigBuilder builder() {
        return new PageConfigBuilder();
    }

    public static class PageConfigBuilder {
        private PageConfig config = new PageConfig();

        public PageConfigBuilder title(String title) {
            config.title = title;
            return this;
        }

        public PageConfigBuilder description(String description) {
            config.description = description;
            return this;
        }

        public PageConfigBuilder keywords(String keywords) {
            config.keywords = keywords;
            return this;
        }

        public PageConfigBuilder canonicalUrl(String canonicalUrl) {
            config.canonicalUrl = canonicalUrl;
            return this;
        }

        public PageConfigBuilder ogImage(String ogImage) {
            config.ogImage = ogImage;
            return this;
        }

        public PageConfigBuilder breadcrumbs(List<String> breadcrumbs) {
            config.breadcrumbs = breadcrumbs;
            return this;
        }

        public PageConfigBuilder customCss(List<String> customCss) {
            config.customCss = customCss;
            return this;
        }

        public PageConfigBuilder customJs(List<String> customJs) {
            config.customJs = customJs;
            return this;
        }

        public PageConfigBuilder customData(Map<String, Object> customData) {
            config.customData = customData;
            return this;
        }

        public PageConfigBuilder hideSidebars() {
            config.showLeftSidebar = false;
            config.showRightSidebar = false;
            return this;
        }

        public PageConfigBuilder hideLeftSidebar() {
            config.showLeftSidebar = false;
            return this;
        }

        public PageConfigBuilder hideRightSidebar() {
            config.showRightSidebar = false;
            return this;
        }

        public PageConfig build() {
            return config;
        }
    }
}