import { createRoot } from "react-dom/client"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { queryClient } from "@/utils/query-client"
import { Toaster } from "@/components/ui/sonner"
import "./styles/global.css"
// import "./test-api" // Import test API for logging
// import "./debug" // Import debug logging
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"

// console.log("🚀 EMR Frontend Starting...")
// console.log("Environment:", import.meta.env.MODE)

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
import DashboardPage from "./apps/(main)/dashboard/page"
import PatientsPage from "./apps/(main)/patients/page"
import PatientDetailsPage from "./apps/(main)/patients/[id]/page"

const routes = createBrowserRouter([
	{
		path: "/",
		element: <Outlet />,
		errorElement: <ErrorPage />,
		hydrateFallbackElement: <LoadingScreen />,
		children: [
			{
				// Protected routes
				path: "",
				loader: authLoader,
				element: <MainLayout />,
				children: [
					{
						path: "dashboard",
						element: <DashboardPage />,
					},
					{
						path: "patients",
						element: <PatientsPage />,
					},
					{
						path: "patients/:id",
						element: <PatientDetailsPage />,
					},
					{
						index: true,
						element: <DashboardPage />, // Redirect root to dashboard
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

// Global error handlers commented out to prevent reload issues
// window.addEventListener("error", (event) => {
// 	console.error("Global error caught:", event.error)
// })

// window.addEventListener("unhandledrejection", (event) => {
// 	console.error("Unhandled promise rejection:", event.reason)
// })

// console.log("React app initialization complete")
