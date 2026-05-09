package secret_utka.pet.storage.entity.core;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import secret_utka.pet.storage.entity.status.TransactionStatusEntity;

@Entity
@Table(schema = "core", name = "\"transaction\"")
@Getter
@Setter
@NoArgsConstructor
public class TransactionEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "wallet_id", nullable = false)
	private WalletEntity walletEntity;

	@Column(name = "sum", nullable = false, precision = 20, scale = 4)
	private BigDecimal sum;

	@Column(nullable = false, name = "current_balance", precision = 20, scale = 4)
	private BigDecimal currentBalance;

	@Column(length = 255)
	private String description;

	@CreationTimestamp
	@Column(nullable = false, name = "processed_at", updatable = false)
	private LocalDateTime processedAt;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "status_id", nullable = false)
	private TransactionStatusEntity status;
}
