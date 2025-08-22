import { clearTokensOutside, getAccessToken } from "@/stores/auth.store"
import ky, { HTTPError } from "ky"

export const BASE_URL = "https://emr-be.bdgad.bio/api/v1"
export const BE_SERVICE_URL = "https://be.bdgad.bio/api/v1"

// Create ky instance for main API
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

// Create ky instance for external API
export const externalApi = ky.create({
	prefixUrl: BE_SERVICE_URL,
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

// Presigned URL request/response interfaces
export interface PresignedUrlRequest {
	filePath: string
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

// Get presigned URL from external API
export const getPresignedUrl = async (filePath: string): Promise<string> => {
	try {
		const response = await externalApi.post("staff/patient-files/get-presigned-url", {
			json: { filePath }
		})
		return await response.text()
	} catch (error) {
		console.error(`Presigned URL API Error:`, error)

		if (error instanceof HTTPError) {
			const errorBody = await error.response.text()
			console.error("Error body:", errorBody)
		}

		throw error
	}
}

export default api
