package secretutka.pet.core.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import lombok.Builder;

@Builder
public record AccountResponse(
		Long id,
		@JsonProperty("user_id") Long userId,
		BigDecimal amount,
		@JsonProperty("currency_code") String currencyCode,
		@JsonProperty("status_code") String statusCode) {
}
