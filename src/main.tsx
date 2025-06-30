import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { queryClient } from "@/utils/query-client"
import { Toaster } from "@/components/ui/sonner"
import "./styles/global.css"
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"
import ErrorPage from "./apps/404"
import LoadingScreen from "./components/screen/loading-screen"

// Import loaders
import { authLoader, nonAuthLoader } from "./utils/loader"

// Import pages
import LoginPage from "./apps/(auth)/login"
import ForgotPasswordPage from "./apps/(auth)/forgot-password"
import ResetPasswordPage from "./apps/(auth)/reset-password"
import DashboardPage from "./apps/dashboard"

const routes = createBrowserRouter([
	{
		path: "/",
		element: <Outlet />,
		errorElement: <ErrorPage />,
		hydrateFallbackElement: <LoadingScreen />,
		children: [
			{
				// Root redirect to dashboard if authenticated, or login if not
				index: true,
				loader: () => {
					// This will be handled by the auth loader logic
					try {
						return authLoader()
					} catch (redirectResponse) {
						// If auth loader throws redirect, we catch it and handle it
						throw redirectResponse
					}
				},
				element: <DashboardPage />,
			},
			{
				path: "dashboard",
				loader: authLoader,
				element: <DashboardPage />,
			},
			{
				path: "auth",
				element: <Outlet />,
				children: [
					{
						path: "login",
						loader: nonAuthLoader,
						element: <LoginPage />,
					},
					{
						path: "forgot-password",
						loader: nonAuthLoader,
						element: <ForgotPasswordPage />,
					},
					{
						path: "reset-password",
						loader: nonAuthLoader,
						element: <ResetPasswordPage />,
					},
				],
			},
		],
	},
])

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<Toaster />
			<RouterProvider router={routes} />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	</StrictMode>
)
