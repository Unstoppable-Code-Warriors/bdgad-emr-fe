import { useState, useEffect } from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
	ArrowLeft,
	Lock,
	Stethoscope,
	Eye,
	EyeOff,
	CheckCircle,
} from "lucide-react"
import authService from "@/services/auth.service"
import { LOCALIZATION } from "@/utils/localization"

const ResetPasswordPage = () => {
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()
	const [formData, setFormData] = useState({
		newPassword: "",
		confirmPassword: "",
	})
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [error, setError] = useState("")
	const [success, setSuccess] = useState("")
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [token, setToken] = useState("")

	useEffect(() => {
		const resetToken = searchParams.get("token")
		if (!resetToken) {
			setError(LOCALIZATION.AUTH.RESET_PASSWORD.VALIDATION.MISSING_TOKEN)
			return
		}
		setToken(resetToken)
	}, [searchParams])

	const validatePassword = (password: string): string[] => {
		const errors: string[] = []
		if (password.length < 8) {
			errors.push(LOCALIZATION.AUTH.RESET_PASSWORD.VALIDATION.MIN_LENGTH)
		}
		if (!/(?=.*[a-z])/.test(password)) {
			errors.push(
				LOCALIZATION.AUTH.RESET_PASSWORD.VALIDATION.LOWERCASE_REQUIRED
			)
		}
		if (!/(?=.*[A-Z])/.test(password)) {
			errors.push(
				LOCALIZATION.AUTH.RESET_PASSWORD.VALIDATION.UPPERCASE_REQUIRED
			)
		}
		if (!/(?=.*\d)/.test(password)) {
			errors.push(
				LOCALIZATION.AUTH.RESET_PASSWORD.VALIDATION.NUMBER_REQUIRED
			)
		}
		if (!/(?=.*[@$!%*?&])/.test(password)) {
			errors.push(
				LOCALIZATION.AUTH.RESET_PASSWORD.VALIDATION
					.SPECIAL_CHAR_REQUIRED
			)
		}
		return errors
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))
		// Clear error when user starts typing
		if (error) setError("")
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError("")
		setSuccess("")
		setIsSubmitting(true)

		if (!token) {
			setError(LOCALIZATION.AUTH.RESET_PASSWORD.VALIDATION.INVALID_TOKEN)
			setIsSubmitting(false)
			return
		}

		if (!formData.newPassword || !formData.confirmPassword) {
			setError(
				LOCALIZATION.AUTH.RESET_PASSWORD.VALIDATION.FILL_ALL_FIELDS
			)
			setIsSubmitting(false)
			return
		}

		if (formData.newPassword !== formData.confirmPassword) {
			setError(
				LOCALIZATION.AUTH.RESET_PASSWORD.VALIDATION.PASSWORDS_NOT_MATCH
			)
			setIsSubmitting(false)
			return
		}

		const passwordErrors = validatePassword(formData.newPassword)
		if (passwordErrors.length > 0) {
			setError(passwordErrors.join(". "))
			setIsSubmitting(false)
			return
		}

		try {
			const res = await authService.resetPassword({
				token,
				newPassword: formData.newPassword,
				confirmPassword: formData.confirmPassword,
			})
			setSuccess(LOCALIZATION.AUTH.RESET_PASSWORD.SUCCESS_MESSAGE)
			setFormData({ newPassword: "", confirmPassword: "" })
			console.log(res)

			// Redirect to login after 3 seconds
			setTimeout(() => {
				navigate("/auth/login")
			}, 3000)
		} catch (err) {
			console.log(err)

			const errorMessage =
				err instanceof Error
					? err.message
					: LOCALIZATION.AUTH.RESET_PASSWORD.VALIDATION.RESET_FAILED
			setError(errorMessage)
		} finally {
			setIsSubmitting(false)
		}
	}

	if (!token && !error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
				<Card className="w-full max-w-md shadow-xl">
					<CardContent className="pt-6">
						<div className="text-center">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
							<p className="mt-2 text-gray-600">
								{LOCALIZATION.AUTH.RESET_PASSWORD.LOADING}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
			<Card className="w-full max-w-md shadow-xl">
				<CardHeader className="space-y-2 text-center">
					<div className="flex justify-center mb-4">
						<div className="p-3 bg-blue-100 rounded-full">
							<Stethoscope className="h-8 w-8 text-blue-600" />
						</div>
					</div>
					<CardTitle className="text-2xl font-bold text-gray-900">
						{LOCALIZATION.AUTH.RESET_PASSWORD.TITLE}
					</CardTitle>
					<CardDescription className="text-gray-600">
						{LOCALIZATION.AUTH.RESET_PASSWORD.DESCRIPTION}
					</CardDescription>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						{error && (
							<Alert variant="destructive">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						{success && (
							<Alert className="border-green-200 bg-green-50">
								<CheckCircle className="h-4 w-4 text-green-600" />
								<AlertDescription className="text-green-800">
									{success}{" "}
									{
										LOCALIZATION.AUTH.RESET_PASSWORD
											.REDIRECTING
									}
								</AlertDescription>
							</Alert>
						)}

						{!success && (
							<>
								<div className="space-y-2">
									<Label
										htmlFor="newPassword"
										className="text-sm font-medium text-gray-700"
									>
										{
											LOCALIZATION.AUTH.RESET_PASSWORD
												.NEW_PASSWORD_LABEL
										}
									</Label>
									<div className="relative">
										<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
										<Input
											id="newPassword"
											name="newPassword"
											type={
												showPassword
													? "text"
													: "password"
											}
											value={formData.newPassword}
											onChange={handleInputChange}
											placeholder={
												LOCALIZATION.AUTH.RESET_PASSWORD
													.NEW_PASSWORD_PLACEHOLDER
											}
											className="pl-10 pr-10"
											disabled={isSubmitting}
											required
										/>
										<button
											type="button"
											onClick={() =>
												setShowPassword(!showPassword)
											}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
											disabled={isSubmitting}
										>
											{showPassword ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</button>
									</div>
								</div>

								<div className="space-y-2">
									<Label
										htmlFor="confirmPassword"
										className="text-sm font-medium text-gray-700"
									>
										{
											LOCALIZATION.AUTH.RESET_PASSWORD
												.CONFIRM_PASSWORD_LABEL
										}
									</Label>
									<div className="relative">
										<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
										<Input
											id="confirmPassword"
											name="confirmPassword"
											type={
												showConfirmPassword
													? "text"
													: "password"
											}
											value={formData.confirmPassword}
											onChange={handleInputChange}
											placeholder={
												LOCALIZATION.AUTH.RESET_PASSWORD
													.CONFIRM_PASSWORD_PLACEHOLDER
											}
											className="pl-10 pr-10"
											disabled={isSubmitting}
											required
										/>
										<button
											type="button"
											onClick={() =>
												setShowConfirmPassword(
													!showConfirmPassword
												)
											}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
											disabled={isSubmitting}
										>
											{showConfirmPassword ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</button>
									</div>
								</div>

								<div className="text-xs text-gray-600 space-y-1">
									<p>
										{
											LOCALIZATION.AUTH.RESET_PASSWORD
												.PASSWORD_REQUIREMENTS.TITLE
										}
									</p>
									<ul className="list-disc list-inside space-y-1 ml-2">
										{LOCALIZATION.AUTH.RESET_PASSWORD.PASSWORD_REQUIREMENTS.ITEMS.map(
											(item, index) => (
												<li key={index}>{item}</li>
											)
										)}
									</ul>
								</div>

								<Button
									type="submit"
									className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
									disabled={isSubmitting}
								>
									{isSubmitting ? (
										<div className="flex items-center justify-center">
											<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
											{
												LOCALIZATION.AUTH.RESET_PASSWORD
													.SUBMITTING
											}
										</div>
									) : (
										LOCALIZATION.AUTH.RESET_PASSWORD
											.SUBMIT_BUTTON
									)}
								</Button>
							</>
						)}

						<div className="text-center">
							<Link
								to="/auth/login"
								className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
							>
								<ArrowLeft className="w-4 h-4 mr-1" />
								{LOCALIZATION.AUTH.RESET_PASSWORD.BACK_TO_LOGIN}
							</Link>
						</div>
					</form>

					<div className="mt-6 pt-6 border-t border-gray-200">
						<div className="text-xs text-gray-500 text-center space-y-1">
							<p>
								🔒 Đặt lại mật khẩu bảo mật cho chuyên viên y tế
							</p>
							<p>
								Mật khẩu mới của bạn sẽ được mã hóa và bảo mật
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default ResetPasswordPage
