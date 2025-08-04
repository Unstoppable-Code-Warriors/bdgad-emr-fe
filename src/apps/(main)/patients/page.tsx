import { PatientSearch } from "@/components/patients/patient-search"
import { ErrorBoundary } from "@/components/ui/error-boundary"

export default function PatientsPage() {
	return (
		<ErrorBoundary>
			<div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
				{/* Header */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<h2 className="text-2xl font-semibold tracking-tight">
								Quản lý bệnh nhân
							</h2>
							<p className="text-sm text-muted-foreground">
								Tìm kiếm và quản lý thông tin bệnh nhân
							</p>
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="space-y-4 sm:space-y-6">
					<div className="space-y-6">
						<PatientSearch />
					</div>
				</div>
			</div>
		</ErrorBoundary>
	)
}
