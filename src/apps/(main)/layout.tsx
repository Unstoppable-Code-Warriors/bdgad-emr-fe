import { Outlet } from "react-router-dom"
import { useChatRuntime } from "@assistant-ui/react-ai-sdk"
import { SidebarProvider } from "@/components/ui/sidebar"

import { AppSidebar, AppHeader } from "./_components"
import { AssistantRuntimeProvider } from "@assistant-ui/react"
import { AssistantSidebar } from "@/components/assistant-ui/assistant-sidebar"

export default function MainLayout() {
	const runtime = useChatRuntime({
		api: "/api/chat",
	})

	return (
		<AssistantRuntimeProvider runtime={runtime}>
			<SidebarProvider>
				<AssistantSidebar>
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
				</AssistantSidebar>
			</SidebarProvider>
		</AssistantRuntimeProvider>
	)
}
