import { redirect } from "react-router"
import {
	getAccessToken,
	isUserAuthenticated,
	clearTokensOutside,
	getCurrentUser,
	hasUserDoctorRole,
} from "@/stores/auth.store"

/**
 * Auth loader - Protects routes that require doctor authentication
 * If user doesn't have a valid access token or doctor role, clears tokens and redirects to login
 */
export const authLoader = () => {
	const accessToken = getAccessToken()
	const isAuthenticated = isUserAuthenticated()
	const user = getCurrentUser()

	// Check if user has access token and is authenticated
	if (!accessToken || !isAuthenticated || !user) {
		// Clear any stale tokens
		clearTokensOutside()
		// Redirect to login page
		throw redirect("/auth/login")
	}

	// Verify user has doctor role
	if (!hasUserDoctorRole()) {
		clearTokensOutside()
		throw redirect("/auth/login")
	}

	// Verify user is active
	if (user.status !== "active") {
		clearTokensOutside()
		throw redirect("/auth/login")
	}

	// User is authenticated and authorized, allow access
	return null
}

/**
 * Non-auth loader - For public routes like login, forgot password, reset password
 * If user already has a valid access token, redirects to dashboard
 */
export const nonAuthLoader = () => {
	const accessToken = getAccessToken()
	const isAuthenticated = isUserAuthenticated()
	const user = getCurrentUser()

	// Check if user is already authenticated and authorized
	if (
		accessToken &&
		isAuthenticated &&
		user &&
		user.status === "active" &&
		hasUserDoctorRole()
	) {
		// User is already logged in, redirect to dashboard
		throw redirect("/dashboard")
	}

	// User is not authenticated, allow access to public route
	return null
}

/**
 * Admin loader - For routes that require senior doctor or head doctor privileges
 */
export const adminLoader = () => {
	const accessToken = getAccessToken()
	const isAuthenticated = isUserAuthenticated()
	const user = getCurrentUser()

	// Check basic authentication first
	if (!accessToken || !isAuthenticated || !user) {
		clearTokensOutside()
		throw redirect("/auth/login")
	}

	// Check if user has admin privileges
	if (!hasUserDoctorRole()) {
		// Redirect to dashboard if not authorized for admin routes
		throw redirect("/dashboard")
	}

	// Verify user is active
	if (user.status !== "active") {
		clearTokensOutside()
		throw redirect("/auth/login")
	}

	return null
}

/**
 * Head doctor loader - For routes that require head doctor privileges only
 */
export const headDoctorLoader = () => {
	const accessToken = getAccessToken()
	const isAuthenticated = isUserAuthenticated()
	const user = getCurrentUser()

	// Check basic authentication first
	if (!accessToken || !isAuthenticated || !user) {
		clearTokensOutside()
		throw redirect("/auth/login")
	}

	// Check if user has head doctor privileges
	if (!hasUserDoctorRole()) {
		// Redirect to dashboard if not authorized
		throw redirect("/dashboard")
	}

	// Verify user is active
	if (user.status !== "active") {
		clearTokensOutside()
		throw redirect("/auth/login")
	}

	return null
}
