import { useQuery } from "@tanstack/react-query"
import { PatientService } from "@/services/patient.service"
import type { PatientSearchParams } from "@/types/patient"

export function usePatients(params: PatientSearchParams) {
	return useQuery({
		queryKey: ["patients", params],
		queryFn: () => PatientService.searchPatients(params),
		staleTime: 1000 * 60 * 5, // 5 minutes
	})
}

export function usePatientDetails(patientId: number) {
	return useQuery({
		queryKey: ["patient", patientId],
		queryFn: () => PatientService.getPatientDetails(patientId),
		enabled: !!patientId,
		staleTime: 1000 * 60 * 10, // 10 minutes
	})
}

export function usePatientTestHistory(patientId: number) {
	return useQuery({
		queryKey: ["patient-test-history", patientId],
		queryFn: () => PatientService.getPatientTestHistory(patientId),
		enabled: !!patientId,
		staleTime: 1000 * 60 * 5, // 5 minutes
	})
}

export function useDashboardStats(
	period: "day" | "week" | "month" | "year" = "week"
) {
	return useQuery({
		queryKey: ["dashboard-stats", period],
		queryFn: () => PatientService.getDashboardStats(period),
		staleTime: 1000 * 60 * 2, // 2 minutes
	})
}
