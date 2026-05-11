package secretutka.pet.storage.repository.ref;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import secretutka.pet.storage.entity.ref.ExpenseCategoryEntity;

public interface ExpenseCategoryRepository extends JpaRepository<ExpenseCategoryEntity, Long> {

	Optional<ExpenseCategoryEntity> findByCode(String code);
}
