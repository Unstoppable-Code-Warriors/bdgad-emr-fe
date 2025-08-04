import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Wifi, WifiOff, Activity } from "lucide-react"
import { api } from "@/utils/api"

export function ApiStatus() {
	const [isOnline, setIsOnline] = useState(true)
	const [lastCheck, setLastCheck] = useState<Date>(new Date())

	useEffect(() => {
		const checkApiStatus = async () => {
			try {
				await api.get("health", { timeout: 5000 })
				setIsOnline(true)
			} catch (error) {
				setIsOnline(false)
			}
			setLastCheck(new Date())
		}

		// Check immediately
		checkApiStatus()

		// Check every 30 seconds
		const interval = setInterval(checkApiStatus, 30000)

		return () => clearInterval(interval)
	}, [])

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("vi-VN", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		})
	}

	return (
		<Card className="w-full">
			<CardContent className="p-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						{isOnline ? (
							<>
								<Wifi className="h-4 w-4 text-green-600" />
								<Badge
									variant="secondary"
									className="bg-green-100 text-green-800"
								>
									API Hoạt động
								</Badge>
							</>
						) : (
							<>
								<WifiOff className="h-4 w-4 text-red-600" />
								<Badge variant="destructive">API Lỗi</Badge>
							</>
						)}
					</div>
					<div className="flex items-center space-x-1 text-xs text-muted-foreground">
						<Activity className="h-3 w-3" />
						<span>Kiểm tra: {formatTime(lastCheck)}</span>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
