import { Component } from "react"
import type { ErrorInfo, ReactNode } from "react"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface Props {
	children: ReactNode
	fallback?: ReactNode
}

interface State {
	hasError: boolean
	error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error }
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("ErrorBoundary caught an error:", error, errorInfo)
	}

	handleReset = () => {
		this.setState({ hasError: false, error: undefined })
	}

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback
			}

			return (
				<Card className="w-full max-w-md mx-auto">
					<CardHeader>
						<CardTitle className="flex items-center space-x-2 text-destructive">
							<AlertTriangle className="h-5 w-5" />
							<span>Đã xảy ra lỗi</span>
						</CardTitle>
						<CardDescription>
							Ứng dụng gặp sự cố. Vui lòng thử lại hoặc liên hệ hỗ
							trợ kỹ thuật.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{process.env.NODE_ENV === "development" &&
							this.state.error && (
								<div className="p-4 bg-muted rounded-md">
									<pre className="text-xs text-muted-foreground overflow-auto">
										{this.state.error.message}
									</pre>
								</div>
							)}
						<Button
							onClick={this.handleReset}
							className="w-full"
							variant="outline"
						>
							<RefreshCw className="h-4 w-4 mr-2" />
							Thử lại
						</Button>
					</CardContent>
				</Card>
			)
		}

		return this.props.children
	}
}
