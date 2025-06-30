import { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import useAuthStore, { hasUserDoctorRole } from "@/stores/auth.store"
import { useLogin, useLogout, useUserProfile } from "@/hooks/useUserQuery"
import type { User } from "@/stores/auth.store"

interface LoginCredentials {
	email: string
	password: string
}

interface UseAuthReturn {
	user: User | null
	isLoading: boolean
	isAuthenticated: boolean
	login: (credentials: LoginCredentials) => Promise<void>
	logout: () => Promise<void>
	clearAuth: () => void
	userProfile: ReturnType<typeof useUserProfile>
}

export const useAuth = (): UseAuthReturn => {
	const navigate = useNavigate()
	const {
		user,
		isLoading: storeLoading,
		isAuthenticated,
		clearAuth: clearAuthState,
	} = useAuthStore()

	// TanStack Query hooks
	const loginMutation = useLogin()
	const logoutMutation = useLogout()
	const userProfile = useUserProfile()

	const login = useCallback(
		async (credentials: LoginCredentials) => {
			try {
				const response = await loginMutation.mutateAsync(credentials)

				// Verify the response contains a user with proper role
				if (!response.user || !hasUserDoctorRole()) {
					throw new Error(
						"Unauthorized: Only doctors can access this system"
					)
				}

				// Verify user is active
				if (response.user.status !== "active") {
					throw new Error(
						"Account is deactivated. Please contact administrator."
					)
				}

				// Navigate to dashboard
				navigate("/dashboard")
			} catch (error) {
				clearAuthState()
				throw error
			}
		},
		[loginMutation, clearAuthState, navigate]
	)

	const logout = useCallback(async () => {
		try {
			await logoutMutation.mutateAsync()
		} catch (error) {
			console.error("Logout error:", error)
		} finally {
			// Navigate to login
			navigate("/auth/login")
		}
	}, [logoutMutation, navigate])

	const clearAuth = useCallback(() => {
		clearAuthState()
		navigate("/auth/login")
	}, [clearAuthState, navigate])

	// Combine loading states
	const isLoading =
		storeLoading || loginMutation.isPending || logoutMutation.isPending

	return {
		user,
		isLoading,
		isAuthenticated,
		login,
		logout,
		clearAuth,
		userProfile,
	}
}

export default useAuth
