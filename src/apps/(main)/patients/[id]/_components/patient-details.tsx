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
import { User, Calendar, TestTube, FileText, ArrowLeft } from "lucide-react"
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

	const getLocationBadgeColor = (location: string | null) => {
		switch (location?.toLowerCase()) {
			case "pharmacy":
				return "bg-green-100 text-green-800"
			case "bdgad":
				return "bg-blue-100 text-blue-800"
			default:
				return "bg-gray-100 text-gray-800"
		}
	}

	const getLocationLabel = (location: string | null) => {
		switch (location?.toLowerCase()) {
			case "pharmacy":
				return "Pharmacy"
			case "bdgad":
				return "BDGAD"
			default:
				return location || "N/A"
		}
	}

	// Combine and filter data by location
	const getAllTestsByLocation = (targetLocation: string) => {
		const allTests: Array<{
			testKey: number
			testName: string
			testCategory?: string
			dateReceived: string
			dateReported?: string
			diagnosis?: string | null
			variantName?: string | null
			clinicalSignificance?: string | null
			doctorName?: string
			clinicName?: string
			status?: string
			location: string | null
			type: "recent" | "history"
		}> = []

		// Add recent tests
		if (patientDetails?.recentTests) {
			patientDetails.recentTests
				.filter(
					(test) =>
						test.location?.toLowerCase() ===
						targetLocation.toLowerCase()
				)
				.forEach((test) =>
					allTests.push({
						...test,
						type: "recent",
					})
				)
		}

		// Add test history
		if (testHistory) {
			testHistory
				.filter(
					(test) =>
						test.location?.toLowerCase() ===
						targetLocation.toLowerCase()
				)
				.forEach((test) =>
					allTests.push({
						...test,
						type: "history",
					})
				)
		}

		// Remove duplicates based on testKey and sort by date
		const uniqueTests = allTests.filter(
			(test, index, arr) =>
				arr.findIndex((t) => t.testKey === test.testKey) === index
		)

		return uniqueTests.sort(
			(a, b) =>
				new Date(b.dateReceived).getTime() -
				new Date(a.dateReceived).getTime()
		)
	}

	const bdgadTests = getAllTestsByLocation("bdgad")
	const pharmacyTests = getAllTestsByLocation("pharmacy")

	const renderTestItem = (test: any) => (
		<div key={test.testKey} className="p-4 border rounded-lg space-y-3">
			<div className="flex items-start justify-between">
				<div>
					<h4 className="font-semibold">{test.testName}</h4>
					<div className="flex items-center gap-2 mt-1">
						{test.testCategory && (
							<Badge variant="outline">{test.testCategory}</Badge>
						)}
						<Badge className={getLocationBadgeColor(test.location)}>
							{getLocationLabel(test.location)}
						</Badge>
					</div>
				</div>
				<div className="text-right text-sm text-muted-foreground">
					<p>Ngày: {formatDate(test.dateReceived)}</p>
					{test.dateReported && (
						<p>Báo cáo: {formatDate(test.dateReported)}</p>
					)}
					{test.doctorName && <p>BS: {test.doctorName}</p>}
					{test.clinicName && <p>{test.clinicName}</p>}
				</div>
			</div>

			{test.diagnosis && (
				<div>
					<p className="text-sm font-medium mb-1">Chẩn đoán:</p>
					<p className="text-sm text-muted-foreground">
						{test.diagnosis}
					</p>
				</div>
			)}

			{test.variantName && (
				<div className="grid gap-2 md:grid-cols-2">
					<div>
						<p className="text-sm font-medium">Biến thể:</p>
						<p className="text-sm text-muted-foreground">
							{test.variantName}
						</p>
					</div>
					{test.clinicalSignificance && (
						<div>
							<p className="text-sm font-medium">
								Ý nghĩa lâm sàng:
							</p>
							<Badge
								variant={
									test.clinicalSignificance
										.toLowerCase()
										.includes("not detected")
										? "secondary"
										: test.clinicalSignificance
												.toLowerCase()
												.includes("pathogenic")
										? "destructive"
										: "default"
								}
							>
								{test.clinicalSignificance}
							</Badge>
						</div>
					)}
				</div>
			)}

			{test.status && (
				<div className="flex justify-end">
					<Badge className={getTestStatusColor(test.status)}>
						{getTestStatusLabel(test.status)}
					</Badge>
				</div>
			)}
		</div>
	)

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
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Tabs for Location-based Test Data */}
			<Tabs defaultValue="bdgad" className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="bdgad">Lịch sử xét nghiệm</TabsTrigger>
					<TabsTrigger value="pharmacy">Thông tin y tế</TabsTrigger>
				</TabsList>

				<TabsContent value="bdgad" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Lịch sử xét nghiệm</CardTitle>
							<CardDescription>
								Lịch sử xét nghiệm từ hệ thống BDGAD
							</CardDescription>
						</CardHeader>
						<CardContent>
							{isLoadingDetails || isLoadingHistory ? (
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
							) : bdgadTests && bdgadTests.length > 0 ? (
								<div className="space-y-4">
									{bdgadTests.map(renderTestItem)}
								</div>
							) : (
								<p className="text-center text-muted-foreground py-8">
									Chưa có dữ liệu xét nghiệm BDGAD nào.
								</p>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="pharmacy" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Thông tin y tế</CardTitle>
							<CardDescription>
								Thông tin y tế và xét nghiệm từ hệ thống
								Pharmacy
							</CardDescription>
						</CardHeader>
						<CardContent>
							{isLoadingDetails || isLoadingHistory ? (
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
							) : pharmacyTests && pharmacyTests.length > 0 ? (
								<div className="space-y-4">
									{pharmacyTests.map(renderTestItem)}
								</div>
							) : (
								<p className="text-center text-muted-foreground py-8">
									Chưa có thông tin y tế từ Pharmacy nào.
								</p>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
