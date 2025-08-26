import { makeAssistantToolUI } from "@assistant-ui/react"
import { Spinner } from "../ui/shadcn-io/spinner"
import { Check, CircleX } from "lucide-react"

type WebSearchArgs = {}

type WebSearchResult = {}

export const WebSearchToolUI = makeAssistantToolUI<
	WebSearchArgs,
	WebSearchResult
>({
	toolName: "web_search_preview",
	render: ({ status }) => {
		if (status.type === "running") {
			return (
				<div className="flex items-center gap-2 text-xs my-2">
					<Spinner className="text-gray-300 size-4" />
					<span className="text-gray-300">
						Đang tìm kiếm thông tin
					</span>
				</div>
			)
		}

		if (status.type === "incomplete" && status.reason === "error") {
			return (
				<div className="flex items-center gap-2 text-xs my-2">
					<CircleX className="text-red-500 size-4" />
					<span className="text-red-500">
						Đã xảy ra lỗi khi tìm kiếm thông tin
					</span>
				</div>
			)
		}

		return (
			<div className="flex items-center gap-2 text-xs my-2">
				<Check className="text-green-600 size-4" />
				<span className="text-green-600">
					Tìm kiếm thông tin thành công
				</span>
			</div>
		)
	},
})
