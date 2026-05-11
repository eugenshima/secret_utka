package secretutka.pet.web;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import secretutka.pet.core.dto.UserCreateRequest;
import secretutka.pet.core.dto.UserResponse;
import secretutka.pet.core.dto.status.UserStatus;
import secretutka.pet.service.UserService;
import secretutka.pet.web.doc.UserDoc;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController implements UserDoc {

	private final UserService userService;

	@Override
	@PreAuthorize("hasRole('ADMIN')")
	@PostMapping
	public ResponseEntity<Void> create(@RequestBody UserCreateRequest request) {
		userService.createUser(request);
		return ResponseEntity.ok().build();
	}

	@Override
	@GetMapping("/statuses")
	public ResponseEntity<List<UserStatus>> statuses() {
		return ResponseEntity.ok(userService.getStatuses());
	}

	@Override
	@GetMapping
	public Page<UserResponse> getUsers(@PageableDefault(size = 20) Pageable pageable) {
		return userService.list(pageable);
	}

	@Override
	@GetMapping("/{id}")
	public ResponseEntity<UserResponse> getById(@PathVariable Long id) {
		return ResponseEntity.ok(userService.getById(id));
	}

	@Override
	@PatchMapping("/{userId}/status/{statusId}")
	public ResponseEntity<Void> updateStatus(@PathVariable Long userId, @PathVariable Long statusId) {
		userService.updateStatus(userId, statusId);
		return ResponseEntity.ok().build();
	}

	@Override
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		userService.deleteById(id);
		return ResponseEntity.noContent().build();
	}
}
