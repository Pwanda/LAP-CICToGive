package com.lap.config;

import com.backblaze.b2.client.B2StorageClient;
import com.backblaze.b2.client.B2StorageClientFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class B2StorageConfig {

    @Value("${b2.application.key.id}")
    private String applicationKeyId;

    @Value("${b2.application.key}")
    private String applicationKey;

    @Value("${b2.bucket.name}")
    private String bucketName;

    private static final String USER_AGENT = "LAP-Backend/1.0";

    @Bean
    public B2StorageClient b2StorageClient() {
        return B2StorageClientFactory.createDefaultFactory().create(
            applicationKeyId,
            applicationKey,
            USER_AGENT
        );
    }

    @Bean("bucketName")
    public String bucketName() {
        return bucketName;
    }

    // Getters for other components that might need these values
    public String getApplicationKeyId() {
        return applicationKeyId;
    }

    public String getApplicationKey() {
        return applicationKey;
    }

    public String getBucketName() {
        return bucketName;
    }
}
