package secretutka.pet.storage;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.PageImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import secretutka.pet.storage.entity.core.UserEntity;
import secretutka.pet.storage.repository.core.UserRepository;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserStorage {

	private final UserRepository userRepository;

	public Optional<UserEntity> findById(Long id) {
		return userRepository.findById(id);
	}

	public Page<UserEntity> findAll(Pageable pageable) {
		return userRepository.findAll(pageable);
	}

	public void save(UserEntity user) {
		userRepository.save(user);
	}

	public void deleteById(Long id) {
		userRepository.deleteById(id);
	}

	public Optional<UserEntity> findByUsername(String username) {
		return userRepository.findByUsername(username);
	}

	public boolean existsByUsername(String username) {
		return userRepository.existsByUsername(username);
	}

	public Page<UserEntity> pageForSelf(Long userId, Pageable pageable) {
		return userRepository.findById(userId)
				.map(u -> new PageImpl<>(List.of(u), pageable, 1))
				.orElseThrow();
	}
}
