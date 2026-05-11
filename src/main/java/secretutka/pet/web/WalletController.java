package secretutka.pet.web;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import secretutka.pet.core.dto.WalletResponse;
import secretutka.pet.service.WalletService;

@RestController
@RequestMapping("/api/wallets")
@RequiredArgsConstructor
public class WalletController {

	private final WalletService walletService;

	@GetMapping
	public Page<WalletResponse> list(@PageableDefault(size = 20) Pageable pageable) {
		return walletService.list(pageable);
	}
}
