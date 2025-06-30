import { createAuthenticatedApi } from "@/utils/api"
import { getAccessToken } from "@/stores/auth.store"
import type {
	Patient,
	MedicalRecord,
	VitalSigns,
	PatientListParams,
	PatientListResponse,
} from "@/types/patient"

class PatientService {
	private getApi() {
		const token = getAccessToken()
		if (!token) {
			throw new Error("Không có token xác thực")
		}
		return createAuthenticatedApi(token)
	}

	/**
	 * Get list of patients with filtering and pagination
	 */
	async getPatients(
		params: PatientListParams = {}
	): Promise<PatientListResponse> {
		const api = this.getApi()

		// For now, return mock data
		// In production, this would be:
		// const response = await api.get('patients', { searchParams: params }).json<PatientListResponse>()

		return this.getMockPatients(params)
	}

	/**
	 * Get patient by ID
	 */
	async getPatientById(id: string): Promise<Patient> {
		const api = this.getApi()

		// For now, return mock data
		// In production, this would be:
		// const response = await api.get(`patients/${id}`).json<Patient>()

		return this.getMockPatientById(id)
	}

	/**
	 * Get medical records for a patient
	 */
	async getPatientMedicalRecords(
		patientId: string
	): Promise<MedicalRecord[]> {
		const api = this.getApi()

		// For now, return mock data
		// In production, this would be:
		// const response = await api.get(`patients/${patientId}/medical-records`).json<MedicalRecord[]>()

		return this.getMockMedicalRecords(patientId)
	}

	/**
	 * Get vital signs for a patient
	 */
	async getPatientVitalSigns(patientId: string): Promise<VitalSigns[]> {
		const api = this.getApi()

		// For now, return mock data
		// In production, this would be:
		// const response = await api.get(`patients/${patientId}/vital-signs`).json<VitalSigns[]>()

		return this.getMockVitalSigns(patientId)
	}

	/**
	 * Create new patient
	 */
	async createPatient(
		patient: Omit<Patient, "id" | "createdAt" | "updatedAt">
	): Promise<Patient> {
		const api = this.getApi()

		// For now, return mock data
		// In production, this would be:
		// const response = await api.post('patients', { json: patient }).json<Patient>()

		return {
			...patient,
			id: `patient-${Date.now()}`,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		}
	}

	/**
	 * Update patient
	 */
	async updatePatient(
		id: string,
		updates: Partial<Patient>
	): Promise<Patient> {
		const api = this.getApi()

		// For now, return mock data
		// In production, this would be:
		// const response = await api.patch(`patients/${id}`, { json: updates }).json<Patient>()

		const patient = await this.getPatientById(id)
		return {
			...patient,
			...updates,
			updatedAt: new Date().toISOString(),
		}
	}

