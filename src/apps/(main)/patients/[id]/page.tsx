import { useParams, useNavigate } from "react-router-dom"
import { PatientDetails } from "@/apps/(main)/patients/[id]/_components/patient-details"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { EmptyState } from "@/components/ui/empty-state"
import { usePatientDetails } from "@/hooks/use-patients"
import { User } from "lucide-react"
import type { PatientSummary } from "@/types/patient"

export default function PatientDetailsPage() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const patientId = id ? parseInt(id, 10) : 0

	const {
		data: patientDetails,
		isLoading,
		error,
	} = usePatientDetails(patientId)

	const handleBack = () => {
		navigate("/patients")
	}

	if (!id || isNaN(patientId)) {
		return (
			<ErrorBoundary>
				<div className="container mx-auto p-6">
					<EmptyState
						icon={<User className="h-12 w-12" />}
						title="ID bệnh nhân không hợp lệ"
						description="Vui lòng kiểm tra lại đường dẫn hoặc quay về danh sách bệnh nhân."
						action={{
							label: "Về danh sách bệnh nhân",
							onClick: handleBack,
						}}
					/>
				</div>
			</ErrorBoundary>
		)
	}

	if (isLoading) {
		return (
			<div className="container mx-auto p-6">
				<LoadingSpinner
					className="py-12"
					text="Đang tải thông tin bệnh nhân..."
				/>
			</div>
		)
	}

	if (error || !patientDetails) {
		return (
			<ErrorBoundary>
				<div className="container mx-auto p-6">
					<EmptyState
						icon={<User className="h-12 w-12" />}
						title="Không tìm thấy bệnh nhân"
						description="Bệnh nhân không tồn tại hoặc bạn không có quyền truy cập."
						action={{
							label: "Về danh sách bệnh nhân",
							onClick: handleBack,
						}}
					/>
				</div>
			</ErrorBoundary>
		)
	}

	// Convert PatientDetails to PatientSummary for component compatibility
	const patientSummary: PatientSummary = {
		patientKey: patientDetails.patientKey,
		fullName: patientDetails.fullName,
		dateOfBirth: patientDetails.dateOfBirth,
		gender: patientDetails.gender,
		barcode: patientDetails.barcode,
		address: patientDetails.address,
		lastTestDate: patientDetails.lastTestDate,
		totalTests: patientDetails.totalTests,
		doctorName: patientDetails.doctorName,
	}

	return (
		<ErrorBoundary>
			<div className="container mx-auto p-6">
				<PatientDetails patient={patientSummary} onBack={handleBack} />
			</div>
		</ErrorBoundary>
	)
}
