import { clearTokensOutside, getAccessToken } from "@/stores/auth.store"
import ky, { HTTPError } from "ky"

export const BASE_URL = "http://localhost:4000/api/v1"

// Create ky instance
export const api = ky.create({
	prefixUrl: BASE_URL,
	timeout: 30000,
	headers: {
		"Content-Type": "application/json",
	},
	hooks: {
		beforeRequest: [
			(request) => {
				const token = getAccessToken()
				if (token) {
					request.headers.set("Authorization", `Bearer ${token}`)
				}
			},
		],
		afterResponse: [
			async (_request, _options, response) => {
				if (response.status === 401) {
					// Token expired or invalid
					clearTokensOutside()
					window.location.href = "/auth/login"
				}
				return response
			},
		],
	},
})

// Generic API response wrapper
export interface ApiResponse<T> {
	data: T
	message?: string
	success?: boolean
}

// Generic pagination response
export interface PaginationResponse<T> {
	data: T[]
	pagination: {
		page: number
		limit: number
		total: number
		totalPages: number
		hasNext: boolean
		hasPrev: boolean
	}
}

// Generic API call helper
export const apiCall = async <T>(
	method: "get" | "post" | "put" | "delete",
	url: string,
	data?: any,
	searchParams?: any
): Promise<T> => {
	try {
		let response

		switch (method) {
			case "get":
				response = await api.get(url, { searchParams })
				break
			case "post":
				response = await api.post(url, { json: data, searchParams })
				break
			case "put":
				response = await api.put(url, { json: data, searchParams })
				break
			case "delete":
				response = await api.delete(url, { searchParams })
				break
			default:
				throw new Error(`Unsupported method: ${method}`)
		}

		return await response.json<T>()
	} catch (error) {
		console.error(`API Error [${method.toUpperCase()} ${url}]:`, error)

		if (error instanceof HTTPError) {
			const errorBody = await error.response.text()
			console.error("Error body:", errorBody)
		}

		throw error
	}
}

export default api
