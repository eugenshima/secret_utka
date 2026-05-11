package secretutka.pet.core.dto.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import secretutka.pet.core.enums.UserRole;

@Builder
public record LoginResponse(
		@JsonProperty("access_token") String accessToken,
		@JsonProperty("token_type") String tokenType,
		UserRole role,
		@JsonProperty("user_id") Long userId,
		String username) {}
