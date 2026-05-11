package secretutka.pet.storage.entity.core;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import secretutka.pet.storage.entity.status.UserStatusEntity;

import java.time.LocalDateTime;

@Entity
@Table(schema = "core", name = "\"user\"")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true)
	private String username;

	@Column(nullable = false)
	private String password;

	@Column(unique = true)
	private String email;

	@Column(name = "display_name")
	private String displayName;

	@ManyToOne(fetch = FetchType.EAGER, optional = false)
	@JoinColumn(name = "status_id", nullable = false)
	private UserStatusEntity status;

	@CreationTimestamp
	@Column(nullable = false, name = "created_at", updatable = false)
	private LocalDateTime createdAt;
}
