import { Search, LayoutList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

type ViewMode = "table"
type GroupBy = "date" | "week" | "year" | "day"

interface PatientsFiltersProps {
	searchQuery: string
	statusFilter: "all" | "active" | "inactive"
	groupBy: GroupBy
	sortBy: "name" | "date" | "lastVisit"
	viewMode: ViewMode
	isSearchMode: boolean
	onSearchChange: (value: string) => void
	onStatusFilterChange: (value: "all" | "active" | "inactive") => void
	onGroupByChange: (value: GroupBy) => void
	onSortByChange: (value: "name" | "date" | "lastVisit") => void
	onViewModeChange: (value: ViewMode) => void
}

export function PatientsFilters({
	searchQuery,
	statusFilter,
	groupBy,
	sortBy,
	viewMode,
	isSearchMode,
	onSearchChange,
	onStatusFilterChange,
	onGroupByChange,
	onSortByChange,
	onViewModeChange,
}: PatientsFiltersProps) {
	return (
		<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between w-full">
			<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
				{/* Search */}
				<div className="relative w-full sm:w-80">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
					<Input
						type="text"
						placeholder="Tìm kiếm theo tên, mã BN, SĐT..."
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						className="pl-10"
					/>
				</div>

				{/* Status Filter */}
				<Select
					value={statusFilter}
					onValueChange={onStatusFilterChange}
				>
					<SelectTrigger className="w-40">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Tất cả</SelectItem>
						<SelectItem value="active">Đang điều trị</SelectItem>
						<SelectItem value="inactive">Ngưng điều trị</SelectItem>
					</SelectContent>
				</Select>

				{/* Group By - only show when not in search mode */}
				{!isSearchMode && (
					<Select value={groupBy} onValueChange={onGroupByChange}>
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
				<Select value={sortBy} onValueChange={onSortByChange}>
					<SelectTrigger className="w-40">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="name">Tên</SelectItem>
						<SelectItem value="date">Ngày tạo</SelectItem>
						<SelectItem value="lastVisit">Lần khám cuối</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* View Mode */}
			<div className="flex items-center space-x-2">
				<Button
					variant={viewMode === "table" ? "default" : "outline"}
					size="sm"
					onClick={() => onViewModeChange("table")}
				>
					<LayoutList className="h-4 w-4" />
				</Button>
			</div>
		</div>
	)
}
