import { Outlet } from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"

// Import components
import { AppSidebar, AppHeader } from "./_components"

export default function MainLayout() {
	return (
		<SidebarProvider>
			<div className="min-h-screen w-full flex">
				<AppSidebar />

				<div className="flex-1 flex flex-col min-w-0 w-full">
					<AppHeader />

					{/* Main Content */}
					<main className="flex-1 overflow-auto bg-gray-50 w-full">
						<Outlet />
					</main>
				</div>
			</div>
		</SidebarProvider>
	)
}
