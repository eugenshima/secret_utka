package secretutka.pet.storage.repository.status;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import secretutka.pet.storage.entity.status.TransactionStatusEntity;

public interface TransactionStatusRepository extends JpaRepository<TransactionStatusEntity, Long> {

	Optional<TransactionStatusEntity> findByCode(String code);
}
