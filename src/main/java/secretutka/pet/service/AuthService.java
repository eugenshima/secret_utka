package secretutka.pet.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import secretutka.pet.core.dto.auth.LoginRequest;
import secretutka.pet.core.dto.auth.LoginResponse;
import secretutka.pet.security.JwtService;
import secretutka.pet.storage.UserStorage;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

	private final UserStorage userStorage;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;

	public LoginResponse login(LoginRequest request) {
		String usernameOrEmpty = request.username() != null ? request.username().trim() : "";
		if (usernameOrEmpty.isEmpty() || request.password() == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Укажите логин и пароль");
		}

		var user = userStorage
				.findByUsername(usernameOrEmpty)
				.orElseThrow(
						() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Неверный логин или пароль"));

		if (!passwordEncoder.matches(request.password(), user.getPassword())) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Неверный логин или пароль");
		}

		String token = jwtService.createAccessToken(user);
		return LoginResponse.builder()
				.accessToken(token)
				.tokenType("Bearer")
				.role(user.getRole())
				.userId(user.getId())
				.username(user.getUsername())
				.build();
	}
}
