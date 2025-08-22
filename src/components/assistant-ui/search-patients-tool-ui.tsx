import { makeAssistantToolUI } from "@assistant-ui/react"
import { Spinner } from "../ui/shadcn-io/spinner"
import { CircleX, User, Calendar, MapPin, Hash } from "lucide-react"
import { Card, CardContent } from "../ui/card"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "../ui/hover-card"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip"
import { useNavigate } from "react-router-dom"

type SearchCriteria = {
	name?: string
	citizenId?: string
	gender?: string
	dateOfBirth?: string
	limit?: number // Giới hạn số lượng kết quả
}

type SearchPatientsArgs = {
	searchCriteria: SearchCriteria
	purpose: string
}

type Patient = {
	PatientKey: string
	FullName: string
	DateOfBirth: string
	Gender: string
	citizenID: string
	Address: string
	VisitCount: string
}

type SearchPatientsResult = {
	success: boolean
	purpose: string
	doctorId: number
	searchCriteria: SearchCriteria
	results: Patient[]
	totalFound: number
	message: string
}

export const SearchPatientsToolUI = makeAssistantToolUI<
	SearchPatientsArgs,
	SearchPatientsResult
>({
	toolName: "searchPatients",
	render: ({ args, status, result }) => {
		const navigate = useNavigate()

		const handlePatientClick = (patientKey: string) => {
			navigate(`/patients/${patientKey}`)
		}

		// Compact patient list item component for >2 results
		const CompactPatientItem = ({ patient }: { patient: Patient }) => (
			<HoverCard>
				<HoverCardTrigger asChild>
					<div
						className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-all duration-200 group"
						onClick={() => handlePatientClick(patient.PatientKey)}
					>
						<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
							<User className="size-4 text-blue-600" />
						</div>
						<div className="flex-1 min-w-0">
							<div className="font-medium text-gray-900 truncate">
								{patient.FullName}
							</div>
							<div className="text-xs text-gray-500">
								{patient.Gender} • {patient.DateOfBirth}
							</div>
						</div>
						<div className="text-xs text-gray-400">
							{patient.VisitCount} lần khám
						</div>
					</div>
				</HoverCardTrigger>
				<HoverCardContent className="w-80" side="left">
					<div className="space-y-3">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-blue-100 rounded-full">
								<User className="size-4 text-blue-600" />
							</div>
							<div>
								<div className="font-semibold text-gray-900">
									{patient.FullName}
								</div>
								<div className="text-sm text-gray-500">
									Mã bệnh nhân: {patient.PatientKey}
								</div>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-3 text-sm">
							<div className="flex items-center gap-2">
								<Calendar className="size-3 text-gray-500" />
								<div>
									<div className="text-xs text-gray-500">
										Ngày sinh
									</div>
									<div className="font-medium">
										{patient.DateOfBirth}
									</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Hash className="size-3 text-gray-500" />
								<div>
									<div className="text-xs text-gray-500">
										CCCD
									</div>
									<div className="font-medium font-mono text-xs">
										{patient.citizenID}
									</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<div
									className={`w-3 h-3 rounded-full ${
										patient.Gender === "Nam"
											? "bg-blue-500"
											: "bg-pink-500"
									}`}
								></div>
								<div>
									<div className="text-xs text-gray-500">
										Giới tính
									</div>
									<div className="font-medium">
										{patient.Gender}
									</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-3 h-3 bg-green-500 rounded-full"></div>
								<div>
									<div className="text-xs text-gray-500">
										Số lần khám
									</div>
									<div className="font-medium">
										{patient.VisitCount} lần
									</div>
								</div>
							</div>
						</div>
						<div className="pt-2 border-t">
							<div className="flex items-start gap-2">
								<MapPin className="size-3 text-gray-500 mt-1" />
								<div>
									<div className="text-xs text-gray-500 mb-1">
										Địa chỉ
									</div>
									<div className="text-sm leading-relaxed">
										{patient.Address}
									</div>
								</div>
							</div>
						</div>
					</div>
				</HoverCardContent>
			</HoverCard>
		)

		// Full card component for ≤2 results
		const FullPatientCard = ({ patient }: { patient: Patient }) => (
			<Card
				className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 py-2"
				onClick={() => handlePatientClick(patient.PatientKey)}
			>
				<CardContent className="p-4">
					<div className="flex gap-4">
						{/* Avatar section */}
						<div className="flex-shrink-0">
							<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
								<User className="size-6 text-blue-600" />
							</div>
						</div>

						{/* Main info section */}
						<div className="flex-1 min-w-0">
							{/* Header with name and ID */}
							<div className="flex items-center justify-between mb-3">
								<div>
									<h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-700 transition-colors">
										{patient.FullName}
									</h3>
									<p className="text-xs text-gray-500 font-mono">
										ID: {patient.PatientKey}
									</p>
								</div>
								<div className="text-right">
									<div className="text-xs text-gray-500">
										Số lần khám
									</div>
									<span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
										{patient.VisitCount} lần
									</span>
								</div>
							</div>

							{/* Info grid */}
							<div className="grid grid-cols-2 gap-3 text-xs">
								<div className="flex items-center gap-2">
									<Calendar className="size-3 text-gray-500 flex-shrink-0" />
									<div>
										<div className="text-gray-500">
											Ngày sinh
										</div>
										<div className="font-medium text-gray-900">
											{patient.DateOfBirth}
										</div>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<div
										className={`w-3 h-3 rounded-full flex-shrink-0 ${
											patient.Gender === "Nam"
												? "bg-blue-500"
												: "bg-pink-500"
										}`}
									></div>
									<div>
										<div className="text-gray-500">
											Giới tính
										</div>
										<div className="font-medium text-gray-900">
											{patient.Gender}
										</div>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<Hash className="size-3 text-gray-500 flex-shrink-0" />
									<div>
										<div className="text-gray-500">
											CCCD
										</div>
										<div className="font-medium text-gray-900 font-mono">
											{patient.citizenID}
										</div>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<MapPin className="size-3 text-gray-500 flex-shrink-0" />
									<div className="min-w-0">
										<div className="text-gray-500">
											Địa chỉ
										</div>
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<div className="font-medium text-gray-900 truncate cursor-help">
														{patient.Address}
													</div>
												</TooltipTrigger>
												<TooltipContent>
													<p className="max-w-xs">
														{patient.Address}
													</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</div>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		)

		if (status.type === "running") {
			return (
				<div className="flex items-center gap-2 text-xs mb-2">
					<Spinner className="text-gray-300 size-4" />
					<span className="text-gray-300">
						{args.purpose
							? args.purpose
							: "Đang thực hiện tìm kiếm bệnh nhân"}
					</span>
				</div>
			)
		}

		if (status.type === "incomplete" && status.reason === "error") {
			return (
				<div className="flex items-center gap-2 text-xs mb-2">
					<CircleX className="text-red-500 size-4" />
					<span className="text-red-500">
						Lỗi khi tìm kiếm bệnh nhân
					</span>
				</div>
			)
		}

		return (
			<div className="w-full max-w-md mx-auto mb-4">
				{result?.results && result.results.length > 0 ? (
					<>
						<div className="flex items-center justify-between mb-4">
							<div className="text-sm text-gray-600">
								<span className="font-semibold text-gray-900">
									{result.totalFound || result.results.length}
								</span>{" "}
								bệnh nhân
							</div>
							{result.results.length > 2 && (
								<div className="text-xs text-gray-500">
									Hover để xem chi tiết
								</div>
							)}
						</div>

						{result.results.length <= 2 ? (
							// Show full cards for ≤2 results
							<div className="space-y-3">
								{result.results.map((patient) => (
									<FullPatientCard
										key={patient.PatientKey}
										patient={patient}
									/>
								))}
							</div>
						) : (
							// Show compact list with hover cards for >2 results
							<div className="space-y-2">
								{result.results.map((patient) => (
									<CompactPatientItem
										key={patient.PatientKey}
										patient={patient}
									/>
								))}
							</div>
						)}
					</>
				) : (
					<div className="flex flex-col items-center justify-center py-8 text-center">
						<div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
							<User className="size-6 text-gray-400" />
						</div>
						<div className="text-gray-500 text-sm">
							Không tìm thấy bệnh nhân nào
						</div>
						<div className="text-gray-400 text-xs mt-1">
							Thử điều chỉnh tiêu chí tìm kiếm
						</div>
					</div>
				)}
			</div>
		)
	},
})
