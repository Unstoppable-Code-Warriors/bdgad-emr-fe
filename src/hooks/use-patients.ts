import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { patientService } from "@/services/patient.service"
import type { PatientListParams, Patient } from "@/types/patient"

// Query keys
export const patientKeys = {
	all: ["patients"] as const,
	lists: () => [...patientKeys.all, "list"] as const,
	list: (params: PatientListParams) =>
		[...patientKeys.lists(), params] as const,
	details: () => [...patientKeys.all, "detail"] as const,
	detail: (id: string) => [...patientKeys.details(), id] as const,
	medicalRecords: (patientId: string) =>
		[...patientKeys.detail(patientId), "medical-records"] as const,
	vitalSigns: (patientId: string) =>
		[...patientKeys.detail(patientId), "vital-signs"] as const,
}

// Get patients list
export function usePatients(params: PatientListParams = {}) {
	return useQuery({
		queryKey: patientKeys.list(params),
		queryFn: () => patientService.getPatients(params),
		staleTime: 5 * 60 * 1000, // 5 minutes
	})
}

// Get patient by ID
export function usePatient(id: string) {
	return useQuery({
		queryKey: patientKeys.detail(id),
		queryFn: () => patientService.getPatientById(id),
		enabled: !!id,
	})
}

// Get patient medical records
export function usePatientMedicalRecords(patientId: string) {
	return useQuery({
		queryKey: patientKeys.medicalRecords(patientId),
		queryFn: () => patientService.getPatientMedicalRecords(patientId),
		enabled: !!patientId,
	})
}

// Get patient vital signs
export function usePatientVitalSigns(patientId: string) {
	return useQuery({
		queryKey: patientKeys.vitalSigns(patientId),
		queryFn: () => patientService.getPatientVitalSigns(patientId),
		enabled: !!patientId,
	})
}

// Create patient mutation
export function useCreatePatient() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (
			patient: Omit<Patient, "id" | "createdAt" | "updatedAt">
		) => patientService.createPatient(patient),
		onSuccess: () => {
			// Invalidate and refetch patients list
			queryClient.invalidateQueries({ queryKey: patientKeys.lists() })
		},
	})
}

// Update patient mutation
export function useUpdatePatient() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			id,
			updates,
		}: {
			id: string
			updates: Partial<Patient>
		}) => patientService.updatePatient(id, updates),
		onSuccess: (data) => {
			// Update patient in cache
			queryClient.setQueryData(patientKeys.detail(data.id), data)
			// Invalidate patients list to refresh
			queryClient.invalidateQueries({ queryKey: patientKeys.lists() })
		},
	})
}
