package secretutka.pet.storage.repository.status;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import secretutka.pet.storage.entity.status.AccountStatusEntity;

public interface AccountStatusRepository extends JpaRepository<AccountStatusEntity, Long> {

	Optional<AccountStatusEntity> findByCode(String code);
}
