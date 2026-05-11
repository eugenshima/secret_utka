package secretutka.pet.core.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Частичное обновление пользователя; null — поле не менять")
public record UserPatchRequest(
		@Schema(description = "Новый email")
		String email,
		@Schema(description = "Новое отображаемое имя")
		String displayName,
		@Schema(description = "Новый status_id")
		Long statusId
) {
}
