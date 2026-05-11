package secretutka.pet.config;

import java.util.Locale;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import secretutka.pet.core.enums.UserRole;
import secretutka.pet.storage.UserStorage;
import secretutka.pet.storage.entity.core.UserEntity;
import secretutka.pet.storage.entity.status.UserStatusEntity;
import secretutka.pet.storage.repository.core.UserRepository;
import secretutka.pet.storage.repository.status.UserStatusRepository;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.bootstrap.enabled", havingValue = "true", matchIfMissing = true)
public class DevBootstrapUsers implements ApplicationRunner {

	private final UserRepository userRepository;
	private final UserStatusRepository userStatusRepository;
	private final UserStorage userStorage;
	private final PasswordEncoder passwordEncoder;

	@Value("${app.bootstrap.admin-username:admin}")
	private String adminUsername;

	@Value("${app.bootstrap.admin-password:admin}")
	private String adminPassword;

	@Value("${app.bootstrap.user-username:user}")
	private String userUsername;

	@Value("${app.bootstrap.user-password:user}")
	private String userPassword;

	@Override
	@Transactional
	public void run(ApplicationArguments args) {
		UserStatusEntity status = userStatusRepository.findAll().stream()
				.findFirst()
				.orElse(null);
		if (status == null) {
			log.warn("Не найдено ни одного user_status — пропускаю создание демо‑пользователей");
			return;
		}
		createIfAbsent(adminUsername, adminPassword, UserRole.ADMIN, status);
		createIfAbsent(userUsername, userPassword, UserRole.USER, status);
	}

	private void createIfAbsent(String usernameRaw, String rawPassword, UserRole role, UserStatusEntity status) {
		String username = usernameRaw != null ? usernameRaw.trim().toLowerCase(Locale.ROOT) : "";
		if (username.isEmpty()) {
			return;
		}
		if (userRepository.existsByUsername(username)) {
			return;
		}
		String hash = passwordEncoder.encode(rawPassword != null ? rawPassword : "");
		UserEntity entity = UserEntity.builder()
				.username(username)
				.password(hash)
				.email(null)
				.displayName(username)
				.status(status)
				.role(role)
				.build();
		userStorage.save(entity);
		log.info("Создан демо‑пользователь {} с ролью {}", username, role);
	}
}
