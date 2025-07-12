package com.cashback.gold.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "metal.api")
@Data
public class MetalApiProperties {
    private String key;
    private String url;
}

