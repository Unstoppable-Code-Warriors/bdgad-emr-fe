import { Users } from "lucide-react"

interface PatientsEmptyStateProps {
	isSearchMode: boolean
	selectedFolder: string | null
	selectedFolderLabel?: string
}

export function PatientsEmptyState({
	isSearchMode,
	selectedFolder,
	selectedFolderLabel,
}: PatientsEmptyStateProps) {
	return (
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
					? `Không có bệnh nhân nào trong ${selectedFolderLabel?.toLowerCase()}.`
					: "Hiện tại chưa có dữ liệu bệnh nhân trong hệ thống."}
			</p>
		</div>
	)
}
