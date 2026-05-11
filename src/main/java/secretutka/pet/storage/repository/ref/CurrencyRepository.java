package secretutka.pet.storage.repository.ref;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import secretutka.pet.storage.entity.ref.CurrencyEntity;

public interface CurrencyRepository extends JpaRepository<CurrencyEntity, Long> {

	Optional<CurrencyEntity> findByCode(String code);
}
