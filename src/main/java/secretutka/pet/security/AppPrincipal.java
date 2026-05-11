package secretutka.pet.security;

import java.io.Serial;
import java.util.Collection;
import java.util.List;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import secretutka.pet.core.enums.UserRole;

@Getter
public class AppPrincipal implements UserDetails {

	@Serial
	private static final long serialVersionUID = 1L;

	private final Long userId;
	private final String username;
	private final UserRole role;

	public AppPrincipal(Long userId, String username, UserRole role) {
		this.userId = userId;
		this.username = username;
		this.role = role;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
	}

	@Override
	public String getPassword() {
		return null;
	}

	@Override
	public String getUsername() {
		return username;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

	public boolean isAdmin() {
		return role != null && role.isAdmin();
	}
}
