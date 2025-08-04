import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import authService from "@/services/auth.service"
import useAuthStore from "@/stores/auth.store"
import type { UserRole } from "@/types/user"

// Query keys
export const userQueryKeys = {
	all: ["user"] as const,
	profile: () => [...userQueryKeys.all, "profile"] as const,
}

/**
 * Hook to get current user profile information
 */
export const useUserProfile = () => {
	const { isAuthenticated, clearAuth } = useAuthStore()

	const query = useQuery({
		queryKey: userQueryKeys.profile(),
		queryFn: async () => {
			const response = await authService.getProfile()
			return response.data.user
		},
		enabled: isAuthenticated, // Only run query if user is authenticated
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: (failureCount, error) => {
			// Don't retry on 401 errors
			if (error instanceof Error && error.message.includes("401")) {
				clearAuth()
				return false
			}
			return failureCount < 3
		},
	})

	return query
}

/**
 * Hook to login user
 */
export const useLogin = () => {
	const queryClient = useQueryClient()
	const { setTokens, clearAuth } = useAuthStore()

	return useMutation({
		mutationFn: authService.login,
		onSuccess: async (data) => {
			try {
				// Store token temporarily
				setTokens({ token: data.token })

				// Fetch user profile to validate role
				const userResponse = await authService.getProfile()
				const user = userResponse.data.user

				// Check if user has doctor role (code "5")
				const hasValidRole = user.roles.some(
					(role: UserRole) => role.code === "5"
				)

				if (!hasValidRole) {
					// User doesn't have doctor role - clear tokens and throw error
					clearAuth()
					throw new Error(
						"Hệ thống EMR chỉ dành cho bác sĩ. Tài khoản của bạn không có quyền truy cập."
					)
				}

				// User has valid doctor role - clear any cached user data to force refetch
				queryClient.removeQueries({ queryKey: userQueryKeys.profile() })
			} catch (error) {
				// Clear tokens on any validation error
				clearAuth()
				throw error
			}
		},
		onError: (error: Error) => {
			console.error("Login failed:", error)
			clearAuth()
		},
	})
}

/**
 * Hook to logout user
 */
export const useLogout = () => {
	const queryClient = useQueryClient()
	const { clearAuth } = useAuthStore()

	return useMutation({
		mutationFn: authService.logout,
		onSuccess: () => {
			// Clear auth state
			clearAuth()
			// Clear all cached data
			queryClient.clear()
		},
		onError: (error: Error) => {
			console.error("Logout error:", error)
			// Even if logout API fails, clear local state
			clearAuth()
			queryClient.clear()
		},
	})
}

/**
 * Hook to change password
 */
export const useChangePassword = () => {
	return useMutation({
		mutationFn: authService.changePassword,
		onError: (error: Error) => {
			console.error("Change password failed:", error)
		},
	})
}

/**
 * Hook to forgot password
 */
export const useForgotPassword = () => {
	return useMutation({
		mutationFn: authService.forgotPassword,
		onError: (error: Error) => {
			console.error("Forgot password failed:", error)
		},
	})
}

/**
 * Hook to reset password
 */
export const useResetPassword = () => {
	return useMutation({
		mutationFn: authService.resetPassword,
		onError: (error: Error) => {
			console.error("Reset password failed:", error)
		},
	})
}

/**
 * Hook to verify email
 */
export const useVerifyEmail = () => {
	return useMutation({
		mutationFn: authService.verifyEmail,
		onError: (error: Error) => {
			console.error("Email verification failed:", error)
		},
	})
}

/**
 * Hook to check if email exists
 */
export const useCheckEmail = () => {
	return useMutation({
		mutationFn: authService.checkEmail,
		onError: (error: Error) => {
			console.error("Check email failed:", error)
		},
	})
}
