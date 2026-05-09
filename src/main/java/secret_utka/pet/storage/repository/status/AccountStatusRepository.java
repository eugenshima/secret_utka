package secret_utka.pet.storage.repository.status;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import secret_utka.pet.storage.entity.status.AccountStatusEntity;

public interface AccountStatusRepository extends JpaRepository<AccountStatusEntity, Long> {

	Optional<AccountStatusEntity> findByCode(String code);
}
