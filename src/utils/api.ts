import ky from "ky"

// Global ky instance with base configuration
export const authApi = ky.create({
	prefixUrl: "https://auth.bdgad.bio/api/v1",
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 30000, // 30 seconds timeout
	retry: {
		limit: 2,
		methods: ["get", "post"],
	},
})

// Authenticated API instance that includes the auth token
export const createAuthenticatedApi = (token: string) =>
	authApi.extend({
		hooks: {
			beforeRequest: [
				(request) => {
					request.headers.set("Authorization", `Bearer ${token}`)
				},
			],
		},
	})
