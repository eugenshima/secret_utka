package secretutka.pet.core.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.springframework.stereotype.Component;
import secretutka.pet.core.dto.status.UserStatus;
import secretutka.pet.storage.entity.status.UserStatusEntity;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
@Component
public interface DtoMapper {

    UserStatus dto(UserStatusEntity entity);

}
