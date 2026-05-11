package secretutka.pet.core.dto;

import lombok.Builder;
import secretutka.pet.core.dto.status.UserStatus;

import java.time.LocalDateTime;

@Builder
public record UserResponse(
		Long id,
		String username,
		String email,
		String displayName,
		UserStatus status,
		LocalDateTime createdAt) {

}
