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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
	LayoutDashboard,
	Users,
	Search,
	ArrowLeft,
	BarChart3,
} from "lucide-react"

// Import các component đã tạo
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { PatientSearch } from "@/components/patients/patient-search"
import { PatientDetails } from "@/components/patients/patient-details"
import { ErrorBoundary } from "@/components/ui/error-boundary"
// import { ApiStatus } from '@/components/common/api-status';
import type { PatientSummary } from "@/types/patient"

type ViewMode = "dashboard" | "search" | "details"

export default function PatientsPage() {
	const [currentView, setCurrentView] = useState<ViewMode>("dashboard")
	console.log("Current view state initialized:", currentView)
	const [selectedPatient, setSelectedPatient] =
		useState<PatientSummary | null>(null)
	const [selectedPeriod, setSelectedPeriod] = useState<
		"day" | "week" | "month" | "year"
	>("week")

	const handlePatientSelect = (patient: PatientSummary) => {
		setSelectedPatient(patient)
		setCurrentView("details")
	}

	const handleBackToSearch = () => {
		setSelectedPatient(null)
		setCurrentView("search")
	}

	const handleBackToDashboard = () => {
		setSelectedPatient(null)
		setCurrentView("dashboard")
	}

	const renderHeader = () => {
		switch (currentView) {
			case "dashboard":
				return (
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
								onClick={() => setCurrentView("search")}
								className="flex items-center space-x-2"
							>
								<Users className="h-4 w-4" />
								<span>Quản lý bệnh nhân</span>
							</Button>
						</div>
					</div>
				)

			case "search":
				return (
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<Button
								variant="ghost"
								size="sm"
								onClick={handleBackToDashboard}
								className="flex items-center space-x-2"
							>
								<ArrowLeft className="h-4 w-4" />
								<span>Dashboard</span>
							</Button>
							<div className="space-y-1">
								<h2 className="text-2xl font-semibold tracking-tight">
									Quản lý bệnh nhân
								</h2>
								<p className="text-sm text-muted-foreground">
									Tìm kiếm và quản lý thông tin bệnh nhân
								</p>
							</div>
						</div>
						<div className="flex items-center space-x-2">
							<Badge
								variant="secondary"
								className="flex items-center space-x-1"
							>
								<Search className="h-3 w-3" />
								<span>Tìm kiếm</span>
							</Badge>
						</div>
					</div>
				)

			case "details":
				return (
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<Button
								variant="ghost"
								size="sm"
								onClick={handleBackToSearch}
								className="flex items-center space-x-2"
							>
								<ArrowLeft className="h-4 w-4" />
								<span>Danh sách bệnh nhân</span>
							</Button>
							<div className="space-y-1">
								<h2 className="text-2xl font-semibold tracking-tight">
									Chi tiết bệnh nhân
								</h2>
								<p className="text-sm text-muted-foreground">
									Thông tin chi tiết và lịch sử xét nghiệm
								</p>
							</div>
						</div>
						<div className="flex items-center space-x-2">
							<Badge
								variant="secondary"
								className="flex items-center space-x-1"
							>
								<Users className="h-3 w-3" />
								<span>{selectedPatient?.fullName}</span>
							</Badge>
						</div>
					</div>
				)

			default:
				return null
		}
	}

	const renderContent = () => {
		switch (currentView) {
			case "dashboard":
				return (
					<div className="space-y-6">
						{/* Period Selector */}
						<Card>
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
						</Card>

						{/* Dashboard Stats */}
						<DashboardStats period={selectedPeriod} />

						{/* API Status */}
						{/* <ApiStatus /> */}

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
										onClick={() => setCurrentView("search")}
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
				)

			case "search":
				return (
					<div className="space-y-6">
						<PatientSearch onPatientSelect={handlePatientSelect} />
					</div>
				)

			case "details":
				return (
					<div className="space-y-6">
						{selectedPatient && (
							<PatientDetails
								patient={selectedPatient}
								onBack={handleBackToSearch}
							/>
						)}
					</div>
				)

			default:
				return null
		}
	}

	return (
		<ErrorBoundary>
			<div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
				{/* Header */}
				<div className="space-y-4">{renderHeader()}</div>

				{/* Content */}
				<div className="space-y-4 sm:space-y-6">{renderContent()}</div>
			</div>
		</ErrorBoundary>
	)
}
