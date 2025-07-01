import { useState, useMemo } from "react"
import { usePatients } from "@/hooks/use-patients"
import type { Patient } from "@/types/patient"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

// Import components
import {
	PatientsHeader,
	PatientsFilters,
	PatientsTable,
	TimeFolders,
	PatientsEmptyState,
} from "./_components"

type ViewMode = "table"
type GroupBy = "date" | "week" | "year" | "day"

interface TimeFolder {
	key: string
	label: string
	count: number
	patients: Patient[]
}

export default function PatientsPage() {
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
		? timeFolders.find((folder) => folder.key === selectedFolder) || null
		: null

	const handleSearchChange = (value: string) => {
		setSearchQuery(value)
		// Reset folder selection when searching
		if (value.trim()) {
			setSelectedFolder(null)
		}
	}

	const handleGroupByChange = (value: GroupBy) => {
		setGroupBy(value)
		setSelectedFolder(null) // Reset folder selection
	}

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
			<PatientsHeader
				selectedFolder={selectedFolder}
				isSearchMode={isSearchMode}
				selectedFolderData={selectedFolderData}
				patientsTotal={patientsData?.total || 0}
				patientsCount={patientsData?.patients?.length || 0}
				onBackClick={() => setSelectedFolder(null)}
			/>

			{/* Filters and Controls */}
			<PatientsFilters
				searchQuery={searchQuery}
				statusFilter={statusFilter}
				groupBy={groupBy}
				sortBy={sortBy}
				viewMode={viewMode}
				isSearchMode={isSearchMode}
				onSearchChange={handleSearchChange}
				onStatusFilterChange={setStatusFilter}
				onGroupByChange={handleGroupByChange}
				onSortByChange={setSortBy}
				onViewModeChange={setViewMode}
			/>

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
				<PatientsTable
					patients={patientsData?.patients || []}
					isLoading={isLoading}
				/>
			) : selectedFolder ? (
				// Folder selected: show patients in that folder
				<PatientsTable
					patients={selectedFolderData?.patients || []}
					isLoading={isLoading}
				/>
			) : (
				// Default view: show time folders
				<TimeFolders
					folders={timeFolders}
					onFolderClick={setSelectedFolder}
				/>
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
					<PatientsEmptyState
						isSearchMode={isSearchMode}
						selectedFolder={selectedFolder}
						selectedFolderLabel={selectedFolderData?.label}
					/>
				)}
		</div>
	)
}
