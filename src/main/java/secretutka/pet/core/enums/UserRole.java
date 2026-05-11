package secretutka.pet.core.enums;

public enum UserRole {
	ADMIN,
	USER;

	public boolean isAdmin() {
		return this == ADMIN;
	}
}
