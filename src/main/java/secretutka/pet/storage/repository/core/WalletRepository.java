package secretutka.pet.storage.repository.core;

import org.springframework.data.jpa.repository.JpaRepository;
import secretutka.pet.storage.entity.core.WalletEntity;

public interface WalletRepository extends JpaRepository<WalletEntity, Long> {

}
