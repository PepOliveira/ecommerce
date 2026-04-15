package com.pedrooliveira.ecommerce;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("E-commerce API")
                        .version("1.0.0")
                        .description("API REST para sistema de e-commerce com gestão de produtos, clientes e pedidos")
                        .contact(new Contact()
                                .name("Pedro Oliveira")
                                .email("pedro@email.com")));
    }
}