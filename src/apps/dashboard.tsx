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
import { Role } from "@/utils/constant"

const DashboardPage = () => {
	const { user, logout } = useAuth()

	const getRoleDisplay = () => {
		if (!user?.roles) return "Medical Professional"

		// Check if user has doctor role
		const doctorRole = user.roles.find(
			(role) => parseInt(role.code) === Role.DOCTOR
		)
		if (doctorRole) {
			return doctorRole.name
		}

		// Display the first role if not a doctor
		return user.roles[0]?.name || "Medical Professional"
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
		return user?.name || "User"
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
									EMR Dashboard
								</h1>
								<p className="text-sm text-gray-500">
									Electronic Medical Records
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
								<span>Logout</span>
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
						Welcome back, {getDisplayName()}
					</h2>
					<p className="text-gray-600">
						Here's your medical practice overview for today.
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">
										Today's Patients
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
										Appointments
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
										Records Updated
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
										Active Cases
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
								<span>Today's Schedule</span>
							</CardTitle>
							<CardDescription>
								Your upcoming appointments and tasks
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
									<div>
										<p className="font-medium text-gray-900">
											Patient Consultation
										</p>
										<p className="text-sm text-gray-600">
											John Smith - Room 203
										</p>
									</div>
									<span className="text-sm font-medium text-blue-600">
										9:00 AM
									</span>
								</div>

								<div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
									<div>
										<p className="font-medium text-gray-900">
											Surgery Review
										</p>
										<p className="text-sm text-gray-600">
											Post-op checkup
										</p>
									</div>
									<span className="text-sm font-medium text-green-600">
										11:30 AM
									</span>
								</div>

								<div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
									<div>
										<p className="font-medium text-gray-900">
											Staff Meeting
										</p>
										<p className="text-sm text-gray-600">
											Department review
										</p>
									</div>
									<span className="text-sm font-medium text-orange-600">
										2:00 PM
									</span>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<FileText className="h-5 w-5" />
								<span>Quick Actions</span>
							</CardTitle>
							<CardDescription>
								Common tasks and shortcuts
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 gap-4">
								<Button
									className="h-20 flex-col space-y-2"
									variant="outline"
								>
									<Users className="h-6 w-6" />
									<span className="text-sm">New Patient</span>
								</Button>

								<Button
									className="h-20 flex-col space-y-2"
									variant="outline"
								>
									<FileText className="h-6 w-6" />
									<span className="text-sm">
										Create Record
									</span>
								</Button>

								<Button
									className="h-20 flex-col space-y-2"
									variant="outline"
								>
									<Calendar className="h-6 w-6" />
									<span className="text-sm">Schedule</span>
								</Button>

								<Button
									className="h-20 flex-col space-y-2"
									variant="outline"
								>
									<Settings className="h-6 w-6" />
									<span className="text-sm">Settings</span>
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* User Info */}
				<Card className="mt-8">
					<CardHeader>
						<CardTitle>Your Profile</CardTitle>
						<CardDescription>
							Your professional information and credentials
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Full Name
								</p>
								<p className="text-gray-900">
									{getDisplayName()}
								</p>
							</div>

							<div>
								<p className="text-sm font-medium text-gray-600">
									Email
								</p>
								<p className="text-gray-900">{user.email}</p>
							</div>

							<div>
								<p className="text-sm font-medium text-gray-600">
									User ID
								</p>
								<p className="text-gray-900">{user.id}</p>
							</div>

							<div>
								<p className="text-sm font-medium text-gray-600">
									Primary Role
								</p>
								<p className="text-gray-900">
									{getRoleDisplay()}
								</p>
							</div>

							<div>
								<p className="text-sm font-medium text-gray-600">
									All Roles
								</p>
								<div className="flex flex-wrap gap-1 mt-1">
									{user.roles.map((role) => (
										<span
											key={role.id}
											className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
										>
											{role.name}
										</span>
									))}
								</div>
							</div>

							<div>
								<p className="text-sm font-medium text-gray-600">
									Status
								</p>
								<span
									className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
										user.status === "active"
											? "bg-green-100 text-green-800"
											: "bg-red-100 text-red-800"
									}`}
								>
									{user.status === "active"
										? "Active"
										: "Inactive"}
								</span>
							</div>

							{user.metadata &&
								(user.metadata.phone ||
									user.metadata.address) && (
									<>
										{user.metadata.phone && (
											<div>
												<p className="text-sm font-medium text-gray-600">
													Phone
												</p>
												<p className="text-gray-900">
													{user.metadata.phone}
												</p>
											</div>
										)}

										{user.metadata.address && (
											<div>
												<p className="text-sm font-medium text-gray-600">
													Address
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
