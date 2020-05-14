import authorisationHelpers from "../../modules/authorisationHelpers";
import LoginRedirect from "../components/LoginRedirect.svelte";

export function requireLogin(user, component) {
	return user ? component : LoginRedirect;
}

export function requireManager(user, component) {
	return user && authorisationHelpers.isManager(user) ? component : null;
}

export function requireAdmin(user, component) {
	return user && authorisationHelpers.isAdmin(user) ? component : null;
}
