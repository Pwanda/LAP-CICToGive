package com.lap.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "file.storage")
public class FileStorageConfig {

    private String path = "./uploads";
    private long maxFileSize = 10 * 1024 * 1024; // 10MB
    private long maxImageSize = 5 * 1024 * 1024; // 5MB

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public long getMaxFileSize() {
        return maxFileSize;
    }

    public void setMaxFileSize(long maxFileSize) {
        this.maxFileSize = maxFileSize;
    }

    public long getMaxImageSize() {
        return maxImageSize;
    }

    public void setMaxImageSize(long maxImageSize) {
        this.maxImageSize = maxImageSize;
    }
}
