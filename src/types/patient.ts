export interface Patient {
	id: string
	patientCode: string
	fullName: string
	dateOfBirth: string
	gender: "male" | "female" | "other"
	phoneNumber: string
	email?: string
	address: string
	emergencyContact: {
		name: string
		phoneNumber: string
		relationship: string
	}
	insurance?: {
		provider: string
		policyNumber: string
		validUntil: string
	}
	medicalHistory: string[]
	allergies: string[]
	currentMedications: string[]
	bloodType?: string
	height?: number // cm
	weight?: number // kg
	createdAt: string
	updatedAt: string
	status: "active" | "inactive"
	assignedDoctor?: {
		id: string
		name: string
	}
	lastVisit?: string
}

export interface MedicalRecord {
	id: string
	patientId: string
	visitDate: string
	chiefComplaint: string
	historyOfPresentIllness: string
	physicalExamination: string
	assessment: string
	plan: string
	prescription?: {
		medications: Array<{
			name: string
			dosage: string
			frequency: string
			duration: string
			instructions: string
		}>
	}
	doctorId: string
	doctorName: string
	createdAt: string
	updatedAt: string
}

export interface VitalSigns {
	id: string
	patientId: string
	recordId: string
	temperature?: number // Celsius
	bloodPressure?: {
		systolic: number
		diastolic: number
	}
	heartRate?: number // bpm
	respiratoryRate?: number // per minute
	oxygenSaturation?: number // %
	weight?: number // kg
	height?: number // cm
	bmi?: number
	measuredAt: string
	measuredBy: string
}

export interface PatientListParams {
	page?: number
	limit?: number
	search?: string
	status?: "active" | "inactive" | "all"
	sortBy?: "name" | "date" | "lastVisit"
	sortOrder?: "asc" | "desc"
	groupBy?: "none" | "date" | "doctor" | "status"
}

export interface PatientListResponse {
	patients: Patient[]
	total: number
	page: number
	limit: number
	totalPages: number
}
