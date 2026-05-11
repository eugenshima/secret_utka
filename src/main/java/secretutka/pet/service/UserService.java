package secretutka.pet.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import secretutka.pet.core.dto.UserCreateRequest;
import secretutka.pet.core.dto.UserResponse;
import secretutka.pet.core.mapper.DtoMapper;
import secretutka.pet.storage.UserStorage;
import secretutka.pet.storage.entity.core.UserEntity;
import secretutka.pet.storage.repository.status.UserStatusRepository;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserStorage userStorage;
    private final UserStatusRepository userStatusRepository;
    private final DtoMapper dtoMapper;

    @Transactional
    public void createUser(UserCreateRequest request) {
        log.info("Creating user entity (request = {})", request);
        var user = buildUserEntity(request);
        userStorage.save(user);
    }

    public UserResponse getById(Long id) {
        var user = findUserEntity(id);
        return buildUserResponse(user);
    }

    public Page<UserResponse> list(Pageable pageable) {
        return userStorage.findAll(pageable)
                .map(this::buildUserResponse);
    }

    @Transactional
    public void deleteById(Long id) {
        var entity = findUserEntity(id);
        userStorage.deleteById(entity.getId());
    }

    private UserEntity findUserEntity(Long id) {
        if (id == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Идентификатор не задан");
        }
        return userStorage.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Пользователь не найден"));
    }

    private UserEntity buildUserEntity(UserCreateRequest request) {
        var userStatus = userStatusRepository.findById(request.statusId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Неизвестный status_id"));
        return UserEntity.builder()
                .username(request.username())
                .password(request.password())
                .email(request.email())
                .displayName(request.displayName())
                .status(userStatus)
                .build();
    }

    private UserResponse buildUserResponse(UserEntity user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .status(dtoMapper.dto(user.getStatus()))
                .build();
    }
}
