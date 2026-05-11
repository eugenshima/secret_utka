package secretutka.pet.web.doc;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import secretutka.pet.core.dto.UserCreateRequest;
import secretutka.pet.core.dto.UserResponse;
import secretutka.pet.core.dto.status.UserStatus;

@Tag(name = "Пользователь", description = "Регистрация и управление профилем")
public interface UserDoc {

	@Operation(summary = "Справочник статусов пользователя (user_status)")
	@ApiResponse(responseCode = "200", description = "Список статусов")
	ResponseEntity<List<UserStatus>> statuses();

	@Operation(summary = "Пользователь по id")
	@ApiResponse(responseCode = "200", description = "Найден")
	@ApiResponse(responseCode = "404", description = "Не найден")
	ResponseEntity<UserResponse> getById(@Parameter(description = "Идентификатор пользователя") Long id);

	@Operation(summary = "Список пользователей (постранично)")
	@ApiResponse(responseCode = "200", description = "Страница данных")
	Page<UserResponse> getUsers(Pageable pageable);

	@Operation(summary = "Создать пользователя")
	@ApiResponse(responseCode = "200", description = "Создан")
	@ApiResponse(responseCode = "400", description = "Неверные данные (например, status_id)")
	ResponseEntity<Void> create(UserCreateRequest body);

	@Operation(summary = "Изменить статус пользователя")
	@ApiResponse(responseCode = "200", description = "Обновлён")
	@ApiResponse(responseCode = "404", description = "Не найден пользователь или статус")
	ResponseEntity<Void> updateStatus(
			@Parameter(description = "ID пользователя") Long userId,
			@Parameter(description = "ID нового статуса (user_status.id)") Long statusId);

	@Operation(summary = "Удалить пользователя")
	@ApiResponse(responseCode = "204", description = "Удалён")
	@ApiResponse(responseCode = "404", description = "Не найден")
	ResponseEntity<Void> delete(@Parameter(description = "Идентификатор пользователя") Long id);
}
