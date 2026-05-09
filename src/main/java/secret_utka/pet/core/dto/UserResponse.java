package secret_utka.pet.core.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "Пользователь (без пароля)")
public record UserResponse(
		@Schema(description = "Идентификатор") Long id,
		@Schema(description = "Логин") String username,
		@Schema(description = "Email") String email,
		@Schema(description = "Отображаемое имя") String displayName,
		@Schema(description = "Код статуса (status.user_status.code)") String statusCode,
		@Schema(description = "Создан") LocalDateTime createdAt
) {
}
