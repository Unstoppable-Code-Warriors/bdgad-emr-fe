"use client"

import { useState } from "react"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, BarChart3 } from "lucide-react"
import { useNavigate } from "react-router-dom"

// Import dashboard component
import { DashboardStats } from "@/apps/(main)/dashboard/_components/dashboard-stats"
import { ErrorBoundary } from "@/components/ui/error-boundary"

export default function DashboardPage() {
	const navigate = useNavigate()
	const [selectedPeriod] = useState<"day" | "week" | "month" | "year">("year")

	return (
		<ErrorBoundary>
			<div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
				{/* Header */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<h2 className="text-2xl font-semibold tracking-tight">
								Dashboard
							</h2>
							<p className="text-sm text-muted-foreground">
								Tổng quan thống kê hệ thống EMR
							</p>
						</div>
						<div className="flex items-center space-x-2">
							<Button
								variant="outline"
								onClick={() => navigate("/patients")}
								className="flex items-center space-x-2"
							>
								<Users className="h-4 w-4" />
								<span>Thông tin bệnh nhân</span>
							</Button>
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="space-y-4 sm:space-y-6">
					<div className="space-y-6">
						{/* Period Selector */}
						{/* <Card>
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<BarChart3 className="h-5 w-5" />
									<span>Thống kê theo thời gian</span>
								</CardTitle>
								<CardDescription>
									Chọn khoảng thời gian để xem thống kê
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Tabs
									value={selectedPeriod}
									onValueChange={(value) =>
										setSelectedPeriod(value as any)
									}
								>
									<TabsList className="grid w-full grid-cols-4">
										<TabsTrigger value="day">
											Hôm nay
										</TabsTrigger>
										<TabsTrigger value="week">
											Tuần này
										</TabsTrigger>
										<TabsTrigger value="month">
											Tháng này
										</TabsTrigger>
										<TabsTrigger value="year">
											Năm này
										</TabsTrigger>
									</TabsList>
								</Tabs>
							</CardContent>
						</Card> */}

						{/* Dashboard Stats */}
						<DashboardStats period={selectedPeriod} />

						{/* Quick Actions */}
						<Card>
							<CardHeader>
								<CardTitle>Thao tác nhanh</CardTitle>
								<CardDescription>
									Các chức năng thường sử dụng
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
									<Button
										variant="outline"
										className="h-20 flex flex-col items-center space-y-2"
										onClick={() => navigate("/patients")}
									>
										<Users className="h-6 w-6" />
										<span>Tìm kiếm bệnh nhân</span>
									</Button>
									<Button
										variant="outline"
										className="h-20 flex flex-col items-center space-y-2"
										disabled
									>
										<LayoutDashboard className="h-6 w-6" />
										<span>Báo cáo chi tiết</span>
									</Button>
									<Button
										variant="outline"
										className="h-20 flex flex-col items-center space-y-2"
										disabled
									>
										<BarChart3 className="h-6 w-6" />
										<span>Xuất dữ liệu</span>
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</ErrorBoundary>
	)
}
