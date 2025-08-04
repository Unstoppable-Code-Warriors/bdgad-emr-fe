import { redirect } from "react-router"
import {
	getAccessToken,
	isUserAuthenticated,
	clearTokensOutside,
	isStoreHydrated,
} from "@/stores/auth.store"

/**
 * Auth loader - Protects routes that require authentication
 * If user doesn't have a valid access token, clears tokens and redirects to login
 */
export const authLoader = () => {
	const isHydrated = isStoreHydrated()

	console.log("🔐 AuthLoader:", { isHydrated })

	// Wait for store to hydrate before checking auth
	if (!isHydrated) {
		console.log("⏳ Store not hydrated yet, allowing access temporarily")
		return null
	}

	const accessToken = getAccessToken()
	const isAuthenticated = isUserAuthenticated()

	console.log("🔐 AuthLoader:", {
		accessToken: !!accessToken,
		isAuthenticated,
	})

	// Check if user has access token and is authenticated
	if (!accessToken || !isAuthenticated) {
		console.log("🚫 Not authenticated, redirecting to login")
		// Clear any stale tokens
		clearTokensOutside()
		// Redirect to login page
		throw redirect("/auth/login")
	}

	console.log("✅ Authenticated, allowing access")
	// User is authenticated, allow access
	return null
}

/**
 * Non-auth loader - For public routes like login, forgot password, reset password
 * If user already has a valid access token, redirects to home
 * Special handling for OAuth callback route
 */
export const nonAuthLoader = () => {
	const accessToken = getAccessToken()
	const isAuthenticated = isUserAuthenticated()

	console.log("🔓 NonAuthLoader:", {
		accessToken: !!accessToken,
		isAuthenticated,
	})

	// Check if this is a callback route - allow access regardless of auth status
	const currentUrl = new URL(window.location.href)
	const isCallbackRoute = currentUrl.pathname === "/auth/callback"

	if (isCallbackRoute) {
		console.log("📞 Callback route, allowing access")
		// Allow access to callback route regardless of authentication status
		return null
	}

	// Check if this is a password-related request with a token
	const isPasswordRoute = currentUrl.pathname === "/auth/reset-password"
	const hasToken = currentUrl.searchParams.has("token")

	// If user is on password page with a token, clear their current session
	if (isPasswordRoute && hasToken && (accessToken || isAuthenticated)) {
		console.log("🔑 Password reset with token, clearing auth")
		clearTokensOutside()
		return null
	}

	// Check if user is already authenticated
	if (accessToken && isAuthenticated) {
		console.log("✅ Already authenticated, redirecting to home")
		// User is already logged in, redirect to home
		throw redirect("/")
	}

	console.log("🆓 Not authenticated, allowing access to public route")
	// User is not authenticated, allow access to public route
	return null
}
