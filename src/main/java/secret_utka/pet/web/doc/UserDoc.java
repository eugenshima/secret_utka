package secret_utka.pet.web.doc;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springdoc.core.annotations.ParameterObject;
import secret_utka.pet.core.dto.UserCreateRequest;
import secret_utka.pet.core.dto.UserPatchRequest;
import secret_utka.pet.core.dto.UserResponse;

@Tag(name = "Пользователь", description = "Регистрация и управление профилем")
@RequestMapping("/api/user")
public interface UserDoc {

	@Operation(summary = "Пользователь по id")
	@ApiResponse(responseCode = "200", description = "Найден")
	@ApiResponse(responseCode = "404", description = "Не найден", content = @Content)
	@GetMapping("/{id}")
	ResponseEntity<UserResponse> getById(@Parameter(description = "Идентификатор пользователя") @PathVariable Long id);

	@Operation(summary = "Список пользователей (постранично)")
	@ApiResponse(responseCode = "200", description = "Страница данных")
	@GetMapping
	Page<UserResponse> getUsers(@ParameterObject @PageableDefault(size = 20, sort = "id") Pageable pageable);

	@Operation(summary = "Создать пользователя")
	@ApiResponse(responseCode = "200", description = "Создан")
	@ApiResponse(responseCode = "400", description = "Неверные данные (например, status_id)", content = @Content)
	@PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
	ResponseEntity<Void> create(@RequestBody UserCreateRequest body);

	@Operation(summary = "Частичное обновление пользователя")
	@ApiResponse(responseCode = "200", description = "Обновлён")
	@ApiResponse(responseCode = "404", description = "Не найден", content = @Content)
	@ApiResponse(responseCode = "400", description = "Неверные данные", content = @Content)
	@PatchMapping(path = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
	ResponseEntity<Void> update(
			@Parameter(description = "Идентификатор пользователя") @PathVariable Long id,
			@RequestBody UserPatchRequest body);

	@Operation(summary = "Удалить пользователя")
	@ApiResponse(responseCode = "204", description = "Удалён")
	@ApiResponse(responseCode = "404", description = "Не найден", content = @Content)
	@DeleteMapping("/{id}")
	ResponseEntity<Void> delete(@Parameter(description = "Идентификатор пользователя") @PathVariable Long id);
}
