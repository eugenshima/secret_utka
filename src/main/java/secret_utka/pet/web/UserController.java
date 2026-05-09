package secret_utka.pet.web;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import secret_utka.pet.core.dto.UserCreateRequest;
import secret_utka.pet.core.dto.UserPatchRequest;
import secret_utka.pet.core.dto.UserResponse;
import secret_utka.pet.service.UserService;
import secret_utka.pet.web.doc.UserDoc;

@RestController
@RequiredArgsConstructor
public class UserController implements UserDoc {

	private final UserService userService;

	@Override
	public ResponseEntity<Void> create(UserCreateRequest body) {
		userService.create(body);
		return ResponseEntity.ok().build();
	}

	@Override
	public ResponseEntity<UserResponse> getById(Long id) {
		return ResponseEntity.ok(userService.getById(id));
	}

	@Override
	public Page<UserResponse> getUsers(Pageable pageable) {
		return userService.list(pageable);
	}

	@Override
	public ResponseEntity<Void> update(Long id, UserPatchRequest body) {
		userService.patch(id, body);
		return ResponseEntity.ok().build();
	}

	@Override
	public ResponseEntity<Void> delete(Long id) {
		userService.deleteById(id);
		return ResponseEntity.noContent().build();
	}
}
