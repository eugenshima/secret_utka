package secretutka.pet.core.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record TransactionResponse(
		Long id,
		@JsonProperty("wallet_id") Long walletId,
		BigDecimal sum,
		@JsonProperty("current_balance") BigDecimal currentBalance,
		String description,
		@JsonProperty("processed_at") LocalDateTime processedAt,
		@JsonProperty("status_code") String statusCode) {
}
