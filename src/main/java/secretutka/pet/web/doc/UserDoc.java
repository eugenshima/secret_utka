package secretutka.pet.web.doc;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import secretutka.pet.core.dto.UserCreateRequest;
import secretutka.pet.core.dto.UserResponse;

@Tag(name = "Пользователь", description = "Регистрация и управление профилем")
public interface UserDoc {

    @Operation(summary = "Пользователь по id")
    @ApiResponse(responseCode = "200", description = "Найден")
    @ApiResponse(responseCode = "404", description = "Не найден")
    ResponseEntity<UserResponse> getById(@Parameter(description = "Идентификатор пользователя") Long id);

    @Operation(summary = "Список пользователей (постранично)")
    @ApiResponse(responseCode = "200", description = "Страница данных")
    Page<UserResponse> getUsers();

    @Operation(summary = "Создать пользователя")
    @ApiResponse(responseCode = "200", description = "Создан")
    @ApiResponse(responseCode = "400", description = "Неверные данные (например, status_id)")
    ResponseEntity<Void> create(UserCreateRequest body);

    @Operation(summary = "Удалить пользователя")
    @ApiResponse(responseCode = "204", description = "Удалён")
    @ApiResponse(responseCode = "404", description = "Не найден")
    ResponseEntity<Void> delete(@Parameter(description = "Идентификатор пользователя") Long id);
}
