import { useState } from "react"
import { Link } from "react-router-dom"
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
import { ArrowLeft, Mail, Stethoscope, CheckCircle } from "lucide-react"
import authService from "@/services/auth.service"
import { LOCALIZATION } from "@/utils/localization"

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState("")
	const [error, setError] = useState("")
	const [success, setSuccess] = useState("")
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError("")
		setSuccess("")
		setIsSubmitting(true)

		if (!email) {
			setError(LOCALIZATION.AUTH.FORGOT_PASSWORD.VALIDATION.ENTER_EMAIL)
			setIsSubmitting(false)
			return
		}

		if (!email.includes("@")) {
			setError(LOCALIZATION.AUTH.FORGOT_PASSWORD.VALIDATION.VALID_EMAIL)
			setIsSubmitting(false)
			return
		}

		try {
			await authService.forgotPassword({
				email,
				redirectUrl: window.location.origin + "/auth",
			})
			setSuccess(LOCALIZATION.AUTH.FORGOT_PASSWORD.SUCCESS_MESSAGE)
			setEmail("")
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: LOCALIZATION.AUTH.FORGOT_PASSWORD.VALIDATION.RESET_FAILED
			setError(errorMessage)
		} finally {
			setIsSubmitting(false)
		}
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
						{LOCALIZATION.AUTH.FORGOT_PASSWORD.TITLE}
					</CardTitle>
					<CardDescription className="text-gray-600">
						{LOCALIZATION.AUTH.FORGOT_PASSWORD.DESCRIPTION}
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
									{success}
								</AlertDescription>
							</Alert>
						)}

						<div className="space-y-2">
							<Label
								htmlFor="email"
								className="text-sm font-medium text-gray-700"
							>
								{LOCALIZATION.AUTH.FORGOT_PASSWORD.EMAIL_LABEL}
							</Label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
								<Input
									id="email"
									name="email"
									type="email"
									value={email}
									onChange={(e) => {
										setEmail(e.target.value)
										if (error) setError("")
										if (success) setSuccess("")
									}}
									placeholder={
										LOCALIZATION.AUTH.FORGOT_PASSWORD
											.EMAIL_PLACEHOLDER
									}
									className="pl-10"
									disabled={isSubmitting}
									required
								/>
							</div>
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
										LOCALIZATION.AUTH.FORGOT_PASSWORD
											.SUBMITTING
									}
								</div>
							) : (
								LOCALIZATION.AUTH.FORGOT_PASSWORD.SUBMIT_BUTTON
							)}
						</Button>

						<div className="text-center">
							<Link
								to="/auth/login"
								className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
							>
								<ArrowLeft className="w-4 h-4 mr-1" />
								{
									LOCALIZATION.AUTH.FORGOT_PASSWORD
										.BACK_TO_LOGIN
								}
							</Link>
						</div>
					</form>

					<div className="mt-6 pt-6 border-t border-gray-200">
						<div className="text-xs text-gray-500 text-center space-y-1">
							<p>
								{LOCALIZATION.AUTH.FORGOT_PASSWORD.SECURE_RESET}
							</p>
							<p>
								{LOCALIZATION.AUTH.FORGOT_PASSWORD.CHECK_SPAM}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default ForgotPasswordPage
