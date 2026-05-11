package secretutka.pet.storage.repository.status;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import secretutka.pet.storage.entity.status.UserStatusEntity;

public interface UserStatusRepository extends JpaRepository<UserStatusEntity, Long> {

	Optional<UserStatusEntity> findByCode(String code);
}
