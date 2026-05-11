package secretutka.pet.storage.repository.core;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import secretutka.pet.storage.entity.core.WalletEntity;

public interface WalletRepository extends JpaRepository<WalletEntity, Long> {

	Page<WalletEntity> findByAccountEntity_User_Id(Long userId, Pageable pageable);
}
