package secretutka.pet.web;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import secretutka.pet.core.dto.UserCreateRequest;
import secretutka.pet.core.dto.UserResponse;
import secretutka.pet.service.UserService;
import secretutka.pet.web.doc.UserDoc;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController implements UserDoc {

    private final UserService userService;

    @Override
    @PostMapping
    public ResponseEntity<Void> create(@RequestBody UserCreateRequest request) {
        userService.createUser(request);
        return ResponseEntity.ok().build();
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getById(id));
    }

    @Override
    @GetMapping
    public Page<UserResponse> getUsers() {
        var pageRequest = Pageable.ofSize(10); //TODO: добавить фильтрацию
        return userService.list(pageRequest);
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
