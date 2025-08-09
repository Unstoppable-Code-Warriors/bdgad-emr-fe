import { Outlet } from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"

import { AppSidebar, AppHeader } from "./_components"
import { AssistantSidebar } from "@/components/assistant-ui/assistant-sidebar"
import { AIRuntimeProvider } from "@/components/assistant-ui/ai-runtime-provider"

export default function MainLayout() {
	return (
		<AIRuntimeProvider>
			<SidebarProvider>
				<AssistantSidebar>
					<div className="h-full min-h-0 w-full flex">
						<AppSidebar />

						<div className="flex-1 flex flex-col min-w-0 min-h-0 w-full">
							<AppHeader />

							{/* Main Content */}
							<main className="flex-1 overflow-auto bg-gray-50 w-full">
								<Outlet />
							</main>
						</div>
					</div>
				</AssistantSidebar>
			</SidebarProvider>
		</AIRuntimeProvider>
	)
}
