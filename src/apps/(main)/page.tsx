import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Search, LayoutList, Users, FolderOpen, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DataTable, type ColumnDef } from "@/components/ui/data-table"
import { usePatients } from "@/hooks/use-patients"
import type { Patient } from "@/types/patient"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

type ViewMode = "table"
type GroupBy = "date" | "week" | "year" | "day"

interface TimeFolder {
	key: string
	label: string
	count: number
	patients: Patient[]
}

export default function PatientsPage() {
	const navigate = useNavigate()
	const [searchQuery, setSearchQuery] = useState("")
	const [statusFilter, setStatusFilter] = useState<
		"all" | "active" | "inactive"
	>("all")
	const [viewMode, setViewMode] = useState<ViewMode>("table")
	const [groupBy, setGroupBy] = useState<GroupBy>("day")
	const [sortBy, setSortBy] = useState<"name" | "date" | "lastVisit">("name")
	const [sortOrder] = useState<"asc" | "desc">("asc")
	const [selectedFolder, setSelectedFolder] = useState<string | null>(null)

	const {
		data: patientsData,
		isLoading,
		error,
	} = usePatients({
		search: searchQuery,
		status: statusFilter,
		sortBy,
		sortOrder,
		limit: 50,
	})

	// Create columns with navigate function
	const columns: ColumnDef<Patient>[] = [
		{
			accessorKey: "patientCode",
			header: "Mã BN",
		},
		{
			accessorKey: "fullName",
			header: "Họ và tên",
			cell: ({ row }) => {
				const patient = row.original
				return (
					<button
						onClick={() => navigate(`/${patient.id}`)}
						className="text-left hover:text-blue-600 hover:underline cursor-pointer"
					>
						{patient.fullName}
					</button>
				)
			},
		},
		{
			accessorKey: "dateOfBirth",
			header: "Ngày sinh",
			cell: ({ row }) => {
				const date = row.getValue("dateOfBirth") as string
				return format(new Date(date), "dd/MM/yyyy", { locale: vi })
			},
		},
		{
			accessorKey: "gender",
			header: "Giới tính",
			cell: ({ row }) => {
				const gender = row.getValue("gender") as string
				const genderMap = {
					male: "Nam",
					female: "Nữ",
					other: "Khác",
				}
				return genderMap[gender as keyof typeof genderMap] || gender
			},
		},
		{
			accessorKey: "phoneNumber",
			header: "Số điện thoại",
		},
		{
			accessorKey: "lastVisit",
			header: "Lần khám cuối",
			cell: ({ row }) => {
				const lastVisit = row.getValue("lastVisit") as string
				return lastVisit
					? format(new Date(lastVisit), "dd/MM/yyyy HH:mm", {
							locale: vi,
					  })
					: "Chưa có"
			},
		},
		{
			accessorKey: "status",
			header: "Trạng thái",
			cell: ({ row }) => {
				const status = row.getValue("status") as string
				return (
					<Badge
						variant={status === "active" ? "default" : "secondary"}
					>
						{status === "active"
							? "Đang điều trị"
							: "Ngưng điều trị"}
					</Badge>
				)
			},
		},
	]

	const timeFolders = useMemo((): TimeFolder[] => {
		if (!patientsData?.patients) {
			return []
		}

		const patients = patientsData.patients
		const groups: Record<string, Patient[]> = {}

		patients.forEach((patient) => {
			let groupKey: string

			const createdDate = patient.createdAt
				? new Date(patient.createdAt)
				: new Date()

			if (isNaN(createdDate.getTime())) {
				groupKey = "Không xác định"
			} else {
				if (groupBy === "day") {
					groupKey = format(createdDate, "dd/MM/yyyy", { locale: vi })
				} else if (groupBy === "week") {
					const weekNumber = format(createdDate, "w", { locale: vi })
					const year = format(createdDate, "yyyy", { locale: vi })
					groupKey = `Tuần ${weekNumber} năm ${year}`
				} else if (groupBy === "date") {
					groupKey = `Tháng ${format(createdDate, "MM/yyyy", {
						locale: vi,
					})}`
				} else if (groupBy === "year") {
					groupKey = `Năm ${format(createdDate, "yyyy", {
						locale: vi,
					})}`
				} else {
					// Fallback case
					groupKey = "Không xác định"
				}
			}

			if (!groups[groupKey]) {
				groups[groupKey] = []
			}
			groups[groupKey].push(patient)
		})

		// Convert to folders and sort by date (newest first)
		const folders = Object.entries(groups).map(([key, patients]) => ({
			key,
			label: key,
			count: patients.length,
			patients,
		}))

		return folders.sort((a, b) => {
			if (a.key === "Không xác định") return 1
			if (b.key === "Không xác định") return -1

			// Extract date for sorting
			const extractSortKey = (label: string) => {
				// Handle day format "dd/MM/yyyy"
				const dayMatch = label.match(/(\d{2})\/(\d{2})\/(\d{4})/)
				if (dayMatch) {
					return `${dayMatch[3]}-${dayMatch[2]}-${dayMatch[1]}`
				}

				// Handle week format "Tuần X năm YYYY"
				const weekMatch = label.match(/Tuần (\d+) năm (\d{4})/)
				if (weekMatch) {
					return `${weekMatch[2]}-${weekMatch[1].padStart(2, "0")}`
				}

				// Handle month format "Tháng MM/YYYY"
				const monthMatch = label.match(/Tháng (\d{2})\/(\d{4})/)
				if (monthMatch) {
					return `${monthMatch[2]}-${monthMatch[1]}`
				}

				// Handle year format "Năm YYYY"
				const yearMatch = label.match(/Năm (\d{4})/)
				if (yearMatch) {
					return yearMatch[1]
				}

				return "0000"
			}

			return extractSortKey(b.label).localeCompare(
				extractSortKey(a.label)
			)
		})
	}, [patientsData?.patients, groupBy])

	// Check if we should show search results directly
	const isSearchMode = searchQuery.trim().length > 0

	// Get selected folder data
	const selectedFolderData = selectedFolder
		? timeFolders.find((folder) => folder.key === selectedFolder)
		: null

	if (error) {
		return (
			<div className="p-6">
				<div className="text-center text-red-600">
					Có lỗi xảy ra khi tải dữ liệu bệnh nhân
				</div>
			</div>
		)
	}

	return (
		<div className="p-6 space-y-6 w-full">
			{/* Header */}
			<div className="flex items-center justify-between w-full">
				<div className="flex items-center space-x-4">
					{selectedFolder && !isSearchMode && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => setSelectedFolder(null)}
						>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Quay lại
						</Button>
					)}
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							{selectedFolder && !isSearchMode
								? `${selectedFolderData?.label} - ${selectedFolderData?.count} bệnh nhân`
								: "Danh sách bệnh nhân"}
						</h1>
						<p className="text-muted-foreground">
							{isSearchMode
								? `Kết quả tìm kiếm: ${
										patientsData?.patients?.length || 0
								  } bệnh nhân`
								: selectedFolder
								? `Hiển thị bệnh nhân trong ${selectedFolderData?.label.toLowerCase()}`
								: `Tổng số: ${
										patientsData?.total || 0
								  } bệnh nhân`}
						</p>
					</div>
				</div>
			</div>

			{/* Filters and Controls */}
			<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between w-full">
				<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
					{/* Search */}
					<div className="relative w-full sm:w-80">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
						<Input
							type="text"
							placeholder="Tìm kiếm theo tên, mã BN, SĐT..."
							value={searchQuery}
							onChange={(e) => {
								setSearchQuery(e.target.value)
								// Reset folder selection when searching
								if (e.target.value.trim()) {
									setSelectedFolder(null)
								}
							}}
							className="pl-10"
						/>
					</div>

					{/* Status Filter */}
					<Select
						value={statusFilter}
						onValueChange={(value: "all" | "active" | "inactive") =>
							setStatusFilter(value)
						}
					>
						<SelectTrigger className="w-40">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Tất cả</SelectItem>
							<SelectItem value="active">
								Đang điều trị
							</SelectItem>
							<SelectItem value="inactive">
								Ngưng điều trị
							</SelectItem>
						</SelectContent>
					</Select>

					{/* Group By - only show when not in search mode */}
					{!isSearchMode && (
						<Select
							value={groupBy}
							onValueChange={(value: GroupBy) => {
								setGroupBy(value)
								setSelectedFolder(null) // Reset folder selection
							}}
						>
							<SelectTrigger className="w-48">
								<SelectValue placeholder="Nhóm theo" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="day">Theo ngày</SelectItem>
								<SelectItem value="week">Theo tuần</SelectItem>
								<SelectItem value="date">Theo tháng</SelectItem>
								<SelectItem value="year">Theo năm</SelectItem>
							</SelectContent>
						</Select>
					)}

					{/* Sort By */}
					<Select
						value={sortBy}
						onValueChange={(value: "name" | "date" | "lastVisit") =>
							setSortBy(value)
						}
					>
						<SelectTrigger className="w-40">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="name">Tên</SelectItem>
							<SelectItem value="date">Ngày tạo</SelectItem>
							<SelectItem value="lastVisit">
								Lần khám cuối
							</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* View Mode */}
				<div className="flex items-center space-x-2">
					<Button
						variant={viewMode === "table" ? "default" : "outline"}
						size="sm"
						onClick={() => setViewMode("table")}
					>
						<LayoutList className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Content */}
			{isLoading ? (
				<div className="text-center py-8">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-2 text-muted-foreground">
						Đang tải dữ liệu...
					</p>
				</div>
			) : isSearchMode ? (
				// Search mode: show patients directly
				<DataTable
					columns={columns}
					data={patientsData?.patients || []}
					searchable={false}
					pagination={true}
				/>
			) : selectedFolder ? (
				// Folder selected: show patients in that folder
				<DataTable
					columns={columns}
					data={selectedFolderData?.patients || []}
					searchable={false}
					pagination={true}
				/>
			) : (
				// Default view: show time folders
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{timeFolders.map((folder) => (
						<div
							key={folder.key}
							onClick={() => setSelectedFolder(folder.key)}
							className="cursor-pointer group"
						>
							<div className="border rounded-lg p-6 hover:shadow-md transition-all duration-200 hover:border-blue-300 group-hover:bg-blue-50">
								<div className="flex items-center space-x-3">
									<div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
										<FolderOpen className="h-6 w-6 text-blue-600" />
									</div>
									<div className="flex-1 min-w-0">
										<h3 className="font-medium text-gray-900 truncate group-hover:text-blue-900">
											{folder.label}
										</h3>
										<p className="text-sm text-gray-500 group-hover:text-blue-700">
											{folder.count} bệnh nhân
										</p>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Empty State */}
			{!isLoading &&
				((isSearchMode &&
					(!patientsData?.patients ||
						patientsData.patients.length === 0)) ||
					(!isSearchMode &&
						!selectedFolder &&
						timeFolders.length === 0) ||
					(selectedFolder &&
						(!selectedFolderData?.patients ||
							selectedFolderData.patients.length === 0))) && (
					<div className="text-center py-12">
						<Users className="mx-auto h-12 w-12 text-gray-400" />
						<h3 className="mt-2 text-sm font-medium text-gray-900">
							{isSearchMode
								? "Không tìm thấy bệnh nhân"
								: selectedFolder
								? "Không có bệnh nhân"
								: "Không có dữ liệu"}
						</h3>
						<p className="mt-1 text-sm text-gray-500">
							{isSearchMode
								? "Không tìm thấy bệnh nhân phù hợp với từ khóa tìm kiếm."
								: selectedFolder
								? `Không có bệnh nhân nào trong ${selectedFolderData?.label.toLowerCase()}.`
								: "Hiện tại chưa có dữ liệu bệnh nhân trong hệ thống."}
						</p>
					</div>
				)}
		</div>
	)
}
