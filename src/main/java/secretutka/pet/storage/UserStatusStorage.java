package secretutka.pet.storage;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import secretutka.pet.storage.entity.status.UserStatusEntity;
import secretutka.pet.storage.repository.status.UserStatusRepository;

import java.util.List;

@Component
@RequiredArgsConstructor
public class UserStatusStorage {

    private final UserStatusRepository userStatusRepository;

    public List<UserStatusEntity> findAll() {
        return userStatusRepository.findAll();
    }

}
