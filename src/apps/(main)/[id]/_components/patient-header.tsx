import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Patient } from "@/types/patient"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface PatientHeaderProps {
	patient: Patient
}

function calculateAge(dateOfBirth: string) {
	const today = new Date()
	const birth = new Date(dateOfBirth)
	let age = today.getFullYear() - birth.getFullYear()
	const monthDiff = today.getMonth() - birth.getMonth()
	if (
		monthDiff < 0 ||
		(monthDiff === 0 && today.getDate() < birth.getDate())
	) {
		age--
	}
	return age
}

export function PatientHeader({ patient }: PatientHeaderProps) {
	const navigate = useNavigate()

	return (
		<>
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<Button
						variant="ghost"
						onClick={() => navigate("/")}
						className="p-2"
					>
						<ArrowLeft className="h-5 w-5" />
					</Button>
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Chi tiết bệnh nhân
						</h1>
						<p className="text-muted-foreground">
							Cập nhật lần cuối:{" "}
							{format(
								new Date(patient.updatedAt),
								"dd/MM/yyyy HH:mm",
								{ locale: vi }
							)}
						</p>
					</div>
				</div>
			</div>

			{/* Patient Header Card */}
			<Card>
				<CardContent className="p-6">
					<div className="flex items-start space-x-6">
						<Avatar className="h-24 w-24">
							<AvatarImage src="" alt={patient.fullName} />
							<AvatarFallback className="text-lg">
								{patient.fullName
									.split(" ")
									.map((n) => n[0])
									.join("")
									.toUpperCase()}
							</AvatarFallback>
						</Avatar>

						<div className="flex-1 space-y-4">
							<div className="flex items-start justify-between">
								<div>
									<h2 className="text-2xl font-semibold">
										{patient.fullName}
									</h2>
									<p className="text-lg text-muted-foreground">
										{patient.patientCode}
									</p>
								</div>
								<Badge
									variant={
										patient.status === "active"
											? "default"
											: "secondary"
									}
									className="text-sm"
								>
									{patient.status === "active"
										? "Đang điều trị"
										: "Ngưng điều trị"}
								</Badge>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
								<div className="flex items-center space-x-2">
									<div className="h-4 w-4 text-muted-foreground">
										👤
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Tuổi
										</p>
										<p className="font-medium">
											{calculateAge(patient.dateOfBirth)}{" "}
											tuổi
										</p>
									</div>
								</div>

								<div className="flex items-center space-x-2">
									<div className="h-4 w-4 text-muted-foreground">
										{patient.gender === "male" ? "♂" : "♀"}
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Giới tính
										</p>
										<p className="font-medium">
											{patient.gender === "male"
												? "Nam"
												: patient.gender === "female"
												? "Nữ"
												: "Khác"}
										</p>
									</div>
								</div>

								<div className="flex items-center space-x-2">
									<div className="h-4 w-4 text-muted-foreground">
										📞
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Điện thoại
										</p>
										<p className="font-medium">
											{patient.phoneNumber}
										</p>
									</div>
								</div>

								<div className="flex items-center space-x-2">
									<div className="h-4 w-4 text-muted-foreground">
										📅
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Lần khám cuối
										</p>
										<p className="font-medium">
											{patient.lastVisit
												? format(
														new Date(
															patient.lastVisit
														),
														"dd/MM/yyyy",
														{ locale: vi }
												  )
												: "Chưa có"}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</>
	)
}