	// Mock data methods
	private getMockPatients(params: PatientListParams): PatientListResponse {
		const mockPatients: Patient[] = [
			{
				id: "1",
				patientCode: "BN001",
				fullName: "Nguyễn Văn An",
				dateOfBirth: "1985-03-15",
				gender: "male",
				phoneNumber: "0901234567",
				email: "nguyen.van.an@email.com",
				address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
				emergencyContact: {
					name: "Nguyễn Thị Bình",
					phoneNumber: "0902345678",
					relationship: "Vợ",
				},
				insurance: {
					provider: "BHXH",
					policyNumber: "SV123456789",
					validUntil: "2024-12-31",
				},
				medicalHistory: ["Cao huyết áp", "Tiểu đường type 2"],
				allergies: ["Penicillin"],
				currentMedications: ["Metformin 500mg", "Lisinopril 10mg"],
				bloodType: "A+",
				height: 170,
				weight: 75,
				createdAt: "2024-01-15T08:30:00Z",
				updatedAt: "2024-01-20T14:45:00Z",
				status: "active",
				assignedDoctor: {
					id: "doc1",
					name: "BS. Trần Minh Khôi",
				},
				lastVisit: "2024-01-20T14:45:00Z",
			},
			{
				id: "2",
				patientCode: "BN002",
				fullName: "Trần Thị Bình",
				dateOfBirth: "1990-07-22",
				gender: "female",
				phoneNumber: "0903456789",
				email: "tran.thi.binh@email.com",
				address: "456 Đường Nguyễn Huệ, Quận 3, TP.HCM",
				emergencyContact: {
					name: "Trần Văn Cường",
					phoneNumber: "0904567890",
					relationship: "Chồng",
				},
				insurance: {
					provider: "Bảo Việt",
					policyNumber: "BV987654321",
					validUntil: "2025-06-30",
				},
				medicalHistory: ["Hen suyễn"],
				allergies: ["Tôm cua"],
				currentMedications: ["Ventolin inhaler"],
				bloodType: "O-",
				height: 160,
				weight: 55,
				createdAt: "2024-01-10T09:15:00Z",
				updatedAt: "2024-01-18T11:20:00Z",
				status: "active",
				assignedDoctor: {
					id: "doc2",
					name: "BS. Lê Thị Mai",
				},
				lastVisit: "2024-01-18T11:20:00Z",
			},
			{
				id: "3",
				patientCode: "BN003",
				fullName: "Lê Minh Cường",
				dateOfBirth: "1978-12-03",
				gender: "male",
				phoneNumber: "0905678901",
				address: "789 Đường Võ Văn Tần, Quận 10, TP.HCM",
				emergencyContact: {
					name: "Lê Thị Dung",
					phoneNumber: "0906789012",
					relationship: "Mẹ",
				},
				medicalHistory: ["Viêm gan B"],
				allergies: [],
				currentMedications: ["Tenofovir 300mg"],
				bloodType: "B+",
				height: 175,
				weight: 80,
				createdAt: "2024-01-05T07:00:00Z",
				updatedAt: "2024-01-15T16:30:00Z",
				status: "active",
				assignedDoctor: {
					id: "doc1",
					name: "BS. Trần Minh Khôi",
				},
				lastVisit: "2024-01-15T16:30:00Z",
			},
		]

		// Apply filtering
		let filteredPatients = mockPatients

		if (params.search) {
			const searchLower = params.search.toLowerCase()
			filteredPatients = filteredPatients.filter(
				(p) =>
					p.fullName.toLowerCase().includes(searchLower) ||
					p.patientCode.toLowerCase().includes(searchLower) ||
					p.phoneNumber.includes(searchLower)
			)
		}

		if (params.status && params.status !== "all") {
			filteredPatients = filteredPatients.filter(
				(p) => p.status === params.status
			)
		}

		// Apply sorting
		if (params.sortBy) {
			filteredPatients.sort((a, b) => {
				let aValue: string | Date
				let bValue: string | Date

				switch (params.sortBy) {
					case "name":
						aValue = a.fullName
						bValue = b.fullName
						break
					case "date":
						aValue = new Date(a.createdAt)
						bValue = new Date(b.createdAt)
						break
					case "lastVisit":
						aValue = new Date(a.lastVisit || a.createdAt)
						bValue = new Date(b.lastVisit || b.createdAt)
						break
					default:
						return 0
				}

				if (aValue < bValue) return params.sortOrder === "desc" ? 1 : -1
				if (aValue > bValue) return params.sortOrder === "desc" ? -1 : 1
				return 0
			})
		}

		// Apply pagination
		const page = params.page || 1
		const limit = params.limit || 10
		const startIndex = (page - 1) * limit
		const endIndex = startIndex + limit
		const paginatedPatients = filteredPatients.slice(startIndex, endIndex)

		return {
			patients: paginatedPatients,
			total: filteredPatients.length,
			page,
			limit,
			totalPages: Math.ceil(filteredPatients.length / limit),
		}
	}

	private getMockPatientById(id: string): Patient {
		const mockPatients = this.getMockPatients({}).patients
		const patient = mockPatients.find((p) => p.id === id)
		if (!patient) {
			throw new Error("Không tìm thấy bệnh nhân")
		}
		return patient
	}

	private getMockMedicalRecords(patientId: string): MedicalRecord[] {
		return [
			{
				id: "rec1",
				patientId,
				visitDate: "2024-01-20T14:45:00Z",
				chiefComplaint: "Đau đầu và chóng mặt",
				historyOfPresentIllness:
					"Bệnh nhân than phiền đau đầu từ 3 ngày nay, kèm theo chóng mặt nhẹ. Không sốt, không buồn nôn.",
				physicalExamination:
					"Huyết áp: 140/90 mmHg, Mạch: 80 lần/phút, Nhiệt độ: 36.5°C. Thần kinh: không có dấu hiệu bất thường.",
				assessment: "Cao huyết áp không kiểm soát",
				plan: "Tăng liều thuốc hạ áp, tái khám sau 1 tuần",
				prescription: {
					medications: [
						{
							name: "Lisinopril",
							dosage: "20mg",
							frequency: "1 lần/ngày",
							duration: "30 ngày",
							instructions: "Uống vào buổi sáng, trước ăn",
						},
					],
				},
				doctorId: "doc1",
				doctorName: "BS. Trần Minh Khôi",
				createdAt: "2024-01-20T14:45:00Z",
				updatedAt: "2024-01-20T14:45:00Z",
			},
		]
	}

	private getMockVitalSigns(patientId: string): VitalSigns[] {
		return [
			{
				id: "vital1",
				patientId,
				recordId: "rec1",
				temperature: 36.5,
				bloodPressure: {
					systolic: 140,
					diastolic: 90,
				},
				heartRate: 80,
				respiratoryRate: 18,
				oxygenSaturation: 98,
				weight: 75,
				height: 170,
				bmi: 26.0,
				measuredAt: "2024-01-20T14:30:00Z",
				measuredBy: "Y tá Nguyễn Thị Lan",
			},
		]
	}
}

export const patientService = new PatientService()
export default patientService
