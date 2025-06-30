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
			setError(
				"Invalid or missing reset token. Please request a new password reset."
			)
			return
		}
		setToken(resetToken)
	}, [searchParams])

	const validatePassword = (password: string): string[] => {
		const errors: string[] = []
		if (password.length < 8) {
			errors.push("Password must be at least 8 characters long")
		}
		if (!/(?=.*[a-z])/.test(password)) {
			errors.push("Password must contain at least one lowercase letter")
		}
		if (!/(?=.*[A-Z])/.test(password)) {
			errors.push("Password must contain at least one uppercase letter")
		}
		if (!/(?=.*\d)/.test(password)) {
			errors.push("Password must contain at least one number")
		}
		if (!/(?=.*[@$!%*?&])/.test(password)) {
			errors.push(
				"Password must contain at least one special character (@$!%*?&)"
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
			setError(
				"Invalid reset token. Please request a new password reset."
			)
			setIsSubmitting(false)
			return
		}

		if (!formData.newPassword || !formData.confirmPassword) {
			setError("Please fill in all fields")
			setIsSubmitting(false)
			return
		}

		if (formData.newPassword !== formData.confirmPassword) {
			setError("Passwords do not match")
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
			await authService.resetPassword({
				token,
				newPassword: formData.newPassword,
			})
			setSuccess("Password has been reset successfully!")
			setFormData({ newPassword: "", confirmPassword: "" })

			// Redirect to login after 3 seconds
			setTimeout(() => {
				navigate("/auth/login")
			}, 3000)
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Failed to reset password. Please try again."
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
							<p className="mt-2 text-gray-600">Loading...</p>
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
						Reset Password
					</CardTitle>
					<CardDescription className="text-gray-600">
						Enter your new secure password
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
									{success} Redirecting to login...
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
										New Password
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
											placeholder="Enter new password"
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
										Confirm New Password
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
											placeholder="Confirm new password"
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
									<p>Password requirements:</p>
									<ul className="list-disc list-inside space-y-1 ml-2">
										<li>At least 8 characters long</li>
										<li>
											One uppercase and one lowercase
											letter
										</li>
										<li>At least one number</li>
										<li>
											At least one special character
											(@$!%*?&)
										</li>
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
											Resetting...
										</div>
									) : (
										"Reset Password"
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
								Back to Login
							</Link>
						</div>
					</form>

					<div className="mt-6 pt-6 border-t border-gray-200">
						<div className="text-xs text-gray-500 text-center space-y-1">
							<p>
								🔒 Secure password reset for medical
								professionals
							</p>
							<p>
								Your new password will be encrypted and secure
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default ResetPasswordPage
