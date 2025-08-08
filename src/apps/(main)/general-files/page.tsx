import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useFilesByCategories } from "@/hooks/use-general-files"
import { GeneralFilesService } from "@/services/general-files.service"
import type { GeneralFile } from "@/types/general-files"
import { FileText } from "lucide-react"
import { toast } from "sonner"
import { CategoryNavigation, CategorySection } from "./_components"

export default function GeneralFilesPage() {
	const { data, isLoading, isError } = useFilesByCategories()
	const [search, setSearch] = useState("")
	const [downloadingFileId, setDownloadingFileId] = useState<number | null>(
		null
	)

	const filtered = useMemo(() => {
		if (!data) return []
		const term = search.trim().toLowerCase()
		if (!term) return data.categories
		return data.categories
			.map((c) => ({
				...c,
				files: c.files.filter((f) =>
					f.file_name.toLowerCase().includes(term)
				),
				file_count: c.files.filter((f) =>
					f.file_name.toLowerCase().includes(term)
				).length,
			}))
			.filter((c) => c.files.length > 0)
	}, [data, search])

	const handleDownloadFile = async (file: GeneralFile) => {
		setDownloadingFileId(file.id)
		try {
			const blob = await GeneralFilesService.downloadFile(file.id)

			// Create download link
			const url = window.URL.createObjectURL(blob)
			const link = document.createElement("a")
			link.href = url
			link.download = `${file.file_name}.${file.file_type}`
			document.body.appendChild(link)
			link.click()

			// Cleanup
			window.URL.revokeObjectURL(url)
			document.body.removeChild(link)

			toast.success(`Đã tải xuống: ${file.file_name}`)
		} catch (error) {
			console.error("Download failed:", error)
			toast.error("Không thể tải xuống file. Vui lòng thử lại.")
		} finally {
			setDownloadingFileId(null)
		}
	}

	if (isLoading) {
		return (
			<div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
				{[...Array(6)].map((_, i) => (
					<Skeleton key={i} className="h-28 w-full" />
				))}
			</div>
		)
	}

	if (isError || !data) {
		return (
			<div className="p-6">
				<Card>
					<CardContent className="p-6">
						<div className="text-sm text-red-600">
							Không thể tải danh sách files. Vui lòng thử lại sau.
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	const categories = filtered

	return (
		<TooltipProvider>
			<div className="p-6">
				<div className="mb-4 flex items-center justify-between">
					<div>
						<h1 className="text-xl font-semibold flex items-center gap-2">
							<FileText className="h-5 w-5" /> Files theo danh mục
						</h1>
						<p className="text-sm text-muted-foreground mt-1">
							Tổng cộng: {data.total_files} files trong{" "}
							{data.total_categories} danh mục
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
					<aside>
						<CategoryNavigation
							categories={categories}
							allCategories={data.categories}
							search={search}
							onSearchChange={setSearch}
						/>
					</aside>

					<section className="space-y-8">
						{categories.length === 0 ? (
							<Card>
								<CardContent className="p-6 text-sm text-muted-foreground">
									Không tìm thấy file nào phù hợp với từ khóa.
								</CardContent>
							</Card>
						) : (
							categories.map((category) => (
								<CategorySection
									key={category.category_id}
									category={category}
									onDownloadFile={handleDownloadFile}
									downloadingFileId={downloadingFileId}
								/>
							))
						)}
					</section>
				</div>
			</div>
		</TooltipProvider>
	)
}
