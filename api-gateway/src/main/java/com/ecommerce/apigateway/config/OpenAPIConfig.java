package com.ecommerce.apigateway.config;

import org.springdoc.core.GroupedOpenApi;
import org.springdoc.core.SwaggerUiConfigParameters;
import org.springframework.cloud.gateway.route.RouteDefinitionLocator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class OpenAPIConfig {

    @Bean
    @Lazy(false)
    public List<GroupedOpenApi> apis(SwaggerUiConfigParameters swaggerUiConfigParameters, RouteDefinitionLocator locator) {
        List<GroupedOpenApi> groups = new ArrayList<>();
        List<String> definitions = List.of("product-service", "order-service", "inventory-service", "user-service");
        
        for (String name : definitions) {
            swaggerUiConfigParameters.addGroup(name);
            groups.add(GroupedOpenApi.builder()
                    .pathsToMatch("/api/v1/" + name.replace("-service", "") + "/**")
                    .group(name)
                    .build());
        }
        return groups;
    }
}
