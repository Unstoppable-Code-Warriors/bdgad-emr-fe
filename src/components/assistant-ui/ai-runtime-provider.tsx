import { type ReactNode } from "react"
import {
	AssistantRuntimeProvider,
	// RuntimeAdapterProvider,
	// unstable_useRemoteThreadListRuntime,
	useLocalRuntime,
	// useThreadListItem,
	type ChatModelAdapter,
	// type ThreadHistoryAdapter,
	// type ThreadMessage,
	// type unstable_RemoteThreadListAdapter,
} from "@assistant-ui/react"
import { OpenAI } from "openai"
// import { db } from "@/utils/db"

// const customDatabaseAdapter: unstable_RemoteThreadListAdapter = {
// 	async list() {
// 		console.log("📋Database adapter: listing threads")
// 		try {
// 			const threads = await db.threads.toArray()
// 			console.log(threads)

// 			return {
// 				threads: threads.map((t) => ({
// 					status: t.archived ? "archived" : "regular",
// 					remoteId: t.id,
// 					title: t.title,
// 				})),
// 			}
// 		} catch (error) {
// 			console.error("❌ Error listing threads:", error)
// 			return { threads: [] }
// 		}
// 	},
// 	async initialize(threadId) {
// 		console.log(
// 			"🆕 Database adapter: initializing new thread with ID:",
// 			threadId
// 		)
// 		try {
// 			// Use the provided threadId directly as the primary key
// 			await db.threads.add({
// 				id: threadId,
// 				title: "New Thread",
// 				archived: false,
// 				createdAt: new Date(),
// 				updatedAt: new Date(),
// 			})
// 			console.log("✅ Thread created successfully with ID:", threadId)
// 			return { remoteId: threadId, externalId: threadId }
// 		} catch (error) {
// 			console.error("❌ Error creating thread:", error)
// 			// If the thread already exists, just return its ID
// 			const existingThread = await db.threads.get(threadId)
// 			if (existingThread) {
// 				console.log(
// 					"♻️ Thread already exists, returning existing ID:",
// 					threadId
// 				)
// 				return { remoteId: threadId, externalId: threadId }
// 			}
// 			throw error
// 		}
// 	},
// 	async rename(remoteId, newTitle) {
// 		console.log(
// 			"📝 Database adapter: renaming thread",
// 			remoteId,
// 			"to",
// 			newTitle
// 		)
// 		await db.threads.update(remoteId, { title: newTitle })
// 	},
// 	async archive(remoteId) {
// 		console.log("📦 Database adapter: archiving thread", remoteId)
// 		await db.threads.update(remoteId, { archived: true })
// 	},
// 	async unarchive(remoteId) {
// 		console.log("📤 Database adapter: unarchiving thread", remoteId)
// 		await db.threads.update(remoteId, { archived: false })
// 	},
// 	async delete(remoteId) {
// 		console.log("🗑️ Database adapter: deleting thread", remoteId)
// 		const messages = await db.messages
// 			.where("threadId")
// 			.equals(remoteId)
// 			.toArray()
// 		await db.threads.delete(remoteId)
// 		await db.messages.bulkDelete(messages.map((m) => m.id))
// 	},
// 	async generateTitle(remoteId, messages) {
// 		console.log(
// 			"🏷️ Database adapter: generating title for thread",
// 			remoteId
// 		)
// 		// generate title from messages
// 		const title = await openai.chat.completions.create({
// 			model: "gpt-5-mini",
// 			messages: messages.map((m) => ({
// 				role: m.role,
// 				content: m.content
// 					.filter((c) => c.type === "text")
// 					.map((c) => c.text)
// 					.join("\n"),
// 			})),
// 			stream: false,
// 		})
// 		await db.threads.update(remoteId, {
// 			title: title.choices[0].message.content || "New Thread",
// 		})
// 		return new ReadableStream()
// 	},
// }

const openai = new OpenAI({
	apiKey: import.meta.env.VITE_OPENAI_API_KEY || "sk-proj-1234567890",
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
	// const runtime = unstable_useRemoteThreadListRuntime({
	// 	runtimeHook: () => {
	// 		return useLocalRuntime(MyModelAdapter)
	// 	},
	// 	adapter: {
	// 		...customDatabaseAdapter,
	// 		unstable_Provider: ({ children }) => {
	// 			const threadListItem = useThreadListItem()
	// 			const remoteId = threadListItem.remoteId
	// 			const history = useMemo<ThreadHistoryAdapter>(
	// 				() => ({
	// 					async load() {
	// 						if (!remoteId) return { messages: [] }
	// 						const messages = await db.messages
	// 							.where("threadId")
	// 							.equals(remoteId)
	// 							.toArray()
	// 						console.log(messages)

	// 						return {
	// 							messages: messages.map((m) => ({
	// 								parentId: m.threadId,
	// 								message: {
	// 									id: m.id,
	// 									content: m.content,
	// 									createdAt: new Date(m.createdAt),
	// 									metadata: {
	// 										custom: {},
	// 									},
	// 									role: m.role,
	// 								} as ThreadMessage,
	// 							})),
	// 						}
	// 					},
	// 					async append({ message }) {
	// 						if (!remoteId) {
	// 							console.warn("No remote ID found")
	// 							return
	// 						}

	// 						await db.messages.add({
	// 							threadId: remoteId,
	// 							role: message.role,
	// 							content: message.content,
	// 							createdAt: message.createdAt,
	// 						})
	// 					},
	// 				}),
	// 				[remoteId]
	// 			)

	// 			const adapters = useMemo(() => ({ history }), [history])

	// 			return (
	// 				<RuntimeAdapterProvider adapters={adapters}>
	// 					{children}
	// 				</RuntimeAdapterProvider>
	// 			)
	// 		},
	// 	},
	// })

	const runtime = useLocalRuntime(MyModelAdapter)

	return (
		<AssistantRuntimeProvider runtime={runtime}>
			{children}
		</AssistantRuntimeProvider>
	)
}
