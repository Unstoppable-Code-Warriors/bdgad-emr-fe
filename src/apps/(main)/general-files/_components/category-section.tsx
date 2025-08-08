import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Folder } from "lucide-react"
import type { FileCategory, GeneralFile } from "@/types/general-files"
import { FileCard } from "./file-card"

interface CategorySectionProps {
	category: FileCategory
	onDownloadFile: (file: GeneralFile) => void
	downloadingFileId?: number | null
}

export function CategorySection({
	category,
	onDownloadFile,
	downloadingFileId,
}: CategorySectionProps) {
	return (
		<section
			id={`category-${category.category_id}`}
			className="scroll-mt-24"
		>
			<Card className="border-none shadow-none">
				<CardHeader className="pb-2">
					<CardTitle className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Folder className="h-5 w-5 text-blue-600" />
							<span>{category.category_name}</span>
						</div>
						<Badge>{category.file_count} files</Badge>
					</CardTitle>
					<p className="text-sm text-muted-foreground mt-1">
						{category.category_description}
					</p>
				</CardHeader>
				<CardContent>
					<div className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
						{category.files.map((file) => (
							<FileCard
								key={file.id}
								file={file}
								onDownload={onDownloadFile}
								isDownloading={downloadingFileId === file.id}
							/>
						))}
					</div>
				</CardContent>
			</Card>
		</section>
	)
}
