package secretutka.pet.storage.repository.core;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import secretutka.pet.storage.entity.core.TransactionEntity;

public interface TransactionRepository extends JpaRepository<TransactionEntity, Long> {

	Page<TransactionEntity> findByWalletEntity_AccountEntity_User_Id(Long userId, Pageable pageable);
}
