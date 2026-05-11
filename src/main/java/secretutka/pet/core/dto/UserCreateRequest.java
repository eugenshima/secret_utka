package secretutka.pet.core.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import secretutka.pet.core.enums.UserRole;

@Schema(description = "Данные для регистрации пользователя")
public record UserCreateRequest(
		@Schema(description = "Логин", example = "utka42")
		@JsonProperty("username")
		String username,
		@Schema(description = "Пароль (до хэширования на стороне сервиса)", example = "change-me")
		@JsonProperty("password")
		String password,
		@Schema(description = "Email", example = "utka@example.com")
		@JsonProperty("email")
		String email,
		@Schema(description = "Отображаемое имя", example = "Утка")
		@JsonProperty("display_name")
		String displayName,
		@Schema(description = "Идентификатор статуса из status.user_status", example = "1")
		@JsonProperty("status_id")
		Long statusId,
		@Schema(description = "Роль (только для администратора; по умолчанию USER)", example = "USER")
		@JsonProperty("role")
		UserRole role) {
}
