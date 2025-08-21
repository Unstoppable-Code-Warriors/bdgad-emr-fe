"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, FileText, TestTube, User } from "lucide-react"
import {
	useTestResultsByPatientKey,
	useTestResultById,
	useBdgadTestsByPatientKey,
	useBdgadTestById,
} from "@/hooks/use-patients"
import { useState } from "react"

interface TestResultsExampleProps {
	patientId: number
}

export function TestResultsExample({ patientId }: TestResultsExampleProps) {
	const [selectedTestRunKey, setSelectedTestRunKey] = useState<number | null>(null)
	const [selectedBdgadTestRunKey, setSelectedBdgadTestRunKey] = useState<number | null>(null)

	// Fetch test results list
	const { data: testResults, isLoading: isLoadingTestResults } =
		useTestResultsByPatientKey(patientId)

	// Fetch BDGAD tests list
	const { data: bdgadTests, isLoading: isLoadingBdgadTests } =
		useBdgadTestsByPatientKey(patientId)

	// Fetch specific test result details
	const { data: testResultDetails, isLoading: isLoadingTestResultDetails } =
		useTestResultById(selectedTestRunKey || 0)

	// Fetch specific BDGAD test details
	const { data: bdgadTestDetails, isLoading: isLoadingBdgadTestDetails } =
		useBdgadTestById(selectedBdgadTestRunKey || 0)

	const formatDate = (dateString: string) => {
		try {
			return new Date(dateString).toLocaleDateString("vi-VN")
		} catch {
			return dateString
		}
	}

	return (
		<div className="space-y-6">
			{/* Test Results Section */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<TestTube className="h-5 w-5 text-purple-600" />
						Kết quả xét nghiệm
					</CardTitle>
				</CardHeader>
				<CardContent>
					{isLoadingTestResults ? (
						<div className="space-y-3">
							{Array.from({ length: 3 }).map((_, i) => (
								<Skeleton key={i} className="h-16 w-full" />
							))}
						</div>
					) : testResults && testResults.data.length > 0 ? (
						<div className="space-y-3">
							{testResults.data.map((result) => (
								<div
									key={result.testRunKey}
									className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
									onClick={() => setSelectedTestRunKey(result.testRunKey)}
								>
									<div className="flex items-center gap-3">
										<Calendar className="h-4 w-4 text-gray-500" />
										<div>
											<p className="font-medium">Test Run #{result.testRunKey}</p>
											<p className="text-sm text-gray-500">
												{formatDate(result.date)}
											</p>
										</div>
									</div>
									<Badge variant="outline">
										{result.totalFiles} files
									</Badge>
								</div>
							))}
						</div>
					) : (
						<p className="text-center text-gray-500 py-4">
							Không có kết quả xét nghiệm nào.
						</p>
					)}
				</CardContent>
			</Card>

			{/* BDGAD Tests Section */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<FileText className="h-5 w-5 text-blue-600" />
						BDGAD Tests
					</CardTitle>
				</CardHeader>
				<CardContent>
					{isLoadingBdgadTests ? (
						<div className="space-y-3">
							{Array.from({ length: 3 }).map((_, i) => (
								<Skeleton key={i} className="h-16 w-full" />
							))}
						</div>
					) : bdgadTests && bdgadTests.data.length > 0 ? (
						<div className="space-y-3">
							{bdgadTests.data.map((test) => (
								<div
									key={test.testRunKey}
									className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
									onClick={() => setSelectedBdgadTestRunKey(test.testRunKey)}
								>
									<div className="flex items-center gap-3">
										<Calendar className="h-4 w-4 text-gray-500" />
										<div>
											<p className="font-medium">Case ID: {test.caseId}</p>
											<p className="text-sm text-gray-500">
												{formatDate(test.date)}
											</p>
										</div>
									</div>
									<Badge variant="outline">
										{test.totalFiles} files
									</Badge>
								</div>
							))}
						</div>
					) : (
						<p className="text-center text-gray-500 py-4">
							Không có BDGAD test nào.
						</p>
					)}
				</CardContent>
			</Card>

			{/* Test Result Details */}
			{selectedTestRunKey && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TestTube className="h-5 w-5 text-purple-600" />
							Chi tiết kết quả xét nghiệm #{selectedTestRunKey}
						</CardTitle>
					</CardHeader>
					<CardContent>
						{isLoadingTestResultDetails ? (
							<div className="space-y-3">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-4 w-1/2" />
							</div>
						) : testResultDetails ? (
							<div className="space-y-4">
								<div className="grid gap-4 md:grid-cols-2">
									<div>
										<h4 className="font-medium mb-2 flex items-center gap-2">
											<User className="h-4 w-4" />
											Thông tin bệnh nhân
										</h4>
										<div className="space-y-1 text-sm">
											<p><strong>Tên:</strong> {testResultDetails.patient.name}</p>
											<p><strong>CCCD:</strong> {testResultDetails.patient.citizenId}</p>
											{testResultDetails.patient.dateOfBirth && (
												<p><strong>Ngày sinh:</strong> {formatDate(testResultDetails.patient.dateOfBirth)}</p>
											)}
											{testResultDetails.patient.gender && (
												<p><strong>Giới tính:</strong> {testResultDetails.patient.gender}</p>
											)}
											{testResultDetails.patient.address && (
												<p><strong>Địa chỉ:</strong> {testResultDetails.patient.address}</p>
											)}
										</div>
									</div>
									<div>
										<h4 className="font-medium mb-2">EHR URLs</h4>
										<div className="space-y-1">
											{testResultDetails.ehrUrls.map((url, index) => (
												<Button
													key={index}
													variant="outline"
													size="sm"
													className="w-full justify-start"
													onClick={() => window.open(url, '_blank')}
												>
													<FileText className="h-4 w-4 mr-2" />
													File {index + 1}
												</Button>
											))}
										</div>
									</div>
								</div>
							</div>
						) : (
							<p className="text-center text-gray-500 py-4">
								Không thể tải chi tiết kết quả xét nghiệm.
							</p>
						)}
					</CardContent>
				</Card>
			)}

			{/* BDGAD Test Details */}
			{selectedBdgadTestRunKey && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<FileText className="h-5 w-5 text-blue-600" />
							Chi tiết BDGAD Test #{selectedBdgadTestRunKey}
						</CardTitle>
					</CardHeader>
					<CardContent>
						{isLoadingBdgadTestDetails ? (
							<div className="space-y-3">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-4 w-1/2" />
							</div>
						) : bdgadTestDetails ? (
							<div className="space-y-4">
								<div className="grid gap-4 md:grid-cols-2">
									<div>
										<h4 className="font-medium mb-2 flex items-center gap-2">
											<User className="h-4 w-4" />
											Thông tin bệnh nhân
										</h4>
										<div className="space-y-1 text-sm">
											<p><strong>Tên:</strong> {bdgadTestDetails.patient.name}</p>
											<p><strong>CCCD:</strong> {bdgadTestDetails.patient.citizenId}</p>
											{bdgadTestDetails.patient.dateOfBirth && (
												<p><strong>Ngày sinh:</strong> {formatDate(bdgadTestDetails.patient.dateOfBirth)}</p>
											)}
											{bdgadTestDetails.patient.gender && (
												<p><strong>Giới tính:</strong> {bdgadTestDetails.patient.gender}</p>
											)}
											{bdgadTestDetails.patient.address && (
												<p><strong>Địa chỉ:</strong> {bdgadTestDetails.patient.address}</p>
											)}
										</div>
									</div>
									<div>
										<h4 className="font-medium mb-2">Lab Codes</h4>
										<div className="space-y-1">
											{bdgadTestDetails.labCodes && bdgadTestDetails.labCodes.length > 0 ? (
												bdgadTestDetails.labCodes.map((code, index) => (
													<Badge key={index} variant="outline">
														{JSON.stringify(code)}
													</Badge>
												))
											) : (
												<p className="text-sm text-gray-500">Không có lab codes</p>
											)}
										</div>
									</div>
								</div>
							</div>
						) : (
							<p className="text-center text-gray-500 py-4">
								Không thể tải chi tiết BDGAD test.
							</p>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	)
} 