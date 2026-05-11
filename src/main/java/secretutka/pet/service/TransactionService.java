package secretutka.pet.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import secretutka.pet.core.dto.TransactionResponse;
import secretutka.pet.security.CurrentUserAccessor;
import secretutka.pet.storage.entity.core.TransactionEntity;
import secretutka.pet.storage.repository.core.TransactionRepository;

@Service
@RequiredArgsConstructor
public class TransactionService {

	private final TransactionRepository transactionRepository;
	private final CurrentUserAccessor currentUserAccessor;

	@Transactional(readOnly = true)
	public Page<TransactionResponse> list(Pageable pageable) {
		var me = currentUserAccessor.requireUser();
		if (me.isAdmin()) {
			return transactionRepository.findAll(pageable).map(TransactionService::map);
		}
		return transactionRepository
				.findByWalletEntity_AccountEntity_User_Id(me.getUserId(), pageable)
				.map(TransactionService::map);
	}

	private static TransactionResponse map(TransactionEntity e) {
		return TransactionResponse.builder()
				.id(e.getId())
				.walletId(e.getWalletEntity().getId())
				.sum(e.getSum())
				.currentBalance(e.getCurrentBalance())
				.description(e.getDescription())
				.processedAt(e.getProcessedAt())
				.statusCode(e.getStatus().getCode())
				.build();
	}
}
