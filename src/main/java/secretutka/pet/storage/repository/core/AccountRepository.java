package secretutka.pet.storage.repository.core;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import secretutka.pet.storage.entity.core.AccountEntity;

public interface AccountRepository extends JpaRepository<AccountEntity, Long> {

	Page<AccountEntity> findByUser_Id(Long userId, Pageable pageable);
}
