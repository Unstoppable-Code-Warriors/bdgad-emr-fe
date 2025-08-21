import { makeAssistantToolUI } from "@assistant-ui/react"
import { Spinner } from "../ui/shadcn-io/spinner"
import { Check, CircleX } from "lucide-react"

type ExploreDBAction = "list_databases" | "list_tables" | "describe_table"

type ExploreDBArgs = {
	action: ExploreDBAction
	database?: string
	tableName?: string
}

type ExploreDBResult = {
	success: boolean
	action: ExploreDBAction
	database?: string
	tableName?: string
	data: any
	message: string
}

export const ExploreDBToolUI = makeAssistantToolUI<
	ExploreDBArgs,
	ExploreDBResult
>({
	toolName: "exploreClickHouseSchema",
	render: ({ status }) => {
		if (status.type === "running") {
			return (
				<div className="flex items-center gap-2 text-xs my-2">
					<Spinner className="text-gray-300 size-4" />
					<span className="text-gray-300">
						Đang truy cập vào hệ thống
					</span>
				</div>
			)
		}

		if (status.type === "incomplete" && status.reason === "error") {
			return (
				<div className="flex items-center gap-2 text-xs my-2">
					<CircleX className="text-red-500 size-4" />
					<span className="text-red-500">
						Lỗi khi truy cập vào hệ thống
					</span>
				</div>
			)
		}

		return (
			<div className="flex items-center gap-2 text-xs my-2">
				<Check className="text-green-600 size-4" />
				<span className="text-green-600">Lấy dữ liệu thành công</span>
			</div>
		)
	},
})
