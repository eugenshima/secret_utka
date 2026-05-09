package secret_utka.pet.storage.repository.core;

import org.springframework.data.jpa.repository.JpaRepository;
import secret_utka.pet.storage.entity.core.WalletEntity;

public interface WalletRepository extends JpaRepository<WalletEntity, Long> {

}
