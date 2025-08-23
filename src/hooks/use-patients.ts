import { useQuery } from "@tanstack/react-query"
import { PatientService } from "@/services/patient.service"
import type { PatientSearchParams } from "@/types/patient"

export function usePatients(params: PatientSearchParams, enabled?: boolean) {
	return useQuery({
		queryKey: ["patients", params],
		queryFn: () => PatientService.searchPatients(params),
		staleTime: 1000 * 60 * 5, // 5 minutes
		enabled: enabled !== false,
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

// New hooks for the additional patient APIs
export function useTestResultsByPatientKey(patientId: number) {
	return useQuery({
		queryKey: ["test-results-by-patient", patientId],
		queryFn: () => PatientService.getTestResultsByPatientKey(patientId),
		enabled: !!patientId,
		staleTime: 1000 * 60 * 5, // 5 minutes
	})
}

export function useTestResultById(testRunKey: number) {
	return useQuery({
		queryKey: ["test-result", testRunKey],
		queryFn: () => PatientService.getTestResultById(testRunKey),
		enabled: !!testRunKey,
		staleTime: 1000 * 60 * 10, // 10 minutes
	})
}

export function useBdgadTestsByPatientKey(patientId: number) {
	return useQuery({
		queryKey: ["bdgad-tests-by-patient", patientId],
		queryFn: () => PatientService.getBdgadTestsByPatientKey(patientId),
		enabled: !!patientId,
		staleTime: 1000 * 60 * 5, // 5 minutes
	})
}

export function useBdgadTestById(testRunKey: number) {
	return useQuery({
		queryKey: ["bdgad-test", testRunKey],
		queryFn: () => PatientService.getBdgadTestById(testRunKey),
		enabled: !!testRunKey,
		staleTime: 1000 * 60 * 10, // 10 minutes
	})
}

export function useMonthYearStats() {
	return useQuery({
		queryKey: ["month-year-stats"],
		queryFn: () => PatientService.getMonthYearStats(),
		staleTime: 1000 * 60 * 30, // 30 minutes
	})
}
