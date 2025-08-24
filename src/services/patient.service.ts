import { api } from "@/utils/api"
import type {
	PatientSearchResponse,
	PatientDetails,
	DashboardStats,
	PatientSearchParams,
	TestHistoryItem,
	TestResultListResponse,
	TestResultDetailsDto,
	BdgadTestListResponse,
	BdgadTestDetailsDto,
	PatientByMonthYearResponse,
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

	// New API methods
	static async getTestResultsByPatientKey(
		patientId: number
	): Promise<TestResultListResponse> {
		const response = await api.get(`patient/${patientId}/test-results`)
		return (await response.json()) as TestResultListResponse
	}

	static async getTestResultById(
		testRunKey: number
	): Promise<TestResultDetailsDto> {
		const response = await api.get(`patient/test-results/${testRunKey}`)
		return (await response.json()) as TestResultDetailsDto
	}

	static async getBdgadTestsByPatientKey(
		patientId: number
	): Promise<BdgadTestListResponse> {
		const response = await api.get(`patient/${patientId}/bdgad-tests`)
		return (await response.json()) as BdgadTestListResponse
	}

	static async getBdgadTestById(
		testRunKey: number
	): Promise<BdgadTestDetailsDto> {
		const response = await api.get(`patient/bdgad-tests/${testRunKey}`)
		return (await response.json()) as BdgadTestDetailsDto
	}

	static async getMonthYearStats(): Promise<PatientByMonthYearResponse> {
		const response = await api.get(`patient/month-year-stats`)
		return (await response.json()) as PatientByMonthYearResponse
	}
}
