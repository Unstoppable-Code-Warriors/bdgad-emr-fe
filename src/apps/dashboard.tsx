import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Stethoscope,
	Users,
	Calendar,
	FileText,
	Settings,
	LogOut,
	Activity,
	Clock,
	UserCheck,
	Shield,
} from "lucide-react"
import { Role, getRoleNameVi } from "@/utils/constant"
import { LOCALIZATION } from "@/utils/localization"

const DashboardPage = () => {
	const { user, logout } = useAuth()

	const getRoleDisplay = () => {
		if (!user?.roles) return LOCALIZATION.ROLES.MEDICAL_PROFESSIONAL

		// Check if user has doctor role
		const doctorRole = user.roles.find(
			(role) => parseInt(role.code) === Role.DOCTOR
		)
		if (doctorRole) {
			return getRoleNameVi(doctorRole.code)
		}

		// Display the first role if not a doctor
		return (
			getRoleNameVi(user.roles[0]?.code) ||
			LOCALIZATION.ROLES.MEDICAL_PROFESSIONAL
		)
	}

	const getRoleIcon = () => {
		if (!user?.roles)
			return <Stethoscope className="h-4 w-4 text-green-600" />

		// Check if user has doctor role
		const hasDoctorRole = user.roles.some(
			(role) => parseInt(role.code) === Role.DOCTOR
		)
		if (hasDoctorRole) {
			return <Stethoscope className="h-4 w-4 text-green-600" />
		}

		return <UserCheck className="h-4 w-4 text-blue-600" />
	}

	const getDisplayName = () => {
		return user?.name || "Người dùng"
	}

	const handleLogout = async () => {
		try {
			await logout()
		} catch (error) {
			console.error("Logout error:", error)
		}
	}

	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center space-x-3">
							<div className="p-2 bg-blue-100 rounded-lg">
								<Stethoscope className="h-6 w-6 text-blue-600" />
							</div>
							<div>
								<h1 className="text-xl font-semibold text-gray-900">
									{LOCALIZATION.DASHBOARD.TITLE}
								</h1>
								<p className="text-sm text-gray-500">
									{LOCALIZATION.DASHBOARD.SUBTITLE}
								</p>
							</div>
						</div>

						<div className="flex items-center space-x-4">
							<div className="text-right">
								<div className="flex items-center space-x-2">
									{getRoleIcon()}
									<span className="text-sm font-medium text-gray-900">
										{getDisplayName()}
									</span>
								</div>
								<p className="text-xs text-gray-500">
									{getRoleDisplay()}
								</p>
							</div>

							<Button
								variant="outline"
								size="sm"
								onClick={handleLogout}
								className="flex items-center space-x-1"
							>
								<LogOut className="h-4 w-4" />
								<span>{LOCALIZATION.AUTH.LOGOUT}</span>
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Welcome Section */}
				<div className="mb-8">
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						{LOCALIZATION.DASHBOARD.WELCOME_BACK},{" "}
						{getDisplayName()}
					</h2>
					<p className="text-gray-600">
						{LOCALIZATION.DASHBOARD.OVERVIEW_TODAY}
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">
										{
											LOCALIZATION.DASHBOARD.STATS
												.TODAYS_PATIENTS
										}
									</p>
									<p className="text-3xl font-bold text-gray-900">
										12
									</p>
								</div>
								<Users className="h-8 w-8 text-blue-600" />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">
										{
											LOCALIZATION.DASHBOARD.STATS
												.APPOINTMENTS
										}
									</p>
									<p className="text-3xl font-bold text-gray-900">
										8
									</p>
								</div>
								<Calendar className="h-8 w-8 text-green-600" />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">
										{
											LOCALIZATION.DASHBOARD.STATS
												.RECORDS_UPDATED
										}
									</p>
									<p className="text-3xl font-bold text-gray-900">
										5
									</p>
								</div>
								<FileText className="h-8 w-8 text-orange-600" />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">
										{
											LOCALIZATION.DASHBOARD.STATS
												.ACTIVE_CASES
										}
									</p>
									<p className="text-3xl font-bold text-gray-900">
										24
									</p>
								</div>
								<Activity className="h-8 w-8 text-red-600" />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Quick Actions */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Clock className="h-5 w-5" />
								<span>
									{LOCALIZATION.DASHBOARD.SCHEDULE.TITLE}
								</span>
							</CardTitle>
							<CardDescription>
								{LOCALIZATION.DASHBOARD.SCHEDULE.DESCRIPTION}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
									<div>
										<p className="font-medium text-gray-900">
											{
												LOCALIZATION.DASHBOARD.SCHEDULE
													.PATIENT_CONSULTATION
											}
										</p>
										<p className="text-sm text-gray-600">
											Anh Nguyễn Văn Nam - Phòng 203
										</p>
									</div>
									<span className="text-sm font-medium text-blue-600">
										9:00 {LOCALIZATION.TIME.AM}
									</span>
								</div>

								<div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
									<div>
										<p className="font-medium text-gray-900">
											{
												LOCALIZATION.DASHBOARD.SCHEDULE
													.SURGERY_REVIEW
											}
										</p>
										<p className="text-sm text-gray-600">
											{
												LOCALIZATION.DASHBOARD.SCHEDULE
													.POST_OP_CHECKUP
											}
										</p>
									</div>
									<span className="text-sm font-medium text-green-600">
										11:30 {LOCALIZATION.TIME.AM}
									</span>
								</div>

								<div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
									<div>
										<p className="font-medium text-gray-900">
											{
												LOCALIZATION.DASHBOARD.SCHEDULE
													.STAFF_MEETING
											}
										</p>
										<p className="text-sm text-gray-600">
											{
												LOCALIZATION.DASHBOARD.SCHEDULE
													.DEPARTMENT_REVIEW
											}
										</p>
									</div>
									<span className="text-sm font-medium text-orange-600">
										2:00 {LOCALIZATION.TIME.PM}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<FileText className="h-5 w-5" />
								<span>
									{LOCALIZATION.DASHBOARD.QUICK_ACTIONS.TITLE}
								</span>
							</CardTitle>
							<CardDescription>
								{
									LOCALIZATION.DASHBOARD.QUICK_ACTIONS
										.DESCRIPTION
								}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 gap-4">
								<Button
									className="h-20 flex-col space-y-2"
									variant="outline"
								>
									<Users className="h-6 w-6" />
									<span className="text-sm">
										{
											LOCALIZATION.DASHBOARD.QUICK_ACTIONS
												.NEW_PATIENT
										}
									</span>
								</Button>

								<Button
									className="h-20 flex-col space-y-2"
									variant="outline"
								>
									<FileText className="h-6 w-6" />
									<span className="text-sm">
										{
											LOCALIZATION.DASHBOARD.QUICK_ACTIONS
												.CREATE_RECORD
										}
									</span>
								</Button>

								<Button
									className="h-20 flex-col space-y-2"
									variant="outline"
								>
									<Calendar className="h-6 w-6" />
									<span className="text-sm">
										{
											LOCALIZATION.DASHBOARD.QUICK_ACTIONS
												.SCHEDULE
										}
									</span>
								</Button>

								<Button
									className="h-20 flex-col space-y-2"
									variant="outline"
								>
									<Settings className="h-6 w-6" />
									<span className="text-sm">
										{
											LOCALIZATION.DASHBOARD.QUICK_ACTIONS
												.SETTINGS
										}
									</span>
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* User Info */}
				<Card className="mt-8">
					<CardHeader>
						<CardTitle>
							{LOCALIZATION.DASHBOARD.PROFILE.TITLE}
						</CardTitle>
						<CardDescription>
							{LOCALIZATION.DASHBOARD.PROFILE.DESCRIPTION}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<div>
								<p className="text-sm font-medium text-gray-600">
									{LOCALIZATION.DASHBOARD.PROFILE.FULL_NAME}
								</p>
								<p className="text-gray-900">
									{getDisplayName()}
								</p>
							</div>

							<div>
								<p className="text-sm font-medium text-gray-600">
									{LOCALIZATION.DASHBOARD.PROFILE.EMAIL}
								</p>
								<p className="text-gray-900">{user.email}</p>
							</div>

							<div>
								<p className="text-sm font-medium text-gray-600">
									{LOCALIZATION.DASHBOARD.PROFILE.USER_ID}
								</p>
								<p className="text-gray-900">{user.id}</p>
							</div>

							<div>
								<p className="text-sm font-medium text-gray-600">
									{
										LOCALIZATION.DASHBOARD.PROFILE
											.PRIMARY_ROLE
									}
								</p>
								<p className="text-gray-900">
									{getRoleDisplay()}
								</p>
							</div>

							<div>
								<p className="text-sm font-medium text-gray-600">
									{LOCALIZATION.DASHBOARD.PROFILE.ALL_ROLES}
								</p>
								<div className="flex flex-wrap gap-1 mt-1">
									{user.roles.map((role) => (
										<span
											key={role.id}
											className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
										>
											{getRoleNameVi(role.code)}
										</span>
									))}
								</div>
							</div>

							<div>
								<p className="text-sm font-medium text-gray-600">
									{LOCALIZATION.DASHBOARD.PROFILE.STATUS}
								</p>
								<span
									className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
										user.status === "active"
											? "bg-green-100 text-green-800"
											: "bg-red-100 text-red-800"
									}`}
								>
									{user.status === "active"
										? LOCALIZATION.DASHBOARD.PROFILE.ACTIVE
										: LOCALIZATION.DASHBOARD.PROFILE
												.INACTIVE}
								</span>
							</div>

							{user.metadata &&
								(user.metadata.phone ||
									user.metadata.address) && (
									<>
										{user.metadata.phone && (
											<div>
												<p className="text-sm font-medium text-gray-600">
													{
														LOCALIZATION.DASHBOARD
															.PROFILE.PHONE
													}
												</p>
												<p className="text-gray-900">
													{user.metadata.phone}
												</p>
											</div>
										)}

										{user.metadata.address && (
											<div>
												<p className="text-sm font-medium text-gray-600">
													{
														LOCALIZATION.DASHBOARD
															.PROFILE.ADDRESS
													}
												</p>
												<p className="text-gray-900">
													{user.metadata.address}
												</p>
											</div>
										)}
									</>
								)}
						</div>
					</CardContent>
				</Card>
			</main>
		</div>
	)
}

export default DashboardPage
