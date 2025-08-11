import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable"
import type { FC, PropsWithChildren } from "react"

import { Thread } from "@/components/assistant-ui/thread"
import useChatbotStore from "@/stores/chatbot.store"

export const AssistantSidebar: FC<PropsWithChildren> = ({ children }) => {
	const { isChatbotOpen } = useChatbotStore()
	return (
		<ResizablePanelGroup direction="horizontal" className="h-full min-h-0">
			<ResizablePanel className="min-h-0">{children}</ResizablePanel>
			<ResizableHandle hidden={!isChatbotOpen} />
			<ResizablePanel
				defaultSize={20}
				maxSize={30}
				minSize={30}
				hidden={!isChatbotOpen}
				className="flex flex-col min-h-0"
			>
				<Thread />
			</ResizablePanel>
		</ResizablePanelGroup>
	)
}
