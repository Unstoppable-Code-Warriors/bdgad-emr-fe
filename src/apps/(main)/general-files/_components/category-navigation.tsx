import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search } from "lucide-react"
import type { FileCategory } from "@/types/general-files"

interface CategoryNavigationProps {
	categories: FileCategory[]
	allCategories: FileCategory[]
	search: string
	onSearchChange: (value: string) => void
}

export function CategoryNavigation({
	categories,
	allCategories,
	search,
	onSearchChange,
}: CategoryNavigationProps) {
	return (
		<Card className="sticky top-4">
			<CardHeader className="pb-3">
				<CardTitle className="text-base">Danh mục</CardTitle>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="relative mb-3">
					<Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						value={search}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder="Tìm kiếm files..."
						className="pl-8"
					/>
				</div>
				<Separator className="my-3" />
				<ScrollArea className="h-[60vh] pr-3">
					<nav className="space-y-1">
						{(search ? categories : allCategories).map((c) => (
							<a
								key={c.category_id}
								href={`#category-${c.category_id}`}
								className="flex items-center justify-between rounded-md px-2 py-2 hover:bg-muted"
							>
								<span className="truncate">
									{c.category_name}
								</span>
								<Badge variant="secondary">
									{c.file_count}
								</Badge>
							</a>
						))}
					</nav>
				</ScrollArea>
			</CardContent>
		</Card>
	)
}
