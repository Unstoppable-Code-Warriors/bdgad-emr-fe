import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000, // 5 minutes
			gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
			retry: (failureCount, error) => {
				// Don't retry on 401/403 errors
				if (error instanceof Error && error.message.includes("401")) {
					return false
				}
				if (error instanceof Error && error.message.includes("403")) {
					return false
				}
				// Retry up to 3 times for other errors
				return failureCount < 3
			},
		},
		mutations: {
			retry: false,
		},
	},
})
