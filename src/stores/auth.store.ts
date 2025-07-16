import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface AuthTokens {
	token: string
}

interface AuthState {
	tokens: AuthTokens | null
	isLoading: boolean
	isAuthenticated: boolean
}

interface AuthActions {
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
			tokens: null,
			isLoading: false,
			isAuthenticated: false,

			// Actions
			setTokens: (tokens: AuthTokens) =>
				set({
					tokens,
					isAuthenticated: !!tokens,
				}),

			setLoading: (isLoading: boolean) => set({ isLoading }),

			clearAuth: () =>
				set({
					tokens: null,
					isAuthenticated: false,
					isLoading: false,
				}),

			updateToken: (token: string) => {
				const tokens = { token }
				set({
					tokens,
					isAuthenticated: !!tokens,
				})
			},
		}),
		{
			name: "emr-auth-storage",
			partialize: (state) => ({
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

export const setTokensOutside = (token: string): void => {
	useAuthStore.getState().setTokens({ token })
}

export const isUserAuthenticated = (): boolean => {
	const state = useAuthStore.getState()
	return state.isAuthenticated && !!state.tokens
}

export const clearTokensOutside = (): void => {
	useAuthStore.getState().clearAuth()
}

export default useAuthStore
