"use client"

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
	User,
	Calendar,
	Phone,
	MapPin,
	Briefcase,
	Heart,
	FileText,
	TestTube,
	Pill,
	ArrowLeft,
	Mail,
	Stethoscope,
	Activity,
	Clock,
	Download,
	AlertTriangle,
	Users,
	Building,
} from "lucide-react"
import type { ExtendedInfo } from "@/types/patient"

interface MedicalInfoProps {
	extendedInfo: ExtendedInfo
	onBack?: () => void
}

export function MedicalInfo({ extendedInfo, onBack }: MedicalInfoProps) {
	const { patient, medical_record } = extendedInfo.data

	const formatDate = (dateString: string) => {
		try {
			return new Date(dateString).toLocaleDateString("vi-VN", {
				year: "numeric",
				month: "long",
				day: "numeric",
			})
		} catch {
			return dateString
		}
	}

	const formatDateTime = (dateString: string) => {
		try {
			return new Date(dateString).toLocaleString("vi-VN", {
				year: "numeric",
				month: "long",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			})
		} catch {
			return dateString
		}
	}

	const getGenderLabel = (gender: string) => {
		switch (gender?.toLowerCase()) {
			case "nam":
			case "male":
				return "Nam"
			case "nữ":
			case "female":
				return "Nữ"
			default:
				return gender || "Khác"
		}
	}

	const getMaritalStatusLabel = (status: string) => {
		switch (status?.toLowerCase()) {
			case "single":
			case "độc thân":
				return "Độc thân"
			case "married":
			case "kết hôn":
				return "Kết hôn"
			case "divorced":
			case "ly hôn":
				return "Ly hôn"
			case "widowed":
			case "góa":
				return "Góa"
			default:
				return status || "Không xác định"
		}
	}

	return (
		<div className="h-screen bg-gray-50 overflow-hidden">
			<div className="max-w-7xl mx-auto p-4 h-full flex flex-col space-y-4">
				{/* Simple Header */}
				<div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border flex-shrink-0">
					{onBack && (
						<Button variant="outline" onClick={onBack} className="flex items-center gap-2">
							<ArrowLeft className="h-4 w-4" />
							Quay lại
						</Button>
					)}
					<div className="flex items-center gap-4">
						<div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
							<User className="h-6 w-6 text-blue-600" />
						</div>
						<div>
							<h1 className="text-2xl font-bold text-gray-900">{patient.fullname}</h1>
							<p className="text-gray-500">CCCD: {patient.citizen_id}</p>
						</div>
					</div>
					<div className="text-right">
						<Badge variant="secondary" className="bg-green-100 text-green-800">
							Hồ sơ y tế
						</Badge>
					</div>
				</div>

				{/* Clean Tabs */}
				<Tabs defaultValue="personal" className="w-full flex-1 flex flex-col overflow-hidden">
					<TabsList className="grid w-full grid-cols-4 bg-white p-1 rounded-lg shadow-sm border flex-shrink-0">
						<TabsTrigger value="personal" className="flex items-center gap-2">
							<User className="h-4 w-4" />
							<span className="hidden sm:inline">Thông tin cá nhân</span>
							<span className="sm:hidden">Cá nhân</span>
						</TabsTrigger>
						<TabsTrigger value="medical" className="flex items-center gap-2">
							<Stethoscope className="h-4 w-4" />
							<span className="hidden sm:inline">Hồ sơ khám bệnh</span>
							<span className="sm:hidden">Khám bệnh</span>
						</TabsTrigger>
						<TabsTrigger value="lab" className="flex items-center gap-2">
							<TestTube className="h-4 w-4" />
							<span className="hidden sm:inline">Kết quả xét nghiệm</span>
							<span className="sm:hidden">Xét nghiệm</span>
						</TabsTrigger>
						<TabsTrigger value="prescription" className="flex items-center gap-2">
							<Pill className="h-4 w-4" />
							<span className="hidden sm:inline">Đơn thuốc</span>
							<span className="sm:hidden">Thuốc</span>
						</TabsTrigger>
					</TabsList>

					{/* Personal Information Tab */}
					<TabsContent value="personal" className="mt-4 flex-1 overflow-auto">
						<div className="grid gap-4 lg:grid-cols-2">
							{/* Patient Information */}
							<Card className="shadow-sm border">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-lg">
										<User className="h-5 w-5 text-blue-600" />
										Thông tin bệnh nhân
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{[
										{ icon: User, label: "Họ và tên", value: patient.fullname },
										{ icon: User, label: "Giới tính", value: getGenderLabel(patient.gender) },
										{ icon: Calendar, label: "Ngày sinh", value: formatDate(patient.date_of_birth) },
										{ icon: Users, label: "Dân tộc", value: patient.ethnicity },
										{ icon: MapPin, label: "Quốc tịch", value: patient.nation },
										{ icon: Heart, label: "Tình trạng hôn nhân", value: getMaritalStatusLabel(patient.marital_status) },
										{ icon: Phone, label: "Số điện thoại", value: patient.phone },
										{ icon: Briefcase, label: "Nơi làm việc", value: patient.work_address },
									].map((item, index) => (
										<div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
											<div className="flex items-center gap-3">
												<item.icon className="h-4 w-4 text-gray-500" />
												<span className="text-sm font-medium text-gray-700">{item.label}</span>
											</div>
											<span className="text-sm text-gray-900 font-medium">{item.value}</span>
										</div>
									))}

									<div className="pt-4 border-t">
										<div className="flex items-center gap-3 mb-3">
											<MapPin className="h-4 w-4 text-gray-500" />
											<span className="text-sm font-medium text-gray-700">Địa chỉ</span>
										</div>
										<div className="ml-7 space-y-1">
											<p className="text-sm text-gray-900">{patient.address1}</p>
											{patient.address2 && (
												<p className="text-sm text-gray-600">{patient.address2}</p>
											)}
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Medical History */}
							<Card className="shadow-sm border">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-lg">
										<Heart className="h-5 w-5 text-red-600" />
										Tiền sử bệnh
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-4">
										<div className="p-4 bg-red-50 rounded-lg border border-red-100">
											<div className="flex items-center gap-2 mb-2">
												<AlertTriangle className="h-4 w-4 text-red-600" />
												<span className="text-sm font-medium text-red-900">Dị ứng</span>
											</div>
											<p className="text-sm text-red-800">{patient.allergies || "Không có"}</p>
										</div>

										<div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
											<div className="flex items-center gap-2 mb-2">
												<FileText className="h-4 w-4 text-orange-600" />
												<span className="text-sm font-medium text-orange-900">Tiền sử bệnh cá nhân</span>
											</div>
											<p className="text-sm text-orange-800">{patient.personal_history || "Không có"}</p>
										</div>

										<div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
											<div className="flex items-center gap-2 mb-2">
												<Users className="h-4 w-4 text-yellow-600" />
												<span className="text-sm font-medium text-yellow-900">Tiền sử bệnh gia đình</span>
											</div>
											<p className="text-sm text-yellow-800">{patient.family_history || "Không có"}</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* Medical Record Tab */}
					<TabsContent value="medical" className="mt-4 flex-1 overflow-auto">
						<Card className="shadow-sm border">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-lg">
									<Stethoscope className="h-5 w-5 text-green-600" />
									Hồ sơ khám bệnh
								</CardTitle>
								<CardDescription>Thông tin chi tiết về cuộc khám bệnh</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid gap-4 lg:grid-cols-2">
									<div className="space-y-4">
										{[
											{ icon: Clock, label: "Bắt đầu khám", value: formatDateTime(medical_record.start_at) },
											{ icon: FileText, label: "Lý do khám", value: medical_record.reason },
											{ icon: Stethoscope, label: "Chẩn đoán", value: medical_record.diagnoses },
											{ icon: Activity, label: "Điều trị", value: medical_record.treatment },
											{ icon: Heart, label: "Tình trạng hiện tại", value: medical_record.current_status },
										].map((item, index) => (
											<div key={index} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-b-0">
												<div className="flex items-center gap-3">
													<item.icon className="h-4 w-4 text-gray-500 mt-0.5" />
													<span className="text-sm font-medium text-gray-700">{item.label}</span>
												</div>
												<div className="text-right max-w-xs">
													{item.label === "Chẩn đoán" ? (
														<Badge variant="secondary" className="bg-blue-100 text-blue-800">
															{item.value}
														</Badge>
													) : (
														<span className="text-sm text-gray-900">{item.value}</span>
													)}
												</div>
											</div>
										))}
									</div>

									<div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
										<h4 className="font-medium text-blue-900 mb-4 flex items-center gap-2">
											<User className="h-4 w-4" />
											Bác sĩ phụ trách
										</h4>
										<div className="space-y-3">
											{[
												{ icon: User, label: "Họ tên", value: medical_record.doctor.name },
												{ icon: Mail, label: "Email", value: medical_record.doctor.email },
												{ icon: Phone, label: "Số điện thoại", value: medical_record.doctor.phone },
												{ icon: Building, label: "Địa chỉ", value: medical_record.doctor.address },
											].map((item, index) => (
												<div key={index} className="flex items-center justify-between">
													<div className="flex items-center gap-2">
														<item.icon className="h-3 w-3 text-blue-600" />
														<span className="text-xs font-medium text-blue-700">{item.label}</span>
													</div>
													<span className="text-xs text-blue-900">{item.value}</span>
												</div>
											))}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Lab Tests Tab */}
					<TabsContent value="lab" className="mt-4 flex-1 overflow-auto">
						<div className="space-y-4">
							{medical_record.lab_test.map((test, index) => (
								<Card key={index} className="shadow-sm border">
									<CardHeader>
										<div className="flex items-center justify-between">
											<CardTitle className="flex items-center gap-2 text-lg">
												<TestTube className="h-5 w-5 text-purple-600" />
												{test.test_name}
											</CardTitle>
											<Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
												{test.test_type}
											</Badge>
										</div>
										<CardDescription>
											Thực hiện bằng {test.machine} • Bởi {test.taken_by.name}
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="grid gap-4 lg:grid-cols-2">
											<div className="space-y-4">
												<div className="flex items-center justify-between py-2 border-b border-gray-100">
													<span className="text-sm font-medium text-gray-700">Kết luận</span>
													<Badge variant="secondary" className="bg-green-100 text-green-800">
														{test.conclusion}
													</Badge>
												</div>
												<div>
													<span className="text-sm font-medium text-gray-700">Kết quả thẩm định</span>
													<p className="text-sm text-gray-600 mt-1">{test.notes}</p>
												</div>
											</div>

											<div className="space-y-4">
												<h4 className="text-sm font-medium text-gray-700">Kết quả chi tiết</h4>
												<div className="space-y-2">
													{test.results.map((result, resultIndex) => (
														<div key={resultIndex} className="bg-gray-50 rounded-lg p-3">
															<div className="flex justify-between items-center mb-1">
																<span className="text-sm font-medium text-gray-800">{result.name}</span>
																<Badge variant="outline" className="text-xs">
																	{result.value} {result.units}
																</Badge>
															</div>
															<p className="text-xs text-gray-500">
																Tham chiếu: {result.reference_range}
															</p>
														</div>
													))}
												</div>

												{test.file_attachments && test.file_attachments.length > 0 && (
													<div>
														<h4 className="text-sm font-medium text-gray-700 mb-2">File đính kèm</h4>
														<div className="space-y-2">
															{test.file_attachments.map((file, fileIndex) => (
																<div key={fileIndex} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-100">
																	<div className="flex items-center gap-2">
																		<FileText className="h-4 w-4 text-blue-600" />
																		<div>
																			<p className="text-sm font-medium text-blue-900">{file.filename}</p>
																			<p className="text-xs text-blue-600">{(file.file_size / 1024).toFixed(1)} KB</p>
																		</div>
																	</div>
																	<Button variant="outline" size="sm">
																		<Download className="h-4 w-4" />
																	</Button>
																</div>
															))}
														</div>
													</div>
												)}
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>

					{/* Prescription Tab */}
					<TabsContent value="prescription" className="mt-4 flex-1 overflow-auto">
						<Card className="shadow-sm border">
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle className="flex items-center gap-2 text-lg">
										<Pill className="h-5 w-5 text-green-600" />
										Đơn thuốc
									</CardTitle>
									<Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
										{formatDateTime(medical_record.prescription.issuedDate)}
									</Badge>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-4">
									{medical_record.prescription.medications.map((med, index) => (
										<div key={index} className="border rounded-lg p-4 bg-green-50 border-green-200">
											<div className="flex items-start justify-between mb-3">
												<h5 className="text-lg font-semibold text-green-900">{med.name}</h5>
												<Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
													{med.quantity} viên
												</Badge>
											</div>

											<div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
												{[
													{ label: "Đường dùng", value: med.route },
													{ label: "Liều dùng", value: med.dosage },
													{ label: "Tần suất", value: med.frequency },
													{ label: "Thời gian", value: med.duration },
												].map((item, itemIndex) => (
													<div key={itemIndex} className="flex justify-between items-center py-2 border-b border-green-200 last:border-b-0">
														<span className="text-sm font-medium text-green-700">{item.label}</span>
														<span className="text-sm text-green-900">{item.value}</span>
													</div>
												))}
											</div>

											{med.instruction && (
												<div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
													<div className="flex items-start gap-2">
														<AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
														<div>
															<span className="text-sm font-medium text-yellow-700">Hướng dẫn sử dụng:</span>
															<p className="text-sm text-yellow-800 mt-1">{med.instruction}</p>
														</div>
													</div>
												</div>
											)}
										</div>
									))}
								</div>

								{medical_record.prescription.notes && (
									<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
										<h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
											<FileText className="h-4 w-4" />
											Ghi chú từ bác sĩ
										</h4>
										<p className="text-sm text-blue-800 italic">"{medical_record.prescription.notes}"</p>
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
} 