package secretutka.pet.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import secretutka.pet.core.enums.UserRole;
import secretutka.pet.storage.entity.core.UserEntity;

@Service
@RequiredArgsConstructor
public class JwtService {

	private final JwtSecurityProperties jwtProperties;

	public String createAccessToken(UserEntity user) {
		long now = System.currentTimeMillis();
		Date issued = new Date(now);
		Date expiry = new Date(now + jwtProperties.getExpiryMs());
		return Jwts.builder()
				.subject(user.getUsername())
				.issuedAt(issued)
				.expiration(expiry)
				.claim("uid", user.getId())
				.claim("role", user.getRole().name())
				.signWith(signingKey())
				.compact();
	}

	public AppPrincipal parseToken(String token) {
		Claims claims = Jwts.parser()
				.verifyWith(signingKey())
				.build()
				.parseSignedClaims(token)
				.getPayload();
		Number uidObj = claims.get("uid", Number.class);
		Long userId = uidObj != null ? uidObj.longValue() : null;
		String username = claims.getSubject();
		String roleName = claims.get("role", String.class);
		if (userId == null || username == null || username.isBlank() || roleName == null || roleName.isBlank()) {
			throw new io.jsonwebtoken.JwtException("Неверный JWT");
		}
		UserRole role;
		try {
			role = UserRole.valueOf(roleName);
		} catch (IllegalArgumentException ex) {
			throw new io.jsonwebtoken.JwtException("Неверный JWT");
		}
		return new AppPrincipal(userId, username, role);
	}

	private SecretKey signingKey() {
		byte[] keyBytes = jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8);
		return Keys.hmacShaKeyFor(keyBytes);
	}
}
