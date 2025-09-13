/**
 * Configuration class for setting up the RestTemplate bean.
 * This class is responsible for creating a RestTemplate instance
 * with custom configurations such as timeouts and HTTP client.
 */
package com.safepay.config;

import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

/**
 * Configuration class for RestTemplate.
 * This class provides a RestTemplate bean that can be used for making HTTP requests.
 * It is annotated with @Configuration to indicate that it provides Spring configuration.
 */
@Configuration
public class RestTemplateConfig {

    /**
     * Creates a RestTemplate bean with custom request factory.
     * 
     * @return RestTemplate instance configured with HttpComponentsClientHttpRequestFactory.
     */
    @Bean
    public RestTemplate restTemplate() {
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
        factory.setHttpClient(HttpClients.createDefault());
        factory.setConnectTimeout(5000); // Set connection timeout to 5000 milliseconds
        factory.setConnectionRequestTimeout(10000); // Set connection request timeout to 10000 milliseconds
        return new RestTemplate(factory); // Return the configured RestTemplate instance
    }
}