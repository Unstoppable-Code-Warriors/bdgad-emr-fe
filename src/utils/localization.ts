// Localization constants for EMR system in Vietnamese
export const LOCALIZATION = {
	// Authentication
	AUTH: {
		LOGIN: {
			TITLE: "Đăng nhập chuyên viên y tế",
			DESCRIPTION: "Truy cập bảng điều khiển EMR một cách bảo mật",
			EMAIL_LABEL: "Địa chỉ email",
			EMAIL_PLACEHOLDER: "email.cua.ban@benhvien.com",
			PASSWORD_LABEL: "Mật khẩu",
			PASSWORD_PLACEHOLDER: "Nhập mật khẩu của bạn",
			SUBMIT_BUTTON: "Đăng nhập",
			SUBMITTING: "Đang đăng nhập...",
			FORGOT_PASSWORD: "Quên mật khẩu?",
			SECURE_ACCESS: "🔒 Truy cập hệ thống EMR bảo mật",
			AUTHORIZED_ONLY: "Chỉ dành cho chuyên viên y tế được ủy quyền",
			VALIDATION: {
				FILL_ALL_FIELDS: "Vui lòng điền đầy đủ thông tin",
				VALID_EMAIL: "Vui lòng nhập địa chỉ email hợp lệ",
				LOGIN_FAILED: "Đăng nhập thất bại. Vui lòng thử lại.",
				UNAUTHORIZED:
					"Không có quyền: Chỉ bác sĩ mới có thể truy cập hệ thống này",
				ACCOUNT_DEACTIVATED:
					"Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.",
			},
		},
		FORGOT_PASSWORD: {
			TITLE: "Quên mật khẩu",
			DESCRIPTION:
				"Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu",
			EMAIL_LABEL: "Địa chỉ email",
			EMAIL_PLACEHOLDER: "bacsi@benhvien.com",
			SUBMIT_BUTTON: "Gửi hướng dẫn đặt lại",
			SUBMITTING: "Đang gửi...",
			BACK_TO_LOGIN: "Quay lại đăng nhập",
			SUCCESS_MESSAGE:
				"Hướng dẫn đặt lại mật khẩu đã được gửi đến địa chỉ email của bạn.",
			SECURE_RESET: "🔒 Đặt lại mật khẩu bảo mật cho chuyên viên y tế",
			CHECK_SPAM: "Kiểm tra hộp thư bao gồm cả thư mục spam",
			VALIDATION: {
				ENTER_EMAIL: "Vui lòng nhập địa chỉ email",
				VALID_EMAIL: "Vui lòng nhập địa chỉ email hợp lệ",
				RESET_FAILED: "Không thể gửi email đặt lại. Vui lòng thử lại.",
			},
		},
		RESET_PASSWORD: {
			TITLE: "Đặt lại mật khẩu",
			DESCRIPTION: "Nhập mật khẩu mới bảo mật của bạn",
			NEW_PASSWORD_LABEL: "Mật khẩu mới",
			NEW_PASSWORD_PLACEHOLDER: "Nhập mật khẩu mới",
			CONFIRM_PASSWORD_LABEL: "Xác nhận mật khẩu",
			CONFIRM_PASSWORD_PLACEHOLDER: "Nhập lại mật khẩu mới",
			SUBMIT_BUTTON: "Đặt lại mật khẩu",
			SUBMITTING: "Đang đặt lại...",
			BACK_TO_LOGIN: "Quay lại đăng nhập",
			SUCCESS_MESSAGE: "Mật khẩu đã được đặt lại thành công!",
			REDIRECTING: "Đang chuyển hướng đến trang đăng nhập...",
			LOADING: "Đang tải...",
			VALIDATION: {
				FILL_ALL_FIELDS: "Vui lòng điền đầy đủ thông tin",
				PASSWORDS_NOT_MATCH: "Mật khẩu không khớp",
				MIN_LENGTH: "Mật khẩu phải có ít nhất 8 ký tự",
				LOWERCASE_REQUIRED:
					"Mật khẩu phải chứa ít nhất một chữ cái thường",
				UPPERCASE_REQUIRED:
					"Mật khẩu phải chứa ít nhất một chữ cái in hoa",
				NUMBER_REQUIRED: "Mật khẩu phải chứa ít nhất một số",
				SPECIAL_CHAR_REQUIRED:
					"Mật khẩu phải chứa ít nhất một ký tự đặc biệt (@$!%*?&)",
				INVALID_TOKEN:
					"Mã xác thực không hợp lệ. Vui lòng yêu cầu đặt lại mật khẩu mới.",
				MISSING_TOKEN:
					"Thiếu hoặc không hợp lệ mã xác thực đặt lại. Vui lòng yêu cầu đặt lại mật khẩu mới.",
				RESET_FAILED: "Không thể đặt lại mật khẩu. Vui lòng thử lại.",
			},
			PASSWORD_REQUIREMENTS: {
				TITLE: "Yêu cầu mật khẩu:",
				ITEMS: [
					"Ít nhất 8 ký tự",
					"Chứa chữ cái thường",
					"Chứa chữ cái in hoa",
					"Chứa số",
					"Chứa ký tự đặc biệt",
				],
			},
		},
		LOGOUT: "Đăng xuất",
	},

	// Dashboard
	DASHBOARD: {
		TITLE: "Bảng điều khiển EMR",
		SUBTITLE: "Hồ sơ y tế điện tử",
		WELCOME_BACK: "Chào mừng trở lại",
		OVERVIEW_TODAY: "Đây là tổng quan hoạt động y tế của bạn hôm nay.",

		STATS: {
			TODAYS_PATIENTS: "Bệnh nhân hôm nay",
			APPOINTMENTS: "Lịch hẹn",
			RECORDS_UPDATED: "Hồ sơ đã cập nhật",
			ACTIVE_CASES: "Ca bệnh đang điều trị",
		},

		SCHEDULE: {
			TITLE: "Lịch trình hôm nay",
			DESCRIPTION: "Các cuộc hẹn và nhiệm vụ sắp tới của bạn",
			PATIENT_CONSULTATION: "Khám bệnh nhân",
			SURGERY_REVIEW: "Đánh giá phẫu thuật",
			POST_OP_CHECKUP: "Kiểm tra sau phẫu thuật",
			STAFF_MEETING: "Họp nhân viên",
			DEPARTMENT_REVIEW: "Đánh giá khoa",
		},

		QUICK_ACTIONS: {
			TITLE: "Thao tác nhanh",
			DESCRIPTION: "Các tác vụ thường dùng và phím tắt",
			NEW_PATIENT: "Bệnh nhân mới",
			CREATE_RECORD: "Tạo hồ sơ",
			SCHEDULE: "Lịch trình",
			SETTINGS: "Cài đặt",
		},

		PROFILE: {
			TITLE: "Hồ sơ của bạn",
			DESCRIPTION: "Thông tin nghề nghiệp và chứng chỉ của bạn",
			FULL_NAME: "Họ và tên",
			EMAIL: "Email",
			USER_ID: "Mã người dùng",
			PRIMARY_ROLE: "Vai trò chính",
			ALL_ROLES: "Tất cả vai trò",
			STATUS: "Trạng thái",
			PHONE: "Số điện thoại",
			ADDRESS: "Địa chỉ",
			ACTIVE: "Hoạt động",
			INACTIVE: "Không hoạt động",
		},
	},

	// Roles
	ROLES: {
		STAFF: "Nhân viên",
		LAB_TESTING_TECHNICIAN: "Kỹ thuật viên xét nghiệm",
		ANALYSIS_TECHNICIAN: "Kỹ thuật viên phân tích",
		VALIDATION_TECHNICIAN: "Kỹ thuật viên thẩm định",
		DOCTOR: "Bác sĩ",
		MEDICAL_PROFESSIONAL: "Chuyên viên y tế",
	},

	// Common UI Elements
	COMMON: {
		LOADING: "Đang tải...",
		ERROR: "Lỗi",
		SUCCESS: "Thành công",
		WARNING: "Cảnh báo",
		INFO: "Thông tin",
		CANCEL: "Hủy",
		CONFIRM: "Xác nhận",
		SAVE: "Lưu",
		EDIT: "Chỉnh sửa",
		DELETE: "Xóa",
		VIEW: "Xem",
		SEARCH: "Tìm kiếm",
		FILTER: "Lọc",
		SORT: "Sắp xếp",
		EXPORT: "Xuất",
		IMPORT: "Nhập",
		PRINT: "In",
		CLOSE: "Đóng",
		SIGN_UP: "Đăng ký",
		NO_ACCOUNT: "Chưa có tài khoản?",
		LOGIN_WITH_GOOGLE: "Đăng nhập bằng Google",
	},

	// Time
	TIME: {
		AM: "SA",
		PM: "CH",
		TODAY: "Hôm nay",
		YESTERDAY: "Hôm qua",
		TOMORROW: "Ngày mai",
		THIS_WEEK: "Tuần này",
		THIS_MONTH: "Tháng này",
		THIS_YEAR: "Năm này",
	},

	// Errors
	ERRORS: {
		NETWORK_ERROR: "Lỗi kết nối mạng",
		SERVER_ERROR: "Lỗi máy chủ",
		UNAUTHORIZED: "Không có quyền truy cập",
		FORBIDDEN: "Truy cập bị cấm",
		NOT_FOUND: "Không tìm thấy",
		VALIDATION_ERROR: "Lỗi xác thực dữ liệu",
		UNKNOWN_ERROR: "Lỗi không xác định",
	},
}

// Helper function to get nested values safely
export const getLocalizationText = (path: string): string => {
	return path.split(".").reduce((obj: any, key: string) => {
		return obj?.[key] || path
	}, LOCALIZATION)
}

export default LOCALIZATION
