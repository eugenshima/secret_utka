package secretutka.pet.web;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import secretutka.pet.core.dto.auth.LoginRequest;
import secretutka.pet.core.dto.auth.LoginResponse;
import secretutka.pet.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Авторизация", description = "Получение JWT")
public class AuthController {

	private final AuthService authService;

	@Operation(summary = "Вход и выдача токена")
	@SecurityRequirements
	@PostMapping("/login")
	public LoginResponse login(@RequestBody LoginRequest body) {
		return authService.login(body);
	}
}
