import type { ReactNode } from "react"
import {
	AssistantRuntimeProvider,
	useLocalRuntime,
	type ChatModelAdapter,
} from "@assistant-ui/react"
import { OpenAI } from "openai"

const openai = new OpenAI({
	apiKey: import.meta.env.VITE_OPENAI_API_KEY,
	dangerouslyAllowBrowser: true, // Use server-side in production
	baseURL: "https://api.yescale.io/v1",
})

const MyModelAdapter: ChatModelAdapter = {
	async *run({ messages, abortSignal }) {
		const stream = await openai.chat.completions.create(
			{
				model: "gpt-5-mini",
				messages: messages.map((m) => ({
					role: m.role,
					content: m.content
						.filter((c) => c.type === "text")
						.map((c) => c.text)
						.join("\n"),
				})),
				stream: true,
			},
			{ signal: abortSignal }
		)

		let fullText = ""
		for await (const chunk of stream) {
			const delta = chunk.choices[0]?.delta
			if (!delta) continue
			if (typeof delta.content === "string" && delta.content.length > 0) {
				fullText += delta.content
				yield { content: [{ type: "text", text: fullText }] }
			}
		}
	},
}

export function AIRuntimeProvider({
	children,
}: Readonly<{
	children: ReactNode
}>) {
	const runtime = useLocalRuntime(MyModelAdapter)

	return (
		<AssistantRuntimeProvider runtime={runtime}>
			{children}
		</AssistantRuntimeProvider>
	)
}
