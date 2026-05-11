package secretutka.pet.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import secretutka.pet.core.dto.AccountResponse;
import secretutka.pet.security.CurrentUserAccessor;
import secretutka.pet.storage.entity.core.AccountEntity;
import secretutka.pet.storage.repository.core.AccountRepository;

@Service
@RequiredArgsConstructor
public class AccountService {

	private final AccountRepository accountRepository;
	private final CurrentUserAccessor currentUserAccessor;

	@Transactional(readOnly = true)
	public Page<AccountResponse> list(Pageable pageable) {
		var me = currentUserAccessor.requireUser();
		if (me.isAdmin()) {
			return accountRepository.findAll(pageable).map(AccountService::map);
		}
		return accountRepository.findByUser_Id(me.getUserId(), pageable).map(AccountService::map);
	}

	private static AccountResponse map(AccountEntity e) {
		return AccountResponse.builder()
				.id(e.getId())
				.userId(e.getUser().getId())
				.amount(e.getAmount())
				.currencyCode(e.getCurrencyEntity().getCode())
				.statusCode(e.getStatus().getCode())
				.build();
	}
}
