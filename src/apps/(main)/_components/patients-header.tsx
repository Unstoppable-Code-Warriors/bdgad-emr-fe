import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { Patient } from "@/types/patient"

interface TimeFolder {
	key: string
	label: string
	count: number
	patients: Patient[]
}

interface PatientsHeaderProps {
	selectedFolder: string | null
	isSearchMode: boolean
	selectedFolderData: TimeFolder | null
	patientsTotal: number
	patientsCount: number
	onBackClick: () => void
}

export function PatientsHeader({
	selectedFolder,
	isSearchMode,
	selectedFolderData,
	patientsTotal,
	patientsCount,
	onBackClick,
}: PatientsHeaderProps) {
	return (
		<div className="flex items-center justify-between w-full">
			<div className="flex items-center space-x-4">
				{selectedFolder && !isSearchMode && (
					<Button variant="outline" size="sm" onClick={onBackClick}>
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
							? `Kết quả tìm kiếm: ${patientsCount} bệnh nhân`
							: selectedFolder
							? `Hiển thị bệnh nhân trong ${selectedFolderData?.label.toLowerCase()}`
							: `Tổng số: ${patientsTotal} bệnh nhân`}
					</p>
				</div>
			</div>
		</div>
	)
}
