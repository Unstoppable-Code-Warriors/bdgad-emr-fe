import ky from "ky"
import { getAccessToken, clearTokensOutside } from "@/stores/auth.store"

export interface APIResponse<T> {
	data: T
	message: string
}

// Environment variables or configuration
const AUTH_BASE_URL =
	import.meta.env.VITE_AUTH_API_URL || "https://auth.bdgad.bio"

// Global ky instance with base configuration
export const authApi = ky.create({
	prefixUrl: `${AUTH_BASE_URL}/api/v1`,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 30000, // 30 seconds timeout
	retry: {
		limit: 2,
		methods: ["get", "post", "put", "delete"],
		statusCodes: [408, 413, 429, 500, 502, 503, 504],
	},
	hooks: {
		beforeError: [
			async (error) => {
				const { response } = error
				if (response && response.body) {
					try {
						// Clone the response to avoid consuming the original stream
						const clonedResponse = response.clone()
						const errorData =
							(await clonedResponse.json()) as unknown

						// Attach the parsed error data to the error object
						;(error as any).errorData = errorData

						error.name = "APIError"
						error.message =
							(errorData as any)?.message ||
							(errorData as any)?.error ||
							"An error occurred"
					} catch {
						// If response is not JSON, keep original error
					}
				}
				return error
			},
		],
	},
})

// Authenticated API instance that includes the auth token
export const createAuthenticatedApi = (token?: string) => {
	const authToken = token || getAccessToken()

	return authApi.extend({
		hooks: {
			beforeRequest: [
				(request) => {
					if (authToken) {
						request.headers.set(
							"Authorization",
							`Bearer ${authToken}`
						)
					}
				},
			],
			afterResponse: [
				async (_, __, response) => {
					if (response.status === 401) {
						// Token is invalid, clear auth state
						clearTokensOutside()
						if (typeof window !== "undefined") {
							window.location.href = "/auth/login"
						}
					}
					return response
				},
			],
		},
	})
}
