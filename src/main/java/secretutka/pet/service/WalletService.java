package secretutka.pet.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import secretutka.pet.core.dto.WalletResponse;
import secretutka.pet.security.CurrentUserAccessor;
import secretutka.pet.storage.entity.core.WalletEntity;
import secretutka.pet.storage.repository.core.WalletRepository;

@Service
@RequiredArgsConstructor
public class WalletService {

	private final WalletRepository walletRepository;
	private final CurrentUserAccessor currentUserAccessor;

	@Transactional(readOnly = true)
	public Page<WalletResponse> list(Pageable pageable) {
		var me = currentUserAccessor.requireUser();
		if (me.isAdmin()) {
			return walletRepository.findAll(pageable).map(WalletService::map);
		}
		return walletRepository.findByAccountEntity_User_Id(me.getUserId(), pageable).map(WalletService::map);
	}

	private static WalletResponse map(WalletEntity e) {
		return WalletResponse.builder()
				.id(e.getId())
				.accountId(e.getAccountEntity().getId())
				.amount(e.getAmount())
				.statusCode(e.getStatus().getCode())
				.build();
	}
}
