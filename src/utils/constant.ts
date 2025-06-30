export enum Role {
	STAFF = 1,
	LAB_TESTING_TECHNICIAN = 2,
	ANALYSIS_TECHNICIAN = 3,
	VALIDATION_TECHNICIAN = 4,
	DOCTOR = 5,
}

// Role names in Vietnamese
export const ROLE_NAMES_VI: Record<number, string> = {
	[Role.STAFF]: "Nhân viên",
	[Role.LAB_TESTING_TECHNICIAN]: "Kỹ thuật viên xét nghiệm",
	[Role.ANALYSIS_TECHNICIAN]: "Kỹ thuật viên phân tích",
	[Role.VALIDATION_TECHNICIAN]: "Kỹ thuật viên thẩm định",
	[Role.DOCTOR]: "Bác sĩ",
}

// Helper function to get role name in Vietnamese
export const getRoleNameVi = (roleCode: string | number): string => {
	const code = typeof roleCode === "string" ? parseInt(roleCode) : roleCode
	return ROLE_NAMES_VI[code] || "Chuyên viên y tế"
}
