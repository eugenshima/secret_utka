package secretutka.pet.service;

import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import secretutka.pet.core.enums.UserRole;
import secretutka.pet.core.dto.UserCreateRequest;
import secretutka.pet.core.dto.UserResponse;
import secretutka.pet.core.dto.status.UserStatus;
import secretutka.pet.core.mapper.DtoMapper;
import secretutka.pet.security.CurrentUserAccessor;
import secretutka.pet.storage.UserStatusStorage;
import secretutka.pet.storage.UserStorage;
import secretutka.pet.storage.entity.core.UserEntity;
import secretutka.pet.storage.repository.status.UserStatusRepository;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

	private final UserStorage userStorage;
	private final UserStatusRepository userStatusRepository;
	private final DtoMapper dtoMapper;
	private final UserStatusStorage userStatusStorage;
	private final PasswordEncoder passwordEncoder;
	private final CurrentUserAccessor currentUserAccessor;

	@Transactional
	public void createUser(UserCreateRequest request) {
		log.info("Creating user entity (request = {})", request);
		UserRole role = request.role() != null ? request.role() : UserRole.USER;
		var user = buildUserEntity(request, role);
		userStorage.save(user);
	}

	public UserResponse getById(Long id) {
		var me = currentUserAccessor.requireUser();
		if (!me.isAdmin() && !Objects.equals(me.getUserId(), id)) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Недостаточно прав");
		}
		var user = findUserEntity(id);
		return buildUserResponse(user);
	}

	public Page<UserResponse> list(Pageable pageable) {
		var me = currentUserAccessor.requireUser();
		if (me.isAdmin()) {
			return userStorage.findAll(pageable).map(this::buildUserResponse);
		}
		return userStorage.pageForSelf(me.getUserId(), pageable).map(this::buildUserResponse);
	}

	@Transactional
	public void updateStatus(Long userId, Long statusId) {
		var me = currentUserAccessor.requireUser();
		if (!me.isAdmin() && !Objects.equals(me.getUserId(), userId)) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Недостаточно прав");
		}
		var entity = findUserEntity(userId);
		var status = userStatusRepository.findById(statusId).orElseThrow();
		var updatedEntity = entity.toBuilder()
				.status(status)
				.build();
		userStorage.save(updatedEntity);
	}

	@Transactional
	public void deleteById(Long id) {
		var me = currentUserAccessor.requireUser();
		if (!me.isAdmin() && !Objects.equals(me.getUserId(), id)) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Недостаточно прав");
		}
		var entity = findUserEntity(id);
		userStorage.deleteById(entity.getId());
	}

	public List<UserStatus> getStatuses() {
		return userStatusStorage.findAll().stream()
				.map(dtoMapper::dto)
				.toList();
	}

	private UserEntity findUserEntity(Long id) {
		if (id == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Идентификатор не задан");
		}
		return userStorage.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Пользователь не найден"));
	}

	private UserEntity buildUserEntity(UserCreateRequest request, UserRole role) {
		var userStatus = userStatusRepository.findById(request.statusId())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Неизвестный status_id"));
		String encodedPassword = passwordEncoder.encode(request.password());
		return UserEntity.builder()
				.username(request.username())
				.password(encodedPassword)
				.email(request.email())
				.displayName(request.displayName())
				.status(userStatus)
				.role(role)
				.build();
	}

	private UserResponse buildUserResponse(UserEntity user) {
		return UserResponse.builder()
				.id(user.getId())
				.username(user.getUsername())
				.email(user.getEmail())
				.displayName(user.getDisplayName())
				.status(dtoMapper.dto(user.getStatus()))
				.role(user.getRole())
				.createdAt(user.getCreatedAt())
				.build();
	}

}
