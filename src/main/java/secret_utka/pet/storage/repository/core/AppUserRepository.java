package secret_utka.pet.storage.repository.core;

import org.springframework.data.jpa.repository.JpaRepository;
import secret_utka.pet.storage.entity.core.UserEntity;

public interface AppUserRepository extends JpaRepository<UserEntity, Long> {

}
