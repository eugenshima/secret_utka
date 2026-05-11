package secretutka.pet.storage.repository.core;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import secretutka.pet.storage.entity.core.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

	Optional<UserEntity> findByUsername(String username);

	boolean existsByUsername(String username);
}
