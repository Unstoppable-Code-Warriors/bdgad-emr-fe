import { FolderOpen } from "lucide-react"
import type { Patient } from "@/types/patient"

interface TimeFolder {
	key: string
	label: string
	count: number
	patients: Patient[]
}

interface TimeFoldersProps {
	folders: TimeFolder[]
	onFolderClick: (folderKey: string) => void
}

export function TimeFolders({ folders, onFolderClick }: TimeFoldersProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			{folders.map((folder) => (
				<div
					key={folder.key}
					onClick={() => onFolderClick(folder.key)}
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
	)
}
