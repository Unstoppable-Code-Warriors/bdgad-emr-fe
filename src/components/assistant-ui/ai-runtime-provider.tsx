import { type ReactNode, createContext, useContext } from "react"
import { AssistantRuntimeProvider } from "@assistant-ui/react"
import { useChat } from "@ai-sdk/react"
import { useAISDKRuntime } from "@assistant-ui/react-ai-sdk"
import { getAccessToken } from "@/stores/auth.store"
import { DefaultChatTransport } from "ai"
import { ExploreDBToolUI } from "./explore-db-tool-ui"
import { CommonQueryToolUI } from "./common-query-tool-ui"
import { SearchPatientsToolUI } from "./search-patients-tool-ui"
import { GetPatientHealthRecordToolUI } from "./get-patient-health-record-tool-ui"
import { WebSearchToolUI } from "./web-search-tool-ui"

const AI_API = "https://ai.bdgad.bio"
// const AI_API = "http://localhost:4000/api/v1/ai-chat"

interface ChatContextType {
	chat: ReturnType<typeof useChat>
}

const ChatContext = createContext<ChatContextType | null>(null)

export const useChatContext = () => {
	const context = useContext(ChatContext)
	if (!context) {
		throw new Error("useChatContext must be used within AIRuntimeProvider")
	}
	return context
}

export function AIRuntimeProvider({
	children,
}: Readonly<{
	children: ReactNode
}>) {
	const chat = useChat({
		transport: new DefaultChatTransport({
			api: `${AI_API}/doctor`,
			headers: {
				Authorization: `Bearer ${getAccessToken()}`,
			},
		}),
	})
	const runtime = useAISDKRuntime(chat)

	return (
		<ChatContext.Provider value={{ chat }}>
			<AssistantRuntimeProvider runtime={runtime}>
				{children}
				<ExploreDBToolUI />
				<CommonQueryToolUI />
				<SearchPatientsToolUI />
				<GetPatientHealthRecordToolUI />
				<WebSearchToolUI />
			</AssistantRuntimeProvider>
		</ChatContext.Provider>
	)
}
