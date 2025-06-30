import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
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
import { Eye, EyeOff, Stethoscope, Lock, Mail } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LOCALIZATION } from "@/utils/localization"

const LoginPage = () => {
	const { login, isLoading } = useAuth()
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

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword)
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
						{LOCALIZATION.AUTH.LOGIN.TITLE}
					</CardTitle>
					<CardDescription className="text-gray-600">
						{LOCALIZATION.AUTH.LOGIN.DESCRIPTION}
					</CardDescription>
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
									disabled={isSubmitting || isLoading}
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
									disabled={isSubmitting || isLoading}
									required
								/>
								<button
									type="button"
									onClick={togglePasswordVisibility}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
									disabled={isSubmitting || isLoading}
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
							disabled={isSubmitting || isLoading}
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
