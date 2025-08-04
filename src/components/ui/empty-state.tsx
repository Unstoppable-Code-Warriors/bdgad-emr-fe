import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface EmptyStateProps {
	icon?: ReactNode
	title?: string
	description?: string
	action?: {
		label: string
		onClick: () => void
	}
	className?: string
}

export function EmptyState({
	icon,
	title = "Không có dữ liệu",
	description = "Không tìm thấy dữ liệu phù hợp với tiêu chí tìm kiếm.",
	action,
	className,
}: EmptyStateProps) {
	return (
		<Card className={cn("w-full", className)}>
			<CardContent className="flex flex-col items-center justify-center py-12 text-center">
				{icon && (
					<div className="mb-4 text-muted-foreground">{icon}</div>
				)}
				<CardTitle className="mb-2 text-lg">{title}</CardTitle>
				<CardDescription className="mb-6 max-w-sm">
					{description}
				</CardDescription>
				{action && (
					<Button onClick={action.onClick} variant="outline">
						{action.label}
					</Button>
				)}
			</CardContent>
		</Card>
	)
}
