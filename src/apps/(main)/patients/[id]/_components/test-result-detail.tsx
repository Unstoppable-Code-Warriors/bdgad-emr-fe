"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { 
	ArrowLeft, 
	User, 
	Calendar, 
	FileText, 
	Download,
	MapPin
} from "lucide-react"
import { useTestResultById } from "@/hooks/use-patients"
import { FileDownloadService } from "@/services/file-download.service"
import { toast } from "sonner"
import { useState } from "react"

interface TestResultDetailProps {
	testRunKey: number
	testNumber: number
	onBack: () => void
}

export function TestResultDetail({ testRunKey, testNumber, onBack }: TestResultDetailProps) {
	const { data: testDetail, isLoading } = useTestResultById(testRunKey)
	const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set())

	const formatDate = (dateString: string) => {
		try {
			return new Date(dateString).toLocaleDateString("vi-VN", {
				year: "numeric",
				month: "long",
				day: "numeric"
			})
		} catch {
			return dateString
		}
	}

	const getGenderLabel = (gender?: string) => {
		switch (gender?.toLowerCase()) {
			case "male":
				return "Nam"
			case "female":
				return "Nữ"
			default:
				return "Không xác định"
		}
	}

	const handleDownloadFile = async (fileUrl: string, fileName?: string) => {
		if (downloadingFiles.has(fileUrl)) return

		setDownloadingFiles(prev => new Set(prev).add(fileUrl))

		try {
			const filename = fileName || FileDownloadService.extractFilenameFromUrl(fileUrl)
			await FileDownloadService.downloadFile(fileUrl, filename, 3600)
			toast.success("Đang tải file...", {
				description: `File ${filename} đang được tải xuống.`
			})
		} catch (error) {
			console.error("Download error:", error)
			toast.error("Lỗi tải file", {
				description: error instanceof Error ? error.message : "Không thể tải file. Vui lòng thử lại sau."
			})
		} finally {
			setDownloadingFiles(prev => {
				const newSet = new Set(prev)
				newSet.delete(fileUrl)
				return newSet
			})
		}
	}

	if (isLoading) {
		return (
			<div className="space-y-6 p-6">
				<div className="flex items-center gap-4">
					<Skeleton className="h-10 w-24" />
					<div className="space-y-2">
						<Skeleton className="h-8 w-64" />
						<Skeleton className="h-4 w-48" />
					</div>
				</div>
				<div className="grid gap-6 lg:grid-cols-2">
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-48" />
						</CardHeader>
						<CardContent className="space-y-4">
							{Array.from({ length: 6 }).map((_, i) => (
								<div key={i} className="flex justify-between">
									<Skeleton className="h-4 w-24" />
									<Skeleton className="h-4 w-32" />
								</div>
							))}
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-32" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-32 w-full" />
						</CardContent>
					</Card>
				</div>
			</div>
		)
	}

	if (!testDetail) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
				<FileText className="h-16 w-16 text-gray-400" />
				<h3 className="text-lg font-semibold text-gray-900">Không tìm thấy dữ liệu</h3>
				<p className="text-gray-500 text-center">
					Không thể tải thông tin chi tiết của kết quả xét nghiệm này.
				</p>
				<Button onClick={onBack} variant="outline">
					<ArrowLeft className="h-4 w-4 mr-2" />
					Quay lại
				</Button>
			</div>
		)
	}

	return (
		<div className="space-y-6 p-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Button onClick={onBack} variant="outline" size="sm">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Quay lại
					</Button>
					<div>
						<h1 className="text-2xl font-bold">Kết quả xét nghiệm lần {testNumber}</h1>
						<p className="text-muted-foreground">
							Ngày thực hiện: {formatDate(testDetail.date)}
						</p>
					</div>
				</div>
				<Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
					Test Result #{testDetail.testRunKey}
				</Badge>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				{/* Patient Information */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<User className="h-5 w-5 text-blue-600" />
							Thông tin bệnh nhân
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-3">
							<div className="flex justify-between items-center py-2 border-b border-gray-100">
								<div className="flex items-center gap-2">
									<User className="h-4 w-4 text-gray-500" />
									<span className="text-sm font-medium text-gray-700">Họ và tên</span>
								</div>
								<span className="text-sm font-semibold text-gray-900">{testDetail.patient.name}</span>
							</div>

							<div className="flex justify-between items-center py-2 border-b border-gray-100">
								<div className="flex items-center gap-2">
									<FileText className="h-4 w-4 text-gray-500" />
									<span className="text-sm font-medium text-gray-700">CCCD</span>
								</div>
								<span className="text-sm font-mono text-gray-900">{testDetail.patient.citizenId}</span>
							</div>

							{testDetail.patient.dateOfBirth && (
								<div className="flex justify-between items-center py-2 border-b border-gray-100">
									<div className="flex items-center gap-2">
										<Calendar className="h-4 w-4 text-gray-500" />
										<span className="text-sm font-medium text-gray-700">Ngày sinh</span>
									</div>
									<span className="text-sm text-gray-900">{formatDate(testDetail.patient.dateOfBirth)}</span>
								</div>
							)}

							{testDetail.patient.gender && (
								<div className="flex justify-between items-center py-2 border-b border-gray-100">
									<div className="flex items-center gap-2">
										<User className="h-4 w-4 text-gray-500" />
										<span className="text-sm font-medium text-gray-700">Giới tính</span>
									</div>
									<Badge variant="secondary">{getGenderLabel(testDetail.patient.gender)}</Badge>
								</div>
							)}

							{testDetail.patient.address && (
								<div className="py-2">
									<div className="flex items-center gap-2 mb-2">
										<MapPin className="h-4 w-4 text-gray-500" />
										<span className="text-sm font-medium text-gray-700">Địa chỉ</span>
									</div>
									<p className="text-sm text-gray-900 ml-6">{testDetail.patient.address}</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* EHR Files */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<FileText className="h-5 w-5 text-purple-600" />
							File kết quả
						</CardTitle>
					</CardHeader>
					<CardContent>
						{testDetail.ehrUrls && testDetail.ehrUrls.length > 0 ? (
							<div className="space-y-3">
								<p className="text-sm text-gray-600 mb-4">
									Có {testDetail.ehrUrls.length} file kết quả xét nghiệm
								</p>
								<div className="grid gap-3">
									{testDetail.ehrUrls.map((fileUrl, index) => {
										const fileName = FileDownloadService.extractFilenameFromUrl(fileUrl)
										const isDownloading = downloadingFiles.has(fileUrl)
										
										return (
											<div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
												<div className="flex items-center gap-3">
													<FileText className="h-5 w-5 text-purple-600" />
													<div>
														<p className="text-sm font-medium text-gray-900">
															{fileName}
														</p>
														<p className="text-xs text-gray-500">
															File kết quả #{index + 1}
														</p>
													</div>
												</div>
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleDownloadFile(fileUrl, fileName)}
													disabled={isDownloading}
													className="flex items-center gap-2"
												>
													<Download className="h-4 w-4" />
													{isDownloading ? "Đang tải..." : "Tải xuống"}
												</Button>
											</div>
										)
									})}
								</div>
							</div>
						) : (
							<div className="text-center py-8">
								<FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
								<p className="text-sm text-gray-500">Chưa có file kết quả</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>


		</div>
	)
} 