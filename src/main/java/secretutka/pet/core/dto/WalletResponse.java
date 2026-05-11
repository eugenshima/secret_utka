package secretutka.pet.core.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import lombok.Builder;

@Builder
public record WalletResponse(
		Long id,
		@JsonProperty("account_id") Long accountId,
		BigDecimal amount,
		@JsonProperty("status_code") String statusCode) {
}
