export interface PatientSummary {
	patientKey: number
	fullName: string
	dateOfBirth: string | null
	gender: string | null
	barcode: string
	address: string | null
	lastTestDate: string
	totalTests: number
	doctorName: string
}

export interface PatientDetails extends PatientSummary {
	patientSourceId: string
	recentTests: TestResult[]
	testHistory: TestHistoryItem[]
	extendedInfo?: ExtendedInfo
}

export interface ExtendedInfo {
	pattern: string
	data: {
		appointment: {
			id: string
			date: string
		}
		patient: {
			fullname: string
			ethnicity: string
			marital_status: string
			address1: string
			address2: string
			phone: string
			gender: string
			nation: string
			work_address: string
			allergies: string
			personal_history: string
			family_history: string
			citizen_id: string
			date_of_birth: string
		}
		medical_record: {
			start_at: string
			reason: string
			current_status: string
			treatment: string
			diagnoses: string
			lab_test: LabTest[]
			prescription: {
				issuedDate: string
				notes: string
				medications: Medication[]
			}
			doctor: {
				id: number
				email: string
				name: string
				phone: string
				address: string
			}
			s3_file_attachment_urls: string[]
		}
	}
}

export interface LabTest {
	test_type: string
	test_name: string
	machine: string
	taken_by: {
		id: number
		name: string
	}
	notes: string
	conclusion: string
	results: LabResult[]
	file_attachments?: FileAttachment[]
}

export interface LabResult {
	name: string
	value: string
	units: string
	reference_range: string
}

export interface Medication {
	name: string
	dosage: string
	route: string
	frequency: string
	duration: string
	instruction: string
	quantity: number
}

export interface FileAttachment {
	filename: string
	file_size: number
}

// New API response types
export interface TestResultListResponse {
	data: TestResultSummaryDto[]
	total: number
}

export interface TestResultSummaryDto {
	testRunKey: number
	date: string
	totalFiles: number
}

export interface TestResultDetailsDto {
	testRunKey: number
	date: string
	ehrUrls: string[]
	patient: {
		citizenId: string
		name: string
		dateOfBirth?: string
		gender?: string
		address?: string
	}
}

export interface BdgadTestListResponse {
	data: BdgadTestSummaryDto[]
	total: number
}

export interface BdgadTestSummaryDto {
	testRunKey: number
	date: string
	totalFiles: number
	caseId: string
}

export interface BdgadTestDetailsDto {
	testRunKey: number
	date: string
	patient: {
		citizenId: string
		name: string
		dateOfBirth?: string
		gender?: string
		address?: string
	}
	labCodes: any[]
}

export interface TestResult {
	testKey: number
	testName: string
	testCategory: string
	dateReceived: string
	dateReported: string
	diagnosis: string | null
	variantName: string | null
	clinicalSignificance: string | null
	location: string | null // 'pharmacy' or 'bdgad'
	resultEtlUrl: string | null // URL kết quả ETL từ DimTestRun
}

export interface TestHistoryItem {
	testKey: number
	testName: string
	dateReceived: string
	doctorName: string
	clinicName: string
	status: "completed" | "pending" | "cancelled"
	location: string | null // 'pharmacy' or 'bdgad'
	resultEtlUrl: string | null // URL kết quả ETL từ DimTestRun
}

export interface PatientSearchResponse {
	data: PatientSummary[]
	pagination: {
		page: number
		limit: number
		total: number
		totalPages: number
		hasNext: boolean
		hasPrev: boolean
	}
}

export interface DashboardStats {
	totalPatients: number
	totalTestsToday: number
	totalTestsThisWeek: number
	totalTestsThisMonth: number
	testsByType: Array<{
		testCategory: string
		count: number
	}>
	patientsByPeriod: Array<{
		date: string
		count: number
	}>
	topDiagnoses: Array<{
		diagnosis: string
		count: number
	}>
}

export interface PatientSearchParams {
	name?: string
	barcode?: string
	dateFrom?: string
	dateTo?: string
	month?: string // Format: YYYY-MM
	testType?: string
	diagnosis?: string
	page?: number
	limit?: number
	sortBy?: "lastTestDate" | "name" | "dateOfBirth"
	sortOrder?: "ASC" | "DESC"
}
