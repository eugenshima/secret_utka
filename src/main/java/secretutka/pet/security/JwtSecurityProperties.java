package secretutka.pet.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.jwt")
public class JwtSecurityProperties {

	/**
	 * Секрет HMAC‑SHA как строка UTF‑8 (для продакена задайте длинную случайную строку).
	 */
	private String secret = "dev-only-change-me-0123456789abcdef0123456789abcdef0123456789abcd";

	private long expiryMs = 86400_000L;

	public String getSecret() {
		return secret;
	}

	public void setSecret(String secret) {
		this.secret = secret;
	}

	public long getExpiryMs() {
		return expiryMs;
	}

	public void setExpiryMs(long expiryMs) {
		this.expiryMs = expiryMs;
	}
}
