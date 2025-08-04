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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
	User,
	MapPin,
	Calendar,
	TestTube,
	FileText,
	ArrowLeft,
} from "lucide-react"
import { usePatientDetails, usePatientTestHistory } from "@/hooks/use-patients"
import type { PatientSummary } from "@/types/patient"
import { cn } from "@/lib/utils"

interface PatientDetailsProps {
	patient: PatientSummary
	onBack?: () => void
}

export function PatientDetails({ patient, onBack }: PatientDetailsProps) {
	const { data: patientDetails, isLoading: isLoadingDetails } =
		usePatientDetails(patient.patientKey)
	const { data: testHistory, isLoading: isLoadingHistory } =
		usePatientTestHistory(patient.patientKey)

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((word) => word[0])
			.join("")
			.toUpperCase()
			.slice(0, 2)
	}

	const formatDate = (dateString: string) => {
		try {
			return new Date(dateString).toLocaleDateString("vi-VN")
		} catch {
			return dateString
		}
	}

	const getGenderBadgeColor = (gender: string | null) => {
		switch (gender?.toLowerCase()) {
			case "male":
				return "bg-blue-100 text-blue-800"
			case "female":
				return "bg-pink-100 text-pink-800"
			default:
				return "bg-gray-100 text-gray-800"
		}
	}

	const getGenderLabel = (gender: string | null) => {
		switch (gender?.toLowerCase()) {
			case "male":
				return "Nam"
			case "female":
				return "Nữ"
			default:
				return "Khác"
		}
	}

	const getTestStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "completed":
				return "bg-green-100 text-green-800"
			case "pending":
				return "bg-yellow-100 text-yellow-800"
			case "cancelled":
				return "bg-red-100 text-red-800"
			default:
				return "bg-gray-100 text-gray-800"
		}
	}

	const getTestStatusLabel = (status: string) => {
		switch (status.toLowerCase()) {
			case "completed":
				return "Hoàn thành"
			case "pending":
				return "Đang xử lý"
			case "cancelled":
				return "Đã hủy"
			default:
				return status
		}
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				{onBack && (
					<Button variant="outline" size="sm" onClick={onBack}>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Quay lại
					</Button>
				)}
				<div>
					<h1 className="text-2xl font-bold">Chi Tiết Bệnh Nhân</h1>
					<p className="text-muted-foreground">
						Thông tin chi tiết và lịch sử xét nghiệm
					</p>
				</div>
			</div>

			{/* Patient Info Card */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<User className="h-5 w-5" />
						Thông Tin Cơ Bản
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-start gap-6">
						<Avatar className="h-24 w-24">
							<AvatarFallback
								className={cn(
									"text-2xl font-bold",
									getGenderBadgeColor(patient.gender)
								)}
							>
								{getInitials(patient.fullName)}
							</AvatarFallback>
						</Avatar>

						<div className="flex-1 space-y-4">
							<div>
								<h2 className="text-xl font-semibold">
									{patient.fullName}
								</h2>
								<p className="text-muted-foreground">
									ID: {patient.patientKey}
								</p>
							</div>

							<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
								<div className="flex items-center gap-2">
									<Calendar className="h-4 w-4 text-muted-foreground" />
									<div>
										<p className="text-sm font-medium">
											Ngày sinh
										</p>
										<p className="text-sm text-muted-foreground">
											{patient.dateOfBirth
												? formatDate(
														patient.dateOfBirth
												  )
												: "Chưa cập nhật"}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<User className="h-4 w-4 text-muted-foreground" />
									<div>
										<p className="text-sm font-medium">
											Giới tính
										</p>
										<Badge
											variant="secondary"
											className="mt-1"
										>
											{getGenderLabel(patient.gender)}
										</Badge>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<TestTube className="h-4 w-4 text-muted-foreground" />
									<div>
										<p className="text-sm font-medium">
											Tổng xét nghiệm
										</p>
										<p className="text-sm text-muted-foreground">
											{patient.totalTests}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<FileText className="h-4 w-4 text-muted-foreground" />
									<div>
										<p className="text-sm font-medium">
											Mã Barcode
										</p>
										<p className="text-sm text-muted-foreground font-mono">
											{patient.barcode}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<Calendar className="h-4 w-4 text-muted-foreground" />
									<div>
										<p className="text-sm font-medium">
											XN gần nhất
										</p>
										<p className="text-sm text-muted-foreground">
											{formatDate(patient.lastTestDate)}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<User className="h-4 w-4 text-muted-foreground" />
									<div>
										<p className="text-sm font-medium">
											Bác sĩ phụ trách
										</p>
										<p className="text-sm text-muted-foreground">
											{patient.doctorName}
										</p>
									</div>
								</div>
							</div>

							{patient.address && (
								<div className="flex items-start gap-2">
									<MapPin className="h-4 w-4 text-muted-foreground mt-1" />
									<div>
										<p className="text-sm font-medium">
											Địa chỉ
										</p>
										<p className="text-sm text-muted-foreground">
											{patient.address}
										</p>
									</div>
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Tabs for Test Results and History */}
			<Tabs defaultValue="recent" className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="recent">Kết Quả Gần Đây</TabsTrigger>
					<TabsTrigger value="history">Lịch Sử XN</TabsTrigger>
				</TabsList>

				<TabsContent value="recent" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Kết Quả Xét Nghiệm Gần Đây</CardTitle>
							<CardDescription>
								5 kết quả xét nghiệm mới nhất
							</CardDescription>
						</CardHeader>
						<CardContent>
							{isLoadingDetails ? (
								<div className="space-y-4">
									{Array.from({ length: 3 }).map((_, i) => (
										<div
											key={i}
											className="p-4 border rounded-lg space-y-2"
										>
											<Skeleton className="h-4 w-60" />
											<Skeleton className="h-3 w-40" />
											<Skeleton className="h-3 w-80" />
										</div>
									))}
								</div>
							) : patientDetails?.recentTests &&
							  patientDetails.recentTests.length > 0 ? (
								<div className="space-y-4">
									{patientDetails.recentTests.map((test) => (
										<div
											key={test.testKey}
											className="p-4 border rounded-lg space-y-3"
										>
											<div className="flex items-start justify-between">
												<div>
													<h4 className="font-semibold">
														{test.testName}
													</h4>
													<Badge
														variant="outline"
														className="mt-1"
													>
														{test.testCategory}
													</Badge>
												</div>
												<div className="text-right text-sm text-muted-foreground">
													<p>
														Nhận mẫu:{" "}
														{formatDate(
															test.dateReceived
														)}
													</p>
													{test.dateReported && (
														<p>
															Báo cáo:{" "}
															{formatDate(
																test.dateReported
															)}
														</p>
													)}
												</div>
											</div>

											{test.diagnosis && (
												<div>
													<p className="text-sm font-medium mb-1">
														Chẩn đoán:
													</p>
													<p className="text-sm text-muted-foreground">
														{test.diagnosis}
													</p>
												</div>
											)}

											{test.variantName && (
												<div className="grid gap-2 md:grid-cols-2">
													<div>
														<p className="text-sm font-medium">
															Biến thể:
														</p>
														<p className="text-sm text-muted-foreground">
															{test.variantName}
														</p>
													</div>
													{test.clinicalSignificance && (
														<div>
															<p className="text-sm font-medium">
																Ý nghĩa lâm
																sàng:
															</p>
															<Badge
																variant={
																	test.clinicalSignificance
																		.toLowerCase()
																		.includes(
																			"not detected"
																		)
																		? "secondary"
																		: test.clinicalSignificance
																				.toLowerCase()
																				.includes(
																					"pathogenic"
																				)
																		? "destructive"
																		: "default"
																}
															>
																{
																	test.clinicalSignificance
																}
															</Badge>
														</div>
													)}
												</div>
											)}
										</div>
									))}
								</div>
							) : (
								<p className="text-center text-muted-foreground py-8">
									Chưa có kết quả xét nghiệm nào.
								</p>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="history" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Lịch Sử Xét Nghiệm</CardTitle>
							<CardDescription>
								Toàn bộ lịch sử xét nghiệm của bệnh nhân
							</CardDescription>
						</CardHeader>
						<CardContent>
							{isLoadingHistory ? (
								<div className="space-y-4">
									{Array.from({ length: 5 }).map((_, i) => (
										<div
											key={i}
											className="flex items-center justify-between p-4 border rounded-lg"
										>
											<div className="space-y-2">
												<Skeleton className="h-4 w-48" />
												<Skeleton className="h-3 w-32" />
											</div>
											<Skeleton className="h-6 w-20" />
										</div>
									))}
								</div>
							) : testHistory && testHistory.length > 0 ? (
								<div className="space-y-4">
									{testHistory.map((test) => (
										<div
											key={test.testKey}
											className="flex items-center justify-between p-4 border rounded-lg"
										>
											<div className="space-y-1">
												<h4 className="font-medium">
													{test.testName}
												</h4>
												<div className="flex items-center gap-4 text-sm text-muted-foreground">
													<span>
														Ngày:{" "}
														{formatDate(
															test.dateReceived
														)}
													</span>
													<span>
														BS: {test.doctorName}
													</span>
													<span>
														{test.clinicName}
													</span>
												</div>
											</div>
											<Badge
												className={getTestStatusColor(
													test.status
												)}
											>
												{getTestStatusLabel(
													test.status
												)}
											</Badge>
										</div>
									))}
								</div>
							) : (
								<p className="text-center text-muted-foreground py-8">
									Chưa có lịch sử xét nghiệm nào.
								</p>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
