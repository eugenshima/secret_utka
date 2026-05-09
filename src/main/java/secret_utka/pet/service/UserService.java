package secret_utka.pet.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import secret_utka.pet.core.dto.UserCreateRequest;
import secret_utka.pet.core.dto.UserPatchRequest;
import secret_utka.pet.core.dto.UserResponse;
import secret_utka.pet.storage.UserStorage;
import secret_utka.pet.storage.entity.core.UserEntity;
import secret_utka.pet.storage.repository.status.UserStatusRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

	private final UserStorage userStorage;
	private final UserStatusRepository userStatusRepository;

	public UserResponse getById(Long id) {
		return map(user(id));
	}

	public Page<UserResponse> list(Pageable pageable) {
		return userStorage.findAll(pageable).map(this::map);
	}

	@Transactional
	public UserResponse create(UserCreateRequest request) {
		var status = userStatusRepository.findById(request.statusId())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Неизвестный status_id"));

		UserEntity entity = new UserEntity();
		entity.setUsername(request.username());
		entity.setPassword(request.password());
		entity.setEmail(request.email());
		entity.setDisplayName(request.displayName());
		entity.setStatus(status);
		return map(userStorage.save(entity));
	}

	@Transactional
	public UserResponse patch(Long id, UserPatchRequest patch) {
		UserEntity entity = user(id);
		if (patch.email() != null) {
			entity.setEmail(patch.email());
		}
		if (patch.displayName() != null) {
			entity.setDisplayName(patch.displayName());
		}
		if (patch.statusId() != null) {
			var status = userStatusRepository.findById(patch.statusId())
					.orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Неизвестный status_id"));
			entity.setStatus(status);
		}
		return map(userStorage.save(entity));
	}

	@Transactional
	public void deleteById(Long id) {
		UserEntity entity = user(id);
		userStorage.deleteById(entity.getId());
	}

	private UserEntity user(Long id) {
		return userStorage.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Пользователь не найден"));
	}

	private UserResponse map(UserEntity e) {
		return new UserResponse(
				e.getId(),
				e.getUsername(),
				e.getEmail(),
				e.getDisplayName(),
				e.getStatus().getCode(),
				e.getCreatedAt());
	}
}
