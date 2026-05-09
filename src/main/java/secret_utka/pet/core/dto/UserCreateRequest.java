package secret_utka.pet.core.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Данные для регистрации пользователя")
public record UserCreateRequest(
		@Schema(description = "Логин", example = "utka42")
		String username,
		@Schema(description = "Пароль (до хэширования на стороне сервиса)", example = "change-me")
		String password,
		@Schema(description = "Email", example = "utka@example.com")
		String email,
		@Schema(description = "Отображаемое имя", example = "Утка")
		String displayName,
		@Schema(description = "Идентификатор статуса из status.user_status", example = "1")
		Long statusId
) {
}
