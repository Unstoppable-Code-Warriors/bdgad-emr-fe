import type { User } from "@/stores/auth.store"
import { authApi, createAuthenticatedApi } from "@/utils/api"
import { getAccessToken } from "@/stores/auth.store"
import { LOCALIZATION } from "@/utils/localization"

// API response types
interface LoginResponse {
	token: string
	user: User
}

interface LoginCredentials {
	email: string
	password: string
}

interface UserProfileResponse {
	user: User
}

interface ForgotPasswordRequest {
	email: string
	redirectUrl: string
}

interface ResetPasswordRequest {
	token: string
	newPassword: string
	confirmPassword: string
}

interface ChangePasswordRequest {
	currentPassword: string
	newPassword: string
}

class AuthService {
	/**
	 * Login user with email and password
	 */
	async login(credentials: LoginCredentials): Promise<LoginResponse> {
		const response = await authApi
			.post("auth/login", {
				json: credentials,
			})
			.json<LoginResponse>()

		return response
	}

	/**
	 * Logout current user
	 */
	async logout(): Promise<void> {
		const token = getAccessToken()
		if (token) {
			const authenticatedApi = createAuthenticatedApi(token)
			await authenticatedApi.post("auth/logout")
		}
	}

	/**
	 * Get current user profile
	 */
	async getProfile(): Promise<UserProfileResponse> {
		const token = getAccessToken()
		if (!token) {
			throw new Error(LOCALIZATION.ERRORS.UNAUTHORIZED)
		}

		const authenticatedApi = createAuthenticatedApi(token)
		const response = await authenticatedApi
			.get("auth/me")
			.json<UserProfileResponse>()

		return response
	}

	/**
	 * Send forgot password email
	 */
	async forgotPassword(
		data: ForgotPasswordRequest
	): Promise<{ message: string }> {
		const response = await authApi
			.post("auth/forgot-password", {
				json: data,
			})
			.json<{ message: string }>()

		return response
	}

	/**
	 * Reset password with token
	 */
	async resetPassword(
		data: ResetPasswordRequest
	): Promise<{ message: string }> {
		const response = await authApi
			.post("auth/reset-password", {
				json: data,
			})
			.json<{ message: string }>()

		return response
	}

	/**
	 * Change password (for authenticated users)
	 */
	async changePassword(
		data: ChangePasswordRequest
	): Promise<{ message: string }> {
		const token = getAccessToken()
		if (!token) {
			throw new Error(LOCALIZATION.ERRORS.UNAUTHORIZED)
		}

		const authenticatedApi = createAuthenticatedApi(token)
		const response = await authenticatedApi
			.post("auth/change-password", {
				json: data,
			})
			.json<{ message: string }>()

		return response
	}

	/**
	 * Verify email token (for email verification)
	 */
	async verifyEmail(token: string): Promise<{ message: string }> {
		const response = await authApi
			.post("auth/verify-email", {
				json: { token },
			})
			.json<{ message: string }>()

		return response
	}

	/**
	 * Check if email exists in the system
	 */
	async checkEmail(email: string): Promise<{ exists: boolean }> {
		const response = await authApi
			.post("auth/check-email", {
				json: { email },
			})
			.json<{ exists: boolean }>()

		return response
	}
}

export const authService = new AuthService()
export default authService
