import type { User } from "@/types/user"
import type { ApiResponse } from "@/utils/api"
import { authApi as api } from "@/utils/authApi"
import { clearTokensOutside, getAccessToken } from "@/stores/auth.store"

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
}

interface ForgotPasswordResponse {
	message: string
}

interface ResetPasswordRequest {
	token: string
	password: string
	confirmPassword: string
}

interface ResetPasswordResponse {
	message: string
}

interface GoogleAuthResponse {
	data: {
		oauthUrl: string
		state: string
	}
	message: string
}

class AuthService {
	/**
	 * Login user with email and password
	 */
	async login(credentials: LoginCredentials): Promise<LoginResponse> {
		const response = await api
			.post("auth/login", {
				json: credentials,
			})
			.json<ApiResponse<LoginResponse>>()

		return response.data
	}

	/**
	 * Get current user profile
	 */
	async getProfile(): Promise<ApiResponse<UserProfileResponse>> {
		const token = getAccessToken()
		if (!token) {
			throw new Error("Token not found")
		}

		const response = await api
			.get("auth/me", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.json<ApiResponse<UserProfileResponse>>()

		return response
	}

	/**
	 * Send forgot password email
	 */
	async forgotPassword(
		data: ForgotPasswordRequest
	): Promise<ForgotPasswordResponse> {
		const response = await api
			.post("auth/forgot-password", {
				json: data,
			})
			.json<ForgotPasswordResponse>()

		return response
	}

	/**
	 * Reset password with token
	 */
	async resetPassword(
		data: ResetPasswordRequest
	): Promise<ResetPasswordResponse> {
		const response = await api
			.post("auth/reset-password", {
				json: data,
			})
			.json<ResetPasswordResponse>()

		return response
	}

	/**
	 * Logout user
	 */
	async logout(): Promise<void> {
		clearTokensOutside()
		window.location.href = "/auth/login"
	}

	/**
	 * Get Google OAuth URL
	 */
	async getGoogleAuthUrl(redirectUrl?: string): Promise<GoogleAuthResponse> {
		const searchParams = new URLSearchParams()
		if (redirectUrl) {
			searchParams.set("redirect_url", redirectUrl)
		}
		const response = await api
			.get(`auth/google?${searchParams.toString()}`)
			.json<GoogleAuthResponse>()

		return response
	}
}

export const authService = new AuthService()
export default authService
