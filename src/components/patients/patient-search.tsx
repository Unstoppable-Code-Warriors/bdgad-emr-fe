"use client"

import { useState, useCallback } from "react"
import * as React from "react"
import { format } from "date-fns"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import {
	Search,
	User,
	Calendar as CalendarIcon,
	TestTube,
	ChevronLeft,
	ChevronRight,
	Eye,
	ChevronDown,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { usePatients } from "@/hooks/use-patients"
import type { PatientSearchParams, PatientSummary } from "@/types/patient"
import { EmptyState } from "@/components/ui/empty-state"
import { cn } from "@/lib/utils"

interface PatientSearchProps {
	onPatientSelect?: (patient: PatientSummary) => void
}

export function PatientSearch({ onPatientSelect }: PatientSearchProps) {
	const navigate = useNavigate()
	const [searchParams, setSearchParams] = useState<PatientSearchParams>({
		page: 1,
		limit: 10,
		sortBy: "lastTestDate",
		sortOrder: "DESC",
	})

	const [localSearch, setLocalSearch] = useState({
		name: "",
		barcode: "",
		dateFrom: undefined as Date | undefined,
		dateTo: undefined as Date | undefined,
	})

	const { data: patientsData, isLoading, error } = usePatients(searchParams)

	const handleSearch = useCallback(() => {
		setSearchParams((prev) => ({
			...prev,
			name: localSearch.name,
			barcode: localSearch.barcode,
			dateFrom: localSearch.dateFrom
				? format(localSearch.dateFrom, "yyyy-MM-dd")
				: undefined,
			dateTo: localSearch.dateTo
				? format(localSearch.dateTo, "yyyy-MM-dd")
				: undefined,
			page: 1, // Reset to first page when searching
		}))
	}, [localSearch])

	const handleClearSearch = useCallback(() => {
		setLocalSearch({
			name: "",
			barcode: "",
			dateFrom: undefined,
			dateTo: undefined,
		})
		setSearchParams({
			page: 1,
			limit: 10,
			sortBy: "lastTestDate",
			sortOrder: "DESC",
		})
	}, [])

	const handlePageChange = useCallback((newPage: number) => {
		setSearchParams((prev) => ({ ...prev, page: newPage }))
	}, [])

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

	if (error) {
		return (
			<Card>
				<CardContent className="pt-6">
					<p className="text-center text-red-600">
						Lỗi khi tải danh sách bệnh nhân. Vui lòng thử lại.
					</p>
				</CardContent>
			</Card>
		)
	}

	// Date picker component
	const DatePicker = ({
		date,
		onSelect,
		placeholder = "Chọn ngày...",
	}: {
		date: Date | undefined
		onSelect: (date: Date | undefined) => void
		placeholder?: string
	}) => {
		const [open, setOpen] = React.useState(false)

		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						className={cn(
							"w-full justify-between text-left font-normal",
							!date && "text-muted-foreground"
						)}
					>
						<div className="flex items-center">
							<CalendarIcon className="mr-2 h-4 w-4" />
							{date ? format(date, "dd/MM/yyyy") : placeholder}
						</div>
						<ChevronDown className="h-4 w-4 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="w-auto overflow-hidden p-0"
					align="start"
				>
					<Calendar
						mode="single"
						selected={date}
						captionLayout="dropdown"
						fromYear={1900}
						toYear={new Date().getFullYear()}
						onSelect={(selectedDate) => {
							onSelect(selectedDate)
							setOpen(false)
						}}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
		)
	}

	return (
		<div className="space-y-6">
			{/* Search Header */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Search className="h-5 w-5" />
						Tìm Kiếm Bệnh Nhân
					</CardTitle>
					<CardDescription>
						Tìm kiếm bệnh nhân theo tên, mã barcode hoặc khoảng thời
						gian
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						<div className="space-y-2">
							<label className="text-sm font-medium">
								Tên bệnh nhân
							</label>
							<Input
								placeholder="Nhập tên bệnh nhân..."
								value={localSearch.name}
								onChange={(e) =>
									setLocalSearch((prev) => ({
										...prev,
										name: e.target.value,
									}))
								}
								onKeyDown={(e) =>
									e.key === "Enter" && handleSearch()
								}
							/>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium">
								Mã Barcode
							</label>
							<Input
								placeholder="Nhập mã barcode..."
								value={localSearch.barcode}
								onChange={(e) =>
									setLocalSearch((prev) => ({
										...prev,
										barcode: e.target.value,
									}))
								}
								onKeyDown={(e) =>
									e.key === "Enter" && handleSearch()
								}
							/>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium">
								Từ ngày
							</label>
							<DatePicker
								date={localSearch.dateFrom}
								onSelect={(date) =>
									setLocalSearch((prev) => ({
										...prev,
										dateFrom: date,
									}))
								}
								placeholder="Chọn ngày bắt đầu..."
							/>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium">
								Đến ngày
							</label>
							<DatePicker
								date={localSearch.dateTo}
								onSelect={(date) =>
									setLocalSearch((prev) => ({
										...prev,
										dateTo: date,
									}))
								}
								placeholder="Chọn ngày kết thúc..."
							/>
						</div>
					</div>

					<div className="flex gap-2 mt-4">
						<Button
							onClick={handleSearch}
							className="flex items-center gap-2"
						>
							<Search className="h-4 w-4" />
							Tìm kiếm
						</Button>
						<Button variant="outline" onClick={handleClearSearch}>
							Xóa bộ lọc
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Results */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Danh Sách Bệnh Nhân</CardTitle>
							<CardDescription>
								{patientsData
									? `Tìm thấy ${patientsData.pagination.total} bệnh nhân`
									: "Đang tải..."}
							</CardDescription>
						</div>

						{patientsData && (
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<span>Sắp xếp:</span>
								<Select
									value={searchParams.sortBy}
									onValueChange={(value: any) =>
										setSearchParams((prev) => ({
											...prev,
											sortBy: value,
										}))
									}
								>
									<SelectTrigger className="w-40">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="lastTestDate">
											Ngày XN gần nhất
										</SelectItem>
										<SelectItem value="name">
											Tên
										</SelectItem>
										<SelectItem value="dateOfBirth">
											Ngày sinh
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						)}
					</div>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="space-y-4">
							{Array.from({ length: 5 }).map((_, i) => (
								<div
									key={i}
									className="flex items-center space-x-4 p-4 border rounded-lg"
								>
									<Skeleton className="h-12 w-12 rounded-full" />
									<div className="space-y-2 flex-1">
										<Skeleton className="h-4 w-40" />
										<Skeleton className="h-3 w-60" />
									</div>
									<Skeleton className="h-8 w-20" />
								</div>
							))}
						</div>
					) : patientsData?.data && patientsData.data.length > 0 ? (
						<div className="space-y-4">
							{patientsData.data.map((patient) => (
								<div
									key={patient.patientKey}
									className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
									onClick={() => {
										if (onPatientSelect) {
											onPatientSelect(patient)
										} else {
											navigate(
												`/patients/${patient.patientKey}`
											)
										}
									}}
								>
									<div className="flex items-center space-x-4">
										<Avatar className="h-12 w-12">
											<AvatarFallback
												className={cn(
													"font-semibold",
													getGenderBadgeColor(
														patient.gender
													)
												)}
											>
												{getInitials(patient.fullName)}
											</AvatarFallback>
										</Avatar>

										<div className="space-y-1">
											<h4 className="font-semibold">
												{patient.fullName}
											</h4>
											<div className="flex items-center gap-4 text-sm text-muted-foreground">
												<span className="flex items-center gap-1">
													<User className="h-3 w-3" />
													{patient.dateOfBirth
														? formatDate(
																patient.dateOfBirth
														  )
														: "N/A"}
												</span>
												<Badge
													variant="secondary"
													className="text-xs"
												>
													{getGenderLabel(
														patient.gender
													)}
												</Badge>
												<span className="flex items-center gap-1">
													<TestTube className="h-3 w-3" />
													{patient.totalTests} XN
												</span>
											</div>
											<div className="text-xs text-muted-foreground">
												Barcode: {patient.barcode}
											</div>
										</div>
									</div>

									<div className="text-right space-y-1">
										<div className="flex items-center gap-1 text-sm">
											<CalendarIcon className="h-3 w-3" />
											{formatDate(patient.lastTestDate)}
										</div>
										<div className="text-xs text-muted-foreground">
											XN gần nhất
										</div>
										<Button
											variant="outline"
											size="sm"
											className="mt-2"
											onClick={(e) => {
												e.stopPropagation()
												if (onPatientSelect) {
													onPatientSelect(patient)
												} else {
													navigate(
														`/patients/${patient.patientKey}`
													)
												}
											}}
										>
											<Eye className="h-3 w-3 mr-1" />
											Chi tiết
										</Button>
									</div>
								</div>
							))}

							{/* Pagination */}
							{patientsData.pagination.totalPages > 1 && (
								<div className="flex items-center justify-between pt-4">
									<div className="text-sm text-muted-foreground">
										Trang {patientsData.pagination.page} /{" "}
										{patientsData.pagination.totalPages}(
										{patientsData.pagination.total} bệnh
										nhân)
									</div>
									<div className="flex items-center gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												handlePageChange(
													patientsData.pagination
														.page - 1
												)
											}
											disabled={
												!patientsData.pagination.hasPrev
											}
										>
											<ChevronLeft className="h-4 w-4" />
											Trước
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												handlePageChange(
													patientsData.pagination
														.page + 1
												)
											}
											disabled={
												!patientsData.pagination.hasNext
											}
										>
											Sau
											<ChevronRight className="h-4 w-4" />
										</Button>
									</div>
								</div>
							)}
						</div>
					) : (
						<EmptyState
							icon={<Search className="h-12 w-12" />}
							title="Không tìm thấy bệnh nhân"
							description="Thử điều chỉnh bộ lọc tìm kiếm hoặc xóa bộ lọc để xem tất cả bệnh nhân."
							action={{
								label: "Xóa bộ lọc",
								onClick: handleClearSearch,
							}}
						/>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
