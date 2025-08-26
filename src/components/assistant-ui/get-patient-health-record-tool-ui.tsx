import { makeAssistantToolUI } from "@assistant-ui/react"
import { Spinner } from "../ui/shadcn-io/spinner"
import { Check, CircleX } from "lucide-react"

type RecordType = "exam" | "medical" | "validation"

type PatientSummary = {
	patientKey: number
	fullName: string
	dateOfBirth: string
	gender: string
	citizenId: string
	address: string
	totalVisits: number
	firstVisit: string
	lastVisit: string
}

type GetPatientHealthRecordArgs = {
	patientKey: number
	recordType?: RecordType
	countOnly?: boolean
	includeHistory: boolean
	purpose: string
}

type GetPatientHealthRecordResult = {
	success: boolean
	purpose: string
	doctorId: number
	patientKey: number
	patientSummary?: PatientSummary
	healthRecords?: any[]
	totalRecords?: number
	message?: string
	note: string
	suggestion?: string
	error?: string
}

export const GetPatientHealthRecordToolUI = makeAssistantToolUI<
	GetPatientHealthRecordArgs,
	GetPatientHealthRecordResult
>({
	toolName: "getPatientHealthRecords",
	render: ({ args, status }) => {
		if (status.type === "running") {
			return (
				<div className="flex items-center gap-2 text-xs my-2">
					<Spinner className="text-gray-300 size-4" />
					<span className="text-gray-300">
						{args.purpose
							? args.purpose
							: "Đang lấy thông tin hồ sơ sức khỏe"}
					</span>
				</div>
			)
		}

		if (status.type === "incomplete" && status.reason === "error") {
			return (
				<div className="flex items-center gap-2 text-xs my-2">
					<CircleX className="text-red-500 size-4" />
					<span className="text-red-500">
						{args.purpose
							? args.purpose
							: "Đã xảy ra lỗi khi lấy thông tin hồ sơ sức khỏe"}
					</span>
				</div>
			)
		}

		return (
			<div className="flex items-center gap-2 text-xs my-2">
				<Check className="text-green-600 size-4" />
				<span className="text-green-600">
					{args.purpose
						? args.purpose
						: "Đã lấy thành công thông tin hồ sơ sức khỏe"}
				</span>
			</div>
		)
	},
})
