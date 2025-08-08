import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ChatbotState {
	isChatbotOpen: boolean
	isHydrated: boolean
}

interface ChatbotActions {
	setOpen: (open: boolean) => void
	toggle: () => void
}

type ChatbotStore = ChatbotState & ChatbotActions

const useChatbotStore = create<ChatbotStore>()(
	persist(
		(set, get) => ({
			isChatbotOpen: false,
			isHydrated: false,

			setOpen: (open: boolean) => set({ isChatbotOpen: open }),
			toggle: () => set({ isChatbotOpen: !get().isChatbotOpen }),
		}),
		{
			name: "emr-chatbot-visibility",
			partialize: (state) => ({
				isChatbotOpen: state.isChatbotOpen,
			}),
			onRehydrateStorage: () => (state) => {
				if (state) state.isHydrated = true
			},
		}
	)
)

export default useChatbotStore
