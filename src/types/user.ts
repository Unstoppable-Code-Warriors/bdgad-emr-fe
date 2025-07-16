// Types for API response
export interface UserRole {
	id: number
	name: string
	code: string
}

export interface UserMetadata {
	phone: string
	address: string
}

export interface User {
	id: number
	email: string
	name: string
	status: "active" | "inactive"
	roles: UserRole[]
	metadata?: UserMetadata
}
