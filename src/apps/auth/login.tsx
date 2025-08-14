import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useGoogleAuth } from "@/hooks/useGoogleAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Eye, EyeOff, Stethoscope, Lock, Mail } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LOCALIZATION } from "@/utils/localization"

const LoginPage = () => {
	const { login, isLoading } = useAuth()
	const { initiateGoogleLogin, loading: googleLoading } = useGoogleAuth()
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	})
	const [showPassword, setShowPassword] = useState(false)
	const [error, setError] = useState("")
	const [isSubmitting, setIsSubmitting] = useState(false)

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
		setIsSubmitting(true)

		// Basic validation
		if (!formData.email || !formData.password) {
			setError(LOCALIZATION.AUTH.LOGIN.VALIDATION.FILL_ALL_FIELDS)
			setIsSubmitting(false)
			return
		}

		if (!formData.email.includes("@")) {
			setError(LOCALIZATION.AUTH.LOGIN.VALIDATION.VALID_EMAIL)
			setIsSubmitting(false)
			return
		}

		try {
			await login(formData)	
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: LOCALIZATION.AUTH.LOGIN.VALIDATION.LOGIN_FAILED
			setError(errorMessage)
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleGoogleLogin = async () => {
		setError("")
		await initiateGoogleLogin()
	}

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword)
	}

	// Determine if any loading state is active
	const isLoadingState = isSubmitting || isLoading || googleLoading

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
						{LOCALIZATION.AUTH.LOGIN.TITLE}
					</CardTitle>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						{error && (
							<Alert variant="destructive">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<div className="space-y-2">
							<Label
								htmlFor="email"
								className="text-sm font-medium text-gray-700"
							>
								{LOCALIZATION.AUTH.LOGIN.EMAIL_LABEL}
							</Label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
								<Input
									id="email"
									name="email"
									type="email"
									value={formData.email}
									onChange={handleInputChange}
									placeholder={
										LOCALIZATION.AUTH.LOGIN
											.EMAIL_PLACEHOLDER
									}
									className="pl-10"
									disabled={isLoadingState}
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label
								htmlFor="password"
								className="text-sm font-medium text-gray-700"
							>
								{LOCALIZATION.AUTH.LOGIN.PASSWORD_LABEL}
							</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
								<Input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									value={formData.password}
									onChange={handleInputChange}
									placeholder={
										LOCALIZATION.AUTH.LOGIN
											.PASSWORD_PLACEHOLDER
									}
									className="pl-10 pr-10"
									disabled={isLoadingState}
									required
								/>
								<button
									type="button"
									onClick={togglePasswordVisibility}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
									disabled={isLoadingState}
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</button>
							</div>
						</div>

						<Button
							type="submit"
							className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
							disabled={isLoadingState}
						>
							{isSubmitting || isLoading ? (
								<div className="flex items-center justify-center">
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
									{LOCALIZATION.AUTH.LOGIN.SUBMITTING}
								</div>
							) : (
								LOCALIZATION.AUTH.LOGIN.SUBMIT_BUTTON
							)}
						</Button>

						<div className="text-center">
							<Link
								to="/auth/forgot-password"
								className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
							>
								{LOCALIZATION.AUTH.LOGIN.FORGOT_PASSWORD}
							</Link>
						</div>
					</form>

					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t border-gray-200" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-white px-2 text-gray-500">
									Hoặc tiếp tục với
								</span>
							</div>
						</div>

						<Button
							type="button"
							variant="outline"
							className="w-full mt-4"
							onClick={handleGoogleLogin}
							disabled={isLoadingState}
						>
							{googleLoading ? (
								<div className="flex items-center justify-center">
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
									Đang kết nối với Google...
								</div>
							) : (
								<div className="flex items-center justify-center">
									<svg
										className="w-4 h-4 mr-2"
										viewBox="0 0 24 24"
									>
										<path
											fill="currentColor"
											d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
										/>
										<path
											fill="currentColor"
											d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
										/>
										<path
											fill="currentColor"
											d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
										/>
										<path
											fill="currentColor"
											d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
										/>
									</svg>
									Đăng nhập với Google
								</div>
							)}
						</Button>
					</div>

					<div className="mt-6 pt-6 border-t border-gray-200">
						<div className="text-xs text-gray-500 text-center space-y-1">
							<p>{LOCALIZATION.AUTH.LOGIN.SECURE_ACCESS}</p>
							<p>{LOCALIZATION.AUTH.LOGIN.AUTHORIZED_ONLY}</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default LoginPage
