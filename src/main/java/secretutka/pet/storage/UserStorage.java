package secretutka.pet.storage;

import java.util.Optional;
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
}
