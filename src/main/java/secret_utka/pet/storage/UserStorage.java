package secret_utka.pet.storage;

import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import secret_utka.pet.storage.entity.core.UserEntity;
import secret_utka.pet.storage.repository.core.AppUserRepository;

@Component
@RequiredArgsConstructor
public class UserStorage {

	private final AppUserRepository appUserRepository;

	public Optional<UserEntity> findById(Long id) {
		return appUserRepository.findById(id);
	}

	public Page<UserEntity> findAll(Pageable pageable) {
		return appUserRepository.findAll(pageable);
	}

	public UserEntity save(UserEntity user) {
		return appUserRepository.save(user);
	}

	public void deleteById(Long id) {
		appUserRepository.deleteById(id);
	}
}
