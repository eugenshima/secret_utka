package secretutka.pet.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiSecurityConfig {

	@Bean
	public OpenAPI apiWithJwt() {
		final String bearer = "bearerJwt";
		return new OpenAPI()
				.addSecurityItem(new SecurityRequirement().addList(bearer))
				.components(new Components().addSecuritySchemes(
						bearer,
						new SecurityScheme()
								.type(SecurityScheme.Type.HTTP)
								.scheme("bearer")
								.bearerFormat("JWT")));
	}
}
