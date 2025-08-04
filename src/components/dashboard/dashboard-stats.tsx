"use client"

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, TestTube, TrendingUp } from "lucide-react"
import { useDashboardStats } from "@/hooks/use-patients"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardStatsProps {
	period?: "day" | "week" | "month" | "year"
}

export function DashboardStats({ period = "week" }: DashboardStatsProps) {
	const { data: stats, isLoading, error } = useDashboardStats(period)

	if (isLoading) {
		return (
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={i}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-4 w-4" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-7 w-16 mb-1" />
							<Skeleton className="h-3 w-24" />
						</CardContent>
					</Card>
				))}
			</div>
		)
	}

	if (error) {
		return (
			<Card>
				<CardContent className="pt-6">
					<p className="text-center text-muted-foreground">
						Không thể tải thống kê. Vui lòng thử lại.
					</p>
				</CardContent>
			</Card>
		)
	}

	if (!stats) return null

	const periodLabel = {
		day: "Hôm nay",
		week: "Tuần này",
		month: "Tháng này",
		year: "Năm này",
	}[period]

	return (
		<div className="space-y-6">
			{/* Main Stats Cards */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Tổng Bệnh Nhân
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.totalPatients.toLocaleString()}
						</div>
						<p className="text-xs text-muted-foreground">
							Tổng số bệnh nhân được quản lý
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							XN Hôm Nay
						</CardTitle>
						<TestTube className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.totalTestsToday}
						</div>
						<p className="text-xs text-muted-foreground">
							Xét nghiệm thực hiện hôm nay
						</p>
					</CardContent>
				</Card>

				{/* <Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							XN {periodLabel}
						</CardTitle>
						<Calendar className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{period === "week"
								? stats.totalTestsThisWeek
								: period === "month"
								? stats.totalTestsThisMonth
								: stats.totalTestsToday}
						</div>
						<p className="text-xs text-muted-foreground">
							Xét nghiệm {periodLabel.toLowerCase()}
						</p>
					</CardContent>
				</Card> */}

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Tốc Độ
						</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.totalPatients > 0
								? Math.round(
										(stats.totalTestsThisWeek /
											stats.totalPatients) *
											100
								  ) / 100
								: 0}
						</div>
						<p className="text-xs text-muted-foreground">
							XN/BN trung bình tuần
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Tests by Type */}
			{stats.testsByType && stats.testsByType.length > 0 && (
				<div className="grid gap-4 md:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle>Loại Xét Nghiệm Phổ Biến</CardTitle>
							<CardDescription>
								Phân bố theo loại xét nghiệm{" "}
								{periodLabel.toLowerCase()}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{stats.testsByType
									.slice(0, 5)
									.map((item, index) => (
										<div
											key={item.testCategory}
											className="flex items-center justify-between"
										>
											<div className="flex items-center gap-2">
												<div
													className={`h-2 w-2 rounded-full ${
														index === 0
															? "bg-blue-500"
															: index === 1
															? "bg-green-500"
															: index === 2
															? "bg-yellow-500"
															: index === 3
															? "bg-purple-500"
															: "bg-gray-500"
													}`}
												/>
												<span className="text-sm font-medium truncate max-w-[200px]">
													{item.testCategory ||
														"Không xác định"}
												</span>
											</div>
											<Badge variant="secondary">
												{item.count}
											</Badge>
										</div>
									))}
							</div>
						</CardContent>
					</Card>

					{/* Top Diagnoses */}
					<Card>
						<CardHeader>
							<CardTitle>Chẩn Đoán Thường Gặp</CardTitle>
							<CardDescription>
								Các chẩn đoán phổ biến{" "}
								{periodLabel.toLowerCase()}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{stats.topDiagnoses &&
								stats.topDiagnoses.length > 0 ? (
									stats.topDiagnoses
										.slice(0, 5)
										.map((item, index) => (
											<div
												key={item.diagnosis}
												className="flex items-center justify-between"
											>
												<div className="flex items-center gap-2">
													<div
														className={`h-2 w-2 rounded-full ${
															index === 0
																? "bg-red-500"
																: index === 1
																? "bg-orange-500"
																: index === 2
																? "bg-amber-500"
																: index === 3
																? "bg-lime-500"
																: "bg-gray-500"
														}`}
													/>
													<span className="text-sm font-medium truncate max-w-[200px]">
														{item.diagnosis}
													</span>
												</div>
												<Badge variant="outline">
													{item.count}
												</Badge>
											</div>
										))
								) : (
									<p className="text-sm text-muted-foreground text-center py-4">
										Chưa có dữ liệu chẩn đoán
									</p>
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	)
}
