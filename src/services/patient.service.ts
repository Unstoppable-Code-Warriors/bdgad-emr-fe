import { api } from "@/utils/api"
import type {
	PatientSearchResponse,
	PatientDetails,
	DashboardStats,
	PatientSearchParams,
	TestHistoryItem,
} from "@/types/patient"

export class PatientService {
	static async searchPatients(
		params: PatientSearchParams
	): Promise<PatientSearchResponse> {
		const searchParams = new URLSearchParams()

		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== "") {
				searchParams.append(key, value.toString())
			}
		})

		const response = await api.get(
			`patient/search?${searchParams.toString()}`
		)
		return (await response.json()) as PatientSearchResponse
	}

	static async getPatientDetails(patientId: number): Promise<PatientDetails> {
		const response = await api.get(`patient/${patientId}`)
		return (await response.json()) as PatientDetails
	}

	static async getPatientTestHistory(
		patientId: number
	): Promise<TestHistoryItem[]> {
		const response = await api.get(`patient/${patientId}/test-history`)
		return (await response.json()) as TestHistoryItem[]
	}

	static async getDashboardStats(
		period: "day" | "week" | "month" | "year" = "week"
	): Promise<DashboardStats> {
		const response = await api.get(
			`patient/dashboard/stats?period=${period}`
		)
		return (await response.json()) as DashboardStats
	}
}
