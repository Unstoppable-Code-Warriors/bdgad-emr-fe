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
	Calendar,
	FileText,
	ArrowLeft,
	MapPin,
	Heart,
	QrCode,
} from "lucide-react"
import { 
	usePatientDetails, 
	useTestResultsByPatientKey,
	useBdgadTestsByPatientKey 
} from "@/hooks/use-patients"
import type { PatientSummary } from "@/types/patient"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { MedicalInfo } from "./medical-info"
import { BdgadTestDetail } from "./bdgad-test-detail"
import { TestResultDetail } from "./test-result-detail"

interface PatientDetailsProps {
	patient: PatientSummary
	onBack?: () => void
}

export function PatientDetails({ patient, onBack }: PatientDetailsProps) {
	const { data: patientDetails } = usePatientDetails(patient.patientKey)
	
	// New API hooks
	const { data: testResults, isLoading: isLoadingTestResults } =
		useTestResultsByPatientKey(patient.patientKey)
	const { data: bdgadTestsData, isLoading: isLoadingBdgadTests } =
		useBdgadTestsByPatientKey(patient.patientKey)
	
	const [showMedicalInfo, setShowMedicalInfo] = useState(false)
	const [selectedBdgadTest, setSelectedBdgadTest] = useState<{ testRunKey: number; testNumber: number } | null>(null)
	const [selectedTestResult, setSelectedTestResult] = useState<{ testRunKey: number; testNumber: number } | null>(null)
	
	console.log("patientDetails", patientDetails)
	console.log("testResults", testResults)
	console.log("bdgadTestsData", bdgadTestsData)

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



	// Show medical info if available and requested
	if (showMedicalInfo && patientDetails?.extendedInfo) {
		return (
			<MedicalInfo
				extendedInfo={patientDetails.extendedInfo}
				onBack={() => setShowMedicalInfo(false)}
			/>
		)
	}

	// Show BDGAD test detail if selected
	if (selectedBdgadTest) {
		return (
			<BdgadTestDetail
				testRunKey={selectedBdgadTest.testRunKey}
				testNumber={selectedBdgadTest.testNumber}
				onBack={() => setSelectedBdgadTest(null)}
			/>
		)
	}

	// Show test result detail if selected
	if (selectedTestResult) {
		return (
			<TestResultDetail
				testRunKey={selectedTestResult.testRunKey}
				testNumber={selectedTestResult.testNumber}
				onBack={() => setSelectedTestResult(null)}
			/>
		)
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
							<div className="flex items-center justify-between">
								<div>
									<h2 className="text-xl font-semibold">
										{patient.fullName}
									</h2>
									<p className="text-muted-foreground">
										PatientID: {patient.patientKey}
									</p>
								</div>
								
								{/* Medical Info Button */}
								{patientDetails?.extendedInfo && (
									<Button
										onClick={() => setShowMedicalInfo(true)}
										variant="outline"
										size="sm"
									>
										<FileText className="h-4 w-4 mr-2" />
										Thông tin y tế
									</Button>
								)}
							</div>

							<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
								<div className="flex items-center gap-2">
									<Calendar className="h-4 w-4 text-muted-foreground" />
									<div>
										<p className="text-sm font-medium">
											Ngày sinh
										</p>
										<p className="text-sm text-muted-foreground">
											{patientDetails?.extendedInfo?.data?.patient?.date_of_birth
												? formatDate(
														patientDetails.extendedInfo.data.patient.date_of_birth
												  )
												: patient.dateOfBirth
												? formatDate(patient.dateOfBirth)
												: "Chưa cập nhật"}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<QrCode className="h-4 w-4 text-muted-foreground" />
									<div>
										<p className="text-sm font-medium">
											Barcode
										</p>
										<p className="text-sm text-muted-foreground font-mono">
											{patient.barcode || "Chưa cập nhật"}
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
											{patient.gender}
										</Badge>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<FileText className="h-4 w-4 text-muted-foreground" />
									<div>
										<p className="text-sm font-medium">
											CCCD
										</p>
										<p className="text-sm text-muted-foreground font-mono">
											{patientDetails?.extendedInfo?.data?.patient?.citizen_id || "Chưa cập nhật"}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<MapPin className="h-4 w-4 text-muted-foreground" />
									<div>
										<p className="text-sm font-medium">
											Quốc gia / Dân tộc
										</p>
										<p className="text-sm text-muted-foreground">
											{patientDetails?.extendedInfo?.data?.patient?.nation || "Chưa cập nhật"} / {patientDetails?.extendedInfo?.data?.patient?.ethnicity || "Chưa cập nhật"}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<Heart className="h-4 w-4 text-muted-foreground" />
									<div>
										<p className="text-sm font-medium">
											Tình trạng hôn nhân
										</p>
										<Badge
											variant="secondary"
											className="mt-1"
										>
											{patientDetails?.extendedInfo?.data?.patient?.marital_status || "Chưa cập nhật"}
										</Badge>
									</div>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Tabs for Test Data */}
			<Tabs defaultValue="bdgad" className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="bdgad">Lịch sử lần khám</TabsTrigger>
					<TabsTrigger value="pharmacy">Kết quả xét nghiệm</TabsTrigger>
				</TabsList>

				<TabsContent value="bdgad" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Lịch sử lần khám</CardTitle>
							<CardDescription>
								Lịch sử các lần khám từ hệ thống BDGAD
							</CardDescription>
						</CardHeader>
						<CardContent>
							{isLoadingBdgadTests ? (
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
							) : bdgadTestsData && bdgadTestsData.data.length > 0 ? (
								<div className="space-y-4">
									{bdgadTestsData.data
										.sort((a, b) => parseInt(a.caseId) - parseInt(b.caseId))
										.map((test, index) => (
										<div 
											key={test.testRunKey} 
											className="p-4 border rounded-lg space-y-3 hover:bg-gray-50 cursor-pointer transition-colors"
											onClick={() => setSelectedBdgadTest({ 
												testRunKey: test.testRunKey, 
												testNumber: index + 1 
											})}
										>
											<div className="flex items-start justify-between">
												<div>
													<h4 className="font-semibold">Lần {index + 1}</h4>
													<div className="flex items-center gap-2 mt-1">
														<Badge variant="outline">Khám BDGAD</Badge>
														<Badge className="bg-blue-100 text-blue-800">
															{test.totalFiles} tệp tin
														</Badge>
													</div>
												</div>
												<div className="text-right text-sm text-muted-foreground">
													<p>Ngày: {formatDate(test.date)}</p>
												</div>
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="text-center text-muted-foreground py-8">
									Chưa có dữ liệu lần khám BDGAD nào.
								</p>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="pharmacy" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Kết quả xét nghiệm</CardTitle>
							<CardDescription>
								Kết quả xét nghiệm và báo cáo từ hệ thống
							</CardDescription>
						</CardHeader>
						<CardContent>
							{isLoadingTestResults ? (
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
							) : testResults && testResults.data.length > 0 ? (
								<div className="space-y-4">
									{testResults.data
										.sort((a, b) => a.testRunKey - b.testRunKey)
										.map((test, index) => (
										<div 
											key={test.testRunKey} 
											className="p-4 border rounded-lg space-y-3 hover:bg-gray-50 cursor-pointer transition-colors"
											onClick={() => setSelectedTestResult({ 
												testRunKey: test.testRunKey, 
												testNumber: index + 1 
											})}
										>
											<div className="flex items-start justify-between">
												<div>
													<h4 className="font-semibold">Lần {index + 1}</h4>
													<div className="flex items-center gap-2 mt-1">
														<Badge variant="outline">Kết quả xét nghiệm</Badge>
														<Badge className="bg-green-100 text-green-800">
															{test.totalFiles} tệp tin
														</Badge>
													</div>
												</div>
												<div className="text-right text-sm text-muted-foreground">
													<p>Ngày: {formatDate(test.date)}</p>
												</div>
											</div>
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
			</Tabs>
		</div>
	)
}
