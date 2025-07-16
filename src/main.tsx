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
import LoginPage from "./apps/auth/login"
import ForgotPasswordPage from "./apps/auth/forgot-password"
import ResetPasswordPage from "./apps/auth/reset-password"
import CallbackPage from "./apps/auth/callback"
import MainLayout from "./apps/(main)/layout"
import PatientsPage from "./apps/(main)/page"
import PatientDetailsPage from "./apps/(main)/[id]/page"

const routes = createBrowserRouter([
	{
		path: "/",
		element: <Outlet />,
		errorElement: <ErrorPage />,
		hydrateFallbackElement: <LoadingScreen />,
		children: [
			{
				// Root redirect to dashboard if authenticated, or login if not
				path: "",
				loader: () => {
					// This will be handled by the auth loader logic
					try {
						return authLoader()
					} catch (redirectResponse) {
						// If auth loader throws redirect, we catch it and handle it
						throw redirectResponse
					}
				},
				element: <MainLayout />,
				children: [
					{
						index: true,
						element: <PatientsPage />,
					},
					{
						path: ":id",
						element: <PatientDetailsPage />,
					},
				],
			},
			{
				path: "auth",
				element: <Outlet />,
				loader: nonAuthLoader,
				children: [
					{
						path: "login",
						element: <LoginPage />,
					},
					{
						path: "forgot-password",
						element: <ForgotPasswordPage />,
					},
					{
						path: "reset-password",
						element: <ResetPasswordPage />,
					},
					{
						path: "callback",
						element: <CallbackPage />,
					},
				],
			},
		],
	},
])

createRoot(document.getElementById("root")!).render(
	// <StrictMode>
	<QueryClientProvider client={queryClient}>
		<Toaster />
		<RouterProvider router={routes} />
		<ReactQueryDevtools initialIsOpen={false} />
	</QueryClientProvider>
	// </StrictMode>
)
