package secret_utka.pet.storage.repository.status;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import secret_utka.pet.storage.entity.status.WalletStatusEntity;

public interface WalletStatusRepository extends JpaRepository<WalletStatusEntity, Long> {

	Optional<WalletStatusEntity> findByCode(String code);
}
