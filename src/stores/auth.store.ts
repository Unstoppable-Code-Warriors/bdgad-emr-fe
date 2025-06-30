import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Role } from "@/utils/constant"

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

export interface AuthTokens {
	token: string
}

interface AuthState {
	user: User | null
	tokens: AuthTokens | null
	isLoading: boolean
	isAuthenticated: boolean
}

interface AuthActions {
	setUser: (user: User) => void
	setTokens: (tokens: AuthTokens) => void
	setLoading: (loading: boolean) => void
	clearAuth: () => void
	updateToken: (token: string) => void
}

type AuthStore = AuthState & AuthActions

const useAuthStore = create<AuthStore>()(
	persist(
		(set) => ({
			// Initial state
			user: null,
			tokens: null,
			isLoading: false,
			isAuthenticated: false,

			// Actions
			setUser: (user: User) =>
				set((state) => ({
					user,
					isAuthenticated:
						!!user && !!state.tokens && user.status === "active",
				})),

			setTokens: (tokens: AuthTokens) =>
				set((state) => ({
					tokens,
					isAuthenticated:
						!!state.user &&
						!!tokens &&
						state.user?.status === "active",
				})),

			setLoading: (isLoading: boolean) => set({ isLoading }),

			clearAuth: () =>
				set({
					user: null,
					tokens: null,
					isAuthenticated: false,
					isLoading: false,
				}),

			updateToken: (token: string) => {
				const tokens = { token }
				set((state) => ({
					tokens,
					isAuthenticated:
						!!state.user &&
						!!tokens &&
						state.user?.status === "active",
				}))
			},
		}),
		{
			name: "emr-auth-storage",
			partialize: (state) => ({
				user: state.user,
				tokens: state.tokens,
				isAuthenticated: state.isAuthenticated,
			}),
		}
	)
)

// Utility functions for use outside components
export const getAccessToken = (): string | null => {
	const state = useAuthStore.getState()
	return state.tokens?.token || null
}

export const isUserAuthenticated = (): boolean => {
	const state = useAuthStore.getState()

	if (!state.user || !state.tokens || state.user.status !== "active") {
		return false
	}

	// Check if user has doctor role (Role.DOCTOR = 5)
	const hasDoctorRole = state.user.roles.some(
		(role) => parseInt(role.code) === Role.DOCTOR
	)

	if (!hasDoctorRole) {
		return false
	}

	return state.isAuthenticated
}

export const getCurrentUser = (): User | null => {
	const state = useAuthStore.getState()
	return state.user
}

export const clearTokensOutside = (): void => {
	useAuthStore.getState().clearAuth()
}

export const hasUserDoctorRole = (): boolean => {
	const state = useAuthStore.getState()
	if (!state.user) return false

	return state.user.roles.some((role) => parseInt(role.code) === Role.DOCTOR)
}

export default useAuthStore
