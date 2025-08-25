import { useMemo } from "react"
import { useMonthYearStats } from "@/hooks/use-patients"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Calendar, Users } from "lucide-react"

const MONTH_NAMES = [
	"Tháng 1",
	"Tháng 2", 
	"Tháng 3",
	"Tháng 4",
	"Tháng 5",
	"Tháng 6",
	"Tháng 7",
	"Tháng 8",
	"Tháng 9",
	"Tháng 10",
	"Tháng 11",
	"Tháng 12"
]

interface MonthYearStatsProps {
	onMonthClick?: (year: number, month: number) => void;
}

export function MonthYearStats({ onMonthClick }: MonthYearStatsProps) {
	const { data, isLoading, error } = useMonthYearStats()

	// Get the latest year to auto-open
	const latestYear = useMemo(() => {
		if (!data?.data?.length) return undefined
		return Math.max(...data.data.map(yearStats => yearStats.year)).toString()
	}, [data])

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						Thống Kê Bệnh Nhân Theo Tháng & Năm
					</CardTitle>
				</CardHeader>
				<CardContent className="flex items-center justify-center py-8">
					<LoadingSpinner />
				</CardContent>
			</Card>
		)
	}

	if (error) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						Thống Kê Bệnh Nhân Theo Tháng & Năm
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-destructive">Lỗi khi tải thống kê</p>
				</CardContent>
			</Card>
		)
	}

	if (!data?.data?.length) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						Thống Kê Bệnh Nhân Theo Tháng & Năm
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">Không có dữ liệu</p>
				</CardContent>
			</Card>
		)
	}

	// Sort years in descending order (latest first)
	const sortedYears = [...data.data].sort((a, b) => b.year - a.year)

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Calendar className="h-5 w-5" />
					Thống Kê Bệnh Nhân Theo Tháng & Năm
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Accordion 
					type="single" 
					collapsible 
					defaultValue={latestYear}
					className="w-full"
				>
					{sortedYears.map((yearStats) => (
						<AccordionItem 
							key={yearStats.year} 
							value={yearStats.year.toString()}
							className="border rounded-lg px-4 py-2 mb-3"
						>
							<AccordionTrigger className="hover:no-underline">
								<div className="flex items-center justify-between w-full pr-4">
									<div className="flex items-center gap-3">
										<span className="text-lg font-semibold">
											Năm {yearStats.year}
										</span>
										<Badge variant="secondary" className="flex items-center gap-1">
											<Users className="h-3 w-3" />
											{yearStats.total.toLocaleString()} bệnh nhân
										</Badge>
									</div>
								</div>
							</AccordionTrigger>
							<AccordionContent>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
									{yearStats.months
										.sort((a, b) => a.month - b.month)
										.map((monthStats) => (
											<div
												key={monthStats.month}
												className={`flex items-center justify-between p-3 rounded-lg border bg-card transition-colors ${
													onMonthClick ? "cursor-pointer hover:bg-accent/50" : ""
												}`}
												onClick={() => onMonthClick?.(yearStats.year, monthStats.month)}
											>
												<div className="flex items-center gap-2">
													<div className="w-2 h-2 rounded-full bg-primary" />
													<span className="font-medium">
														{MONTH_NAMES[monthStats.month - 1]}
													</span>
												</div>
												<Badge variant="outline" className="ml-auto">
													{monthStats.total.toLocaleString()} bệnh nhân
												</Badge>
											</div>
										))}
								</div>
								{yearStats.months.length === 0 && (
									<p className="text-muted-foreground text-center py-4">
										No monthly data available for {yearStats.year}
									</p>
								)}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</CardContent>
		</Card>
	)
} 