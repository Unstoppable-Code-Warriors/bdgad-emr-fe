import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
	CheckCircle,
	XCircle,
	AlertCircle,
	Loader2,
	Stethoscope,
} from "lucide-react"
import useAuthStore from "@/stores/auth.store"
import { toast } from "sonner"
import { LOCALIZATION } from "@/utils/localization"
import authService from "@/services/auth.service"

const CallbackPage = () => {
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()
	const [processing, setProcessing] = useState(true)
	const [success, setSuccess] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const { setTokens, clearAuth } = useAuthStore()

	const handleCallback = async () => {
		try {
			const token = searchParams.get("token")
			const status = searchParams.get("status")
			const errorParam = searchParams.get("error")
			const message = searchParams.get("message")

			if (status === "success" && token) {
				// First, store the token temporarily
				setTokens({ token })

				try {
					// Fetch user profile to validate role
					const userResponse = await authService.getProfile()
					console.log(userResponse)

					const user = userResponse.data.user

					// Check if user has doctor role (code "5")
					const hasValidRole = user.roles.some(
						(role) => role.code === "5"
					)

					if (!hasValidRole) {
						// User doesn't have doctor role - clear tokens and show error
						clearAuth()
						setError(
							"Hệ thống EMR chỉ dành cho bác sĩ. Tài khoản của bạn không có quyền truy cập."
						)
						setProcessing(false)

						toast.error("Không có quyền truy cập", {
							description: "Hệ thống EMR chỉ dành cho bác sĩ",
						})

						// Redirect to login after a delay
						setTimeout(() => {
							navigate("/auth/login", { replace: true })
						}, 4000)
						return
					}

					// User has valid doctor role - proceed with success
					setSuccess(true)
					setProcessing(false)

					toast.success("Đăng nhập thành công", {
						description: "Bạn đã đăng nhập Google thành công",
					})

					// Redirect to home after a short delay
					setTimeout(() => {
						navigate("/", { replace: true })
					}, 1500)
				} catch (userError) {
					// Failed to fetch user profile - clear tokens
					clearAuth()
					console.error("Failed to fetch user profile:", userError)
					setError("Không thể xác thực thông tin người dùng")
					setProcessing(false)

					toast.error("Lỗi xác thực", {
						description: "Không thể xác thực thông tin người dùng",
					})

					setTimeout(() => {
						navigate("/auth/login", { replace: true })
					}, 3000)
				}
			} else if (errorParam) {
				// Authentication failed
				const errorMessage = message
					? decodeURIComponent(message)
					: "Đăng nhập Google thất bại"
				setError(errorMessage)
				setProcessing(false)

				toast.error("Đăng nhập Google thất bại", {
					description: errorMessage,
				})

				// Redirect to login after a delay
				setTimeout(() => {
					navigate("/auth/login", { replace: true })
				}, 3000)
			} else {
				// Invalid callback parameters
				setError("Phản hồi không hợp lệ từ Google OAuth")
				setProcessing(false)

				setTimeout(() => {
					navigate("/auth/login", { replace: true })
				}, 3000)
			}
		} catch (err) {
			console.error("OAuth callback error:", err)
			setError("Có lỗi xảy ra trong quá trình xử lý đăng nhập Google")
			setProcessing(false)

			setTimeout(() => {
				navigate("/auth/login", { replace: true })
			}, 3000)
		}
	}

	useEffect(() => {
		const processCallback = async () => {
			// Only run once
			if (processing) {
				await handleCallback()
			}
		}

		processCallback()
	}, []) // Remove dependencies to prevent infinite loop

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-4">
						<Stethoscope className="h-6 w-6" />
					</div>
					<h1 className="text-2xl font-semibold text-gray-900">
						{LOCALIZATION.AUTH.LOGIN.TITLE}
					</h1>
				</div>

				<Card>
					<CardHeader className="text-center">
						<CardTitle className="flex items-center justify-center gap-2">
							{processing && (
								<Loader2 className="h-5 w-5 animate-spin" />
							)}
							{success && (
								<CheckCircle className="h-5 w-5 text-green-600" />
							)}
							{error && (
								<XCircle className="h-5 w-5 text-red-600" />
							)}
							{processing && "Đang xử lý đăng nhập Google..."}
							{success && "Đăng nhập thành công!"}
							{error && "Đăng nhập thất bại"}
						</CardTitle>
						<CardDescription>
							{processing && "Vui lòng đợi trong giây lát"}
							{success &&
								"Bạn sẽ được chuyển hướng đến trang chủ..."}
							{error && "Bạn sẽ được chuyển về trang đăng nhập"}
						</CardDescription>
					</CardHeader>
					<CardContent>
						{error && (
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

export default CallbackPage
