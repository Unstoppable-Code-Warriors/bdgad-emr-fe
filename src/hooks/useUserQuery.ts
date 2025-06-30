import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import authService from "@/services/auth.service"
import useAuthStore from "@/stores/auth.store"
import { useEffect } from "react"

// Query keys
export const userQueryKeys = {
	all: ["user"] as const,
	profile: () => [...userQueryKeys.all, "profile"] as const,
}

/**
 * Hook to get current user profile information
 */
export const useUserProfile = () => {
	const { isAuthenticated, setUser, clearAuth } = useAuthStore()

	const query = useQuery({
		queryKey: userQueryKeys.profile(),
		queryFn: async () => {
			const response = await authService.getProfile()
			return response.user
		},
		enabled: isAuthenticated, // Only run query if user is authenticated
		staleTime: 5 * 60 * 1000, // 5 minutes
	})

	// Handle successful data
	useEffect(() => {
		if (query.data) {
			setUser(query.data)
		}
	}, [query.data, setUser])

	// Handle errors
	useEffect(() => {
		if (query.error) {
			console.error("Failed to fetch user profile:", query.error)
			// If unauthorized, clear auth state
			if (
				query.error instanceof Error &&
				query.error.message.includes("401")
			) {
				clearAuth()
			}
		}
	}, [query.error, clearAuth])

	return query
}

/**
 * Hook to login user
 */
export const useLogin = () => {
	const queryClient = useQueryClient()
	const { setUser, setTokens } = useAuthStore()

	return useMutation({
		mutationFn: authService.login,
		onSuccess: (data) => {
			// Store token and user in Zustand
			setTokens({ token: data.token })
			setUser(data.user)

			// Set user data in React Query cache
			queryClient.setQueryData(userQueryKeys.profile(), data.user)
		},
		onError: (error: Error) => {
			console.error("Login failed:", error)
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
