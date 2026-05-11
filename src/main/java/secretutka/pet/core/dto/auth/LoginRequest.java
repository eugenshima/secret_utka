package secretutka.pet.core.dto.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;

@Builder
public record LoginRequest(@JsonProperty("username") String username, @JsonProperty("password") String password) {}
