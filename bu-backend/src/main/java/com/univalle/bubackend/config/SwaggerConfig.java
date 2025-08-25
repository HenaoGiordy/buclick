package com.univalle.bubackend.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.http.HttpHeaders;

@OpenAPIDefinition(
        info = @Info(
                title = "Bienestar Universitario API",
                description = "Este es el API para la gestión de Bienestar Universitario de Univalle Palmira (Citas, Becas Alimenticias)",
                version = "1.0.0",
                contact = @Contact(
                        name = "Bienestar Universitario",
                        email = "bienestaruniversitario29@gmail.com"
                )
        )
)
@SecurityScheme(
        name = "Security Token",
        description = "Acces token for my api",
        type = SecuritySchemeType.HTTP,
        paramName = HttpHeaders.AUTHORIZATION,
        in = SecuritySchemeIn.HEADER,
        scheme = "bearer",
        bearerFormat = "JWT"
)
public class SwaggerConfig {
}
