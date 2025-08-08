import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import { Download } from "lucide-react"
import type { GeneralFile } from "@/types/general-files"

function formatFileSize(bytes: number): string {
	if (!bytes) return "0 Bytes"
	const k = 1024
	const sizes = ["Bytes", "KB", "MB", "GB"]
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

function formatDate(dateString: string): string {
	const date = new Date(dateString)
	return date.toLocaleDateString("vi-VN", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	})
}

function getFileEmoji(type: string): string {
	const map: Record<string, string> = {
		docx: "📄",
		pdf: "📕",
		xlsx: "📊",
		png: "🖼️",
		jpg: "🖼️",
		jpeg: "🖼️",
	}
	return map[type?.toLowerCase?.()] || "📁"
}

interface FileCardProps {
	file: GeneralFile
	onDownload: (file: GeneralFile) => void
	isDownloading?: boolean
}

export function FileCard({
	file,
	onDownload,
	isDownloading = false,
}: FileCardProps) {
	const handleDownload = (e: React.MouseEvent) => {
		e.stopPropagation()
		onDownload(file)
	}

	return (
		<Card className="hover:shadow-md transition-shadow cursor-pointer group">
			<CardContent className="p-4">
				<div className="space-y-3">
					{/* Header: Icon + Type Badge + Download Button */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div
								className="text-2xl leading-none select-none"
								aria-hidden
							>
								{getFileEmoji(file.file_type)}
							</div>
							<Badge variant="secondary" className="text-xs">
								{file.file_type.toUpperCase()}
							</Badge>
						</div>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
									onClick={handleDownload}
									disabled={isDownloading}
								>
									<Download className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Tải xuống</p>
							</TooltipContent>
						</Tooltip>
					</div>

					{/* File Name - với truncate tốt hơn */}
					<div className="space-y-1">
						<div
							className="font-medium text-sm leading-tight line-clamp-2 break-words"
							title={file.file_name}
						>
							{file.file_name}
						</div>

						{/* File Size */}
						<div className="text-xs text-muted-foreground">
							{formatFileSize(file.file_size)}
						</div>
					</div>

					{/* Upload Date */}
					<div className="text-xs text-muted-foreground border-t pt-2">
						<span
							className="truncate block"
							title={`Tải lên ${formatDate(file.uploaded_at)}`}
						>
							Tải lên {formatDate(file.uploaded_at)}
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
