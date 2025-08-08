import Dexie, { type EntityTable } from "dexie"

interface ThreadRecord {
	id: string
	title: string
	archived: boolean
	createdAt: Date
	updatedAt: Date
}
interface MessageRecord {
	id: string
	threadId: string
	role: "user" | "assistant" | "system"
	content: any
	createdAt: Date
}

const db = new Dexie("AIDatabase") as Dexie & {
	threads: EntityTable<ThreadRecord, "id">
	messages: EntityTable<MessageRecord, "id">
}

db.version(1).stores({
	threads: "++id, title, archived, createdAt, updatedAt",
	messages: "++id, threadId, role, content, createdAt",
})

export type { ThreadRecord, MessageRecord }
export { db }
