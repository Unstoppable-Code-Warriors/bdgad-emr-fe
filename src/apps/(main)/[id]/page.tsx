import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
	ArrowLeft,
	Phone,
	Heart,
	Pill,
	AlertTriangle,
	User,
	FileText,
	Activity,
	Stethoscope,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
	usePatient,
	usePatientMedicalRecords,
	usePatientVitalSigns,
} from "@/hooks/use-patients"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export default function PatientDetailsPage() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const [activeTab, setActiveTab] = useState("overview")

	const { data: patient, isLoading, error } = usePatient(id!)
	const { data: medicalRecords, isLoading: recordsLoading } =
		usePatientMedicalRecords(id!)
	const { data: vitalSigns } = usePatientVitalSigns(id!)

	if (isLoading) {
		return (
			<div className="p-6">
				<div className="animate-pulse space-y-4">
					<div className="h-8 bg-gray-200 rounded w-1/4"></div>
					<div className="h-4 bg-gray-200 rounded w-1/2"></div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="space-y-4">
							<div className="h-32 bg-gray-200 rounded"></div>
							<div className="h-48 bg-gray-200 rounded"></div>
						</div>
						<div className="md:col-span-2 space-y-4">
							<div className="h-64 bg-gray-200 rounded"></div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	if (error || !patient) {
		return (
			<div className="p-6">
				<div className="text-center">
					<div className="text-red-600 mb-4">
						Không thể tải thông tin bệnh nhân
					</div>
					<Button onClick={() => navigate("/")}>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Quay lại danh sách
					</Button>
				</div>
			</div>
		)
	}

	const calculateAge = (dateOfBirth: string) => {
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

	const calculateBMI = (weight?: number, height?: number) => {
		if (!weight || !height) return null
		const heightInM = height / 100
		const bmi = weight / (heightInM * heightInM)
		return bmi.toFixed(1)
	}

	const getBMICategory = (bmi: number) => {
		if (bmi < 18.5)
			return { text: "Thiếu cân", color: "bg-blue-100 text-blue-800" }
		if (bmi < 25)
			return { text: "Bình thường", color: "bg-green-100 text-green-800" }
		if (bmi < 30)
			return { text: "Thừa cân", color: "bg-yellow-100 text-yellow-800" }
		return { text: "Béo phì", color: "bg-red-100 text-red-800" }
	}

	const latestVital = vitalSigns?.[0]
	const bmi = calculateBMI(patient.weight, patient.height)

	return (
		<div className="p-6 space-y-6">
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
									<User className="h-4 w-4 text-muted-foreground" />
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
									<Phone className="h-4 w-4 text-muted-foreground" />
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
									<Heart className="h-4 w-4 text-muted-foreground" />
									<div>
										<p className="text-sm text-muted-foreground">
											Nhóm máu
										</p>
										<p className="font-medium">
											{patient.bloodType ||
												"Chưa xác định"}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Quick Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center space-x-2">
							<Activity className="h-8 w-8 text-blue-600" />
							<div>
								<p className="text-sm text-muted-foreground">
									Lần khám cuối
								</p>
								<p className="font-semibold">
									{patient.lastVisit
										? format(
												new Date(patient.lastVisit),
												"dd/MM/yyyy",
												{ locale: vi }
										  )
										: "Chưa có"}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center space-x-2">
							<FileText className="h-8 w-8 text-green-600" />
							<div>
								<p className="text-sm text-muted-foreground">
									Hồ sơ y tế
								</p>
								<p className="font-semibold">
									{medicalRecords?.length || 0} bản ghi
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center space-x-2">
							<Stethoscope className="h-8 w-8 text-purple-600" />
							<div>
								<p className="text-sm text-muted-foreground">
									Bác sĩ phụ trách
								</p>
								<p className="font-semibold">
									{patient.assignedDoctor?.name ||
										"Chưa phân công"}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center space-x-2">
							<AlertTriangle className="h-8 w-8 text-red-600" />
							<div>
								<p className="text-sm text-muted-foreground">
									Dị ứng
								</p>
								<p className="font-semibold">
									{patient.allergies.length} loại
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Main Content Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="overview">Thông tin chung</TabsTrigger>
					<TabsTrigger value="medical-records">
						Hồ sơ y tế
					</TabsTrigger>
					<TabsTrigger value="medications">Phác đồ</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Personal Information */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<User className="h-5 w-5" />
									<span>Thông tin cá nhân</span>
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<p className="text-sm text-muted-foreground">
											Ngày sinh
										</p>
										<p className="font-medium">
											{format(
												new Date(patient.dateOfBirth),
												"dd/MM/yyyy",
												{ locale: vi }
											)}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Email
										</p>
										<p className="font-medium">
											{patient.email || "Chưa có"}
										</p>
									</div>
								</div>

								<div>
									<p className="text-sm text-muted-foreground">
										Địa chỉ
									</p>
									<p className="font-medium">
										{patient.address}
									</p>
								</div>

								<Separator />

								<div>
									<p className="text-sm text-muted-foreground mb-2">
										Liên hệ khẩn cấp
									</p>
									<div className="space-y-2">
										<div className="flex justify-between">
											<span>Tên:</span>
											<span className="font-medium">
												{patient.emergencyContact.name}
											</span>
										</div>
										<div className="flex justify-between">
											<span>Quan hệ:</span>
											<span className="font-medium">
												{
													patient.emergencyContact
														.relationship
												}
											</span>
										</div>
										<div className="flex justify-between">
											<span>SĐT:</span>
											<span className="font-medium">
												{
													patient.emergencyContact
														.phoneNumber
												}
											</span>
										</div>
									</div>
								</div>

								{patient.insurance && (
									<>
										<Separator />
										<div>
											<p className="text-sm text-muted-foreground mb-2">
												Bảo hiểm
											</p>
											<div className="space-y-2">
												<div className="flex justify-between">
													<span>Nhà cung cấp:</span>
													<span className="font-medium">
														{
															patient.insurance
																.provider
														}
													</span>
												</div>
												<div className="flex justify-between">
													<span>Số thẻ:</span>
													<span className="font-medium">
														{
															patient.insurance
																.policyNumber
														}
													</span>
												</div>
												<div className="flex justify-between">
													<span>Hạn đến:</span>
													<span className="font-medium">
														{format(
															new Date(
																patient.insurance.validUntil
															),
															"dd/MM/yyyy",
															{ locale: vi }
														)}
													</span>
												</div>
											</div>
										</div>
									</>
								)}
							</CardContent>
						</Card>

						{/* Medical Overview */}
						<div className="space-y-6">
							{/* Physical Stats */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center space-x-2">
										<Activity className="h-5 w-5" />
										<span>Chỉ số cơ thể</span>
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<p className="text-sm text-muted-foreground">
												Chiều cao
											</p>
											<p className="text-2xl font-bold">
												{patient.height || "--"}{" "}
												<span className="text-sm font-normal">
													cm
												</span>
											</p>
										</div>
										<div>
											<p className="text-sm text-muted-foreground">
												Cân nặng
											</p>
											<p className="text-2xl font-bold">
												{patient.weight || "--"}{" "}
												<span className="text-sm font-normal">
													kg
												</span>
											</p>
										</div>
									</div>

									{bmi && (
										<div className="mt-4">
											<p className="text-sm text-muted-foreground">
												BMI
											</p>
											<div className="flex items-center space-x-2">
												<p className="text-2xl font-bold">
													{bmi}
												</p>
												<Badge
													className={
														getBMICategory(
															parseFloat(bmi)
														).color
													}
												>
													{
														getBMICategory(
															parseFloat(bmi)
														).text
													}
												</Badge>
											</div>
										</div>
									)}

									{latestVital && (
										<div className="mt-4 pt-4 border-t">
											<p className="text-sm text-muted-foreground mb-2">
												Sinh hiệu gần nhất
											</p>
											<div className="grid grid-cols-2 gap-2 text-sm">
												{latestVital.temperature && (
													<div>
														Nhiệt độ:{" "}
														{
															latestVital.temperature
														}
														°C
													</div>
												)}
												{latestVital.bloodPressure && (
													<div>
														Huyết áp:{" "}
														{
															latestVital
																.bloodPressure
																.systolic
														}
														/
														{
															latestVital
																.bloodPressure
																.diastolic
														}
													</div>
												)}
												{latestVital.heartRate && (
													<div>
														Nhịp tim:{" "}
														{latestVital.heartRate}{" "}
														bpm
													</div>
												)}
												{latestVital.oxygenSaturation && (
													<div>
														SpO2:{" "}
														{
															latestVital.oxygenSaturation
														}
														%
													</div>
												)}
											</div>
										</div>
									)}
								</CardContent>
							</Card>

							{/* Allergies */}
							{patient.allergies.length > 0 && (
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center space-x-2">
											<AlertTriangle className="h-5 w-5 text-red-600" />
											<span>Dị ứng</span>
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="flex flex-wrap gap-2">
											{patient.allergies.map(
												(allergy, index) => (
													<Badge
														key={index}
														variant="destructive"
													>
														{allergy}
													</Badge>
												)
											)}
										</div>
									</CardContent>
								</Card>
							)}

							{/* Medical History */}
							{patient.medicalHistory.length > 0 && (
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center space-x-2">
											<FileText className="h-5 w-5" />
											<span>Tiền sử bệnh</span>
										</CardTitle>
									</CardHeader>
									<CardContent>
										<ul className="space-y-2">
											{patient.medicalHistory.map(
												(condition, index) => (
													<li
														key={index}
														className="flex items-center space-x-2"
													>
														<div className="w-2 h-2 bg-blue-600 rounded-full"></div>
														<span>{condition}</span>
													</li>
												)
											)}
										</ul>
									</CardContent>
								</Card>
							)}
						</div>
					</div>
				</TabsContent>

				<TabsContent value="medical-records" className="space-y-4">
					<div className="flex justify-between items-center">
						<h3 className="text-lg font-semibold">
							Hồ sơ khám bệnh
						</h3>
					</div>

					{recordsLoading ? (
						<div className="text-center py-8">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
							<p className="mt-2 text-muted-foreground">
								Đang tải hồ sơ...
							</p>
						</div>
					) : medicalRecords && medicalRecords.length > 0 ? (
						<div className="space-y-4">
							{medicalRecords.map((record) => (
								<Card key={record.id}>
									<CardHeader>
										<div className="flex justify-between items-start">
											<div>
												<CardTitle className="text-base">
													{record.chiefComplaint}
												</CardTitle>
												<p className="text-sm text-muted-foreground">
													{format(
														new Date(
															record.visitDate
														),
														"dd/MM/yyyy HH:mm",
														{ locale: vi }
													)}{" "}
													- {record.doctorName}
												</p>
											</div>
										</div>
									</CardHeader>
									<CardContent className="space-y-4">
										<div>
											<h4 className="font-medium mb-1">
												Bệnh sử hiện tại
											</h4>
											<p className="text-sm text-muted-foreground">
												{record.historyOfPresentIllness}
											</p>
										</div>

										<div>
											<h4 className="font-medium mb-1">
												Khám lâm sàng
											</h4>
											<p className="text-sm text-muted-foreground">
												{record.physicalExamination}
											</p>
										</div>

										<div>
											<h4 className="font-medium mb-1">
												Chẩn đoán
											</h4>
											<p className="text-sm text-muted-foreground">
												{record.assessment}
											</p>
										</div>

										<div>
											<h4 className="font-medium mb-1">
												Kế hoạch điều trị
											</h4>
											<p className="text-sm text-muted-foreground">
												{record.plan}
											</p>
										</div>

										{record.prescription &&
											record.prescription.medications
												.length > 0 && (
												<div>
													<h4 className="font-medium mb-2">
														Đơn thuốc
													</h4>
													<div className="space-y-2">
														{record.prescription.medications.map(
															(med, index) => (
																<div
																	key={index}
																	className="bg-gray-50 p-3 rounded"
																>
																	<div className="flex justify-between items-start">
																		<div>
																			<p className="font-medium">
																				{
																					med.name
																				}{" "}
																				{
																					med.dosage
																				}
																			</p>
																			<p className="text-sm text-muted-foreground">
																				{
																					med.frequency
																				}{" "}
																				-{" "}
																				{
																					med.duration
																				}
																			</p>
																			{med.instructions && (
																				<p className="text-sm text-blue-600">
																					{
																						med.instructions
																					}
																				</p>
																			)}
																		</div>
																	</div>
																</div>
															)
														)}
													</div>
												</div>
											)}
									</CardContent>
								</Card>
							))}
						</div>
					) : (
						<div className="text-center py-8">
							<FileText className="mx-auto h-12 w-12 text-gray-400" />
							<h3 className="mt-2 text-sm font-medium text-gray-900">
								Chưa có hồ sơ khám bệnh
							</h3>
							<p className="mt-1 text-sm text-gray-500">
								Bắt đầu bằng cách thêm bản ghi đầu tiên.
							</p>
						</div>
					)}
				</TabsContent>

				<TabsContent value="medications" className="space-y-4">
					<div className="flex justify-between items-center">
						<h3 className="text-lg font-semibold">
							Phác đồ điều trị
						</h3>
					</div>

					{/* Mock treatment protocol data */}
					<div className="grid gap-4">
						<Card>
							<CardContent className="p-4">
								<div className="flex items-start justify-between">
									<div className="flex items-start space-x-3">
										<Pill className="h-8 w-8 text-blue-600 mt-1" />
										<div className="flex-1">
											<p className="font-medium text-lg">
												Metformin 500mg
											</p>
											<p className="text-sm text-muted-foreground mb-2">
												Thuốc điều trị tiểu đường type 2
											</p>
											<div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
												<div>
													<span className="font-medium">
														Liều dùng:
													</span>{" "}
													2 viên/lần
												</div>
												<div>
													<span className="font-medium">
														Tần suất:
													</span>{" "}
													2 lần/ngày
												</div>
												<div>
													<span className="font-medium">
														Thời gian:
													</span>{" "}
													3 tháng
												</div>
											</div>
											<p className="text-sm text-blue-600 mt-2">
												💊 Uống sau ăn, tránh uống rượu
												bia
											</p>
										</div>
									</div>
									<Badge
										variant="default"
										className="bg-green-100 text-green-800"
									>
										Đang dùng
									</Badge>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-4">
								<div className="flex items-start justify-between">
									<div className="flex items-start space-x-3">
										<Pill className="h-8 w-8 text-purple-600 mt-1" />
										<div className="flex-1">
											<p className="font-medium text-lg">
												Amlodipine 5mg
											</p>
											<p className="text-sm text-muted-foreground mb-2">
												Thuốc hạ huyết áp
											</p>
											<div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
												<div>
													<span className="font-medium">
														Liều dùng:
													</span>{" "}
													1 viên/lần
												</div>
												<div>
													<span className="font-medium">
														Tần suất:
													</span>{" "}
													1 lần/ngày
												</div>
												<div>
													<span className="font-medium">
														Thời gian:
													</span>{" "}
													6 tháng
												</div>
											</div>
											<p className="text-sm text-blue-600 mt-2">
												💊 Uống vào buổi sáng, theo dõi
												huyết áp
											</p>
										</div>
									</div>
									<Badge
										variant="default"
										className="bg-green-100 text-green-800"
									>
										Đang dùng
									</Badge>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-4">
								<div className="flex items-start justify-between">
									<div className="flex items-start space-x-3">
										<Pill className="h-8 w-8 text-orange-600 mt-1" />
										<div className="flex-1">
											<p className="font-medium text-lg">
												Atorvastatin 20mg
											</p>
											<p className="text-sm text-muted-foreground mb-2">
												Thuốc giảm cholesterol
											</p>
											<div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
												<div>
													<span className="font-medium">
														Liều dùng:
													</span>{" "}
													1 viên/lần
												</div>
												<div>
													<span className="font-medium">
														Tần suất:
													</span>{" "}
													1 lần/ngày
												</div>
												<div>
													<span className="font-medium">
														Thời gian:
													</span>{" "}
													6 tháng
												</div>
											</div>
											<p className="text-sm text-blue-600 mt-2">
												💊 Uống vào buổi tối, kiểm tra
												chức năng gan định kỳ
											</p>
										</div>
									</div>
									<Badge
										variant="default"
										className="bg-green-100 text-green-800"
									>
										Đang dùng
									</Badge>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-4">
								<div className="flex items-start justify-between">
									<div className="flex items-start space-x-3">
										<Pill className="h-8 w-8 text-red-600 mt-1" />
										<div className="flex-1">
											<p className="font-medium text-lg">
												Aspirin 100mg
											</p>
											<p className="text-sm text-muted-foreground mb-2">
												Thuốc chống đông máu
											</p>
											<div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
												<div>
													<span className="font-medium">
														Liều dùng:
													</span>{" "}
													1 viên/lần
												</div>
												<div>
													<span className="font-medium">
														Tần suất:
													</span>{" "}
													1 lần/ngày
												</div>
												<div>
													<span className="font-medium">
														Thời gian:
													</span>{" "}
													Dài hạn
												</div>
											</div>
											<p className="text-sm text-blue-600 mt-2">
												💊 Uống sau ăn, theo dõi triệu
												chứng chảy máu
											</p>
										</div>
									</div>
									<Badge
										variant="default"
										className="bg-green-100 text-green-800"
									>
										Đang dùng
									</Badge>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-4">
								<div className="flex items-start justify-between">
									<div className="flex items-start space-x-3">
										<Pill className="h-8 w-8 text-gray-400 mt-1" />
										<div className="flex-1">
											<p className="font-medium text-lg">
												Omeprazole 20mg
											</p>
											<p className="text-sm text-muted-foreground mb-2">
												Thuốc bảo vệ dạ dày
											</p>
											<div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
												<div>
													<span className="font-medium">
														Liều dùng:
													</span>{" "}
													1 viên/lần
												</div>
												<div>
													<span className="font-medium">
														Tần suất:
													</span>{" "}
													1 lần/ngày
												</div>
												<div>
													<span className="font-medium">
														Thời gian:
													</span>{" "}
													Hoàn thành
												</div>
											</div>
											<p className="text-sm text-orange-600 mt-2">
												✅ Đã hoàn thành khóa điều trị 2
												tháng
											</p>
										</div>
									</div>
									<Badge
										variant="secondary"
										className="bg-gray-100 text-gray-800"
									>
										Đã dừng
									</Badge>
								</div>
							</CardContent>
						</Card>

						{/* Treatment notes */}
						<Card className="border-l-4 border-l-blue-500">
							<CardHeader>
								<CardTitle className="text-base flex items-center space-x-2">
									<FileText className="h-4 w-4" />
									<span>Ghi chú điều trị</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start space-x-2">
										<div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
										<span>
											Theo dõi đường huyết và huyết áp
											định kỳ mỗi tuần
										</span>
									</li>
									<li className="flex items-start space-x-2">
										<div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
										<span>
											Kiểm tra chức năng gan, thận sau 3
											tháng
										</span>
									</li>
									<li className="flex items-start space-x-2">
										<div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
										<span>
											Chế độ ăn ít muối, ít đường, tập thể
											dục nhẹ
										</span>
									</li>
									<li className="flex items-start space-x-2">
										<div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
										<span>
											Tái khám sau 1 tháng hoặc khi có
											triệu chứng bất thường
										</span>
									</li>
								</ul>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}
