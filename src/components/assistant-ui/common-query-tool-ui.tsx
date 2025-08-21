import { makeAssistantToolUI } from "@assistant-ui/react"
import { Spinner } from "../ui/shadcn-io/spinner"
import { Check, CircleX } from "lucide-react"

type CommonQueryArgs = {
	query: string
	purpose: string
}

type CommonQueryResult = {
	success: boolean
	purpose: string
	doctorId: number
	query: string
	data: any
	rowCount: number | "unknown"
	message: string
}

export const CommonQueryToolUI = makeAssistantToolUI<
	CommonQueryArgs,
	CommonQueryResult
>({
	toolName: "commonQuery",
	render: ({ args, status }) => {
		if (status.type === "running") {
			return (
				<div className="flex items-center gap-2 text-xs my-2">
					<Spinner className="text-gray-300 size-4" />
					<span className="text-gray-300">
						{args.purpose
							? args.purpose
							: "Đang thực hiện truy vấn"}
					</span>
				</div>
			)
		}

		if (status.type === "incomplete" && status.reason === "error") {
			return (
				<div className="flex items-center gap-2 text-xs my-2">
					<CircleX className="text-red-500 size-4" />
					<span className="text-red-500">
						Lỗi khi thực hiện truy vấn
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
