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
		<ResizablePanelGroup
			direction="horizontal"
			className="h-full max-h-screen"
		>
			<ResizablePanel>{children}</ResizablePanel>
			<ResizableHandle hidden={!isChatbotOpen} />
			<ResizablePanel
				defaultSize={40}
				maxSize={50}
				minSize={30}
				hidden={!isChatbotOpen}
				className="flex flex-col"
			>
				<Thread />
			</ResizablePanel>
		</ResizablePanelGroup>
	)
}
