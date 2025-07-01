import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Menu, User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import useAuthStore from "@/stores/auth.store"

export function AppHeader() {
	const navigate = useNavigate()
	const { user, clearAuth } = useAuthStore()
	const [searchQuery, setSearchQuery] = useState("")

	const handleLogout = () => {
		clearAuth()
		navigate("/auth/login")
	}

	return (
		<header className="bg-white border-b border-gray-200 px-6 py-4 w-full">
			<div className="flex items-center justify-between w-full">
				<div className="flex items-center space-x-4">
					<SidebarTrigger>
						<Menu className="h-5 w-5" />
					</SidebarTrigger>

					<div className="relative w-96">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
						<Input
							type="text"
							placeholder="Tìm kiếm bệnh nhân, mã BN..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10 pr-4"
						/>
					</div>
				</div>

				<div className="flex items-center space-x-4">
					{/* User Menu */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="flex items-center space-x-2"
							>
								<Avatar className="h-8 w-8">
									<AvatarImage src="" alt={user?.name} />
									<AvatarFallback>
										{user?.name
											?.split(" ")
											.map((n) => n[0])
											.join("")
											.toUpperCase() || "U"}
									</AvatarFallback>
								</Avatar>
								<div className="hidden md:block text-left">
									<p className="text-sm font-medium">
										{user?.name}
									</p>
									<p className="text-xs text-muted-foreground">
										{user?.email}
									</p>
								</div>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuLabel>
								Tài khoản của tôi
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<User className="mr-2 h-4 w-4" />
								Thông tin cá nhân
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings className="mr-2 h-4 w-4" />
								Cài đặt
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={handleLogout}>
								<LogOut className="mr-2 h-4 w-4" />
								Đăng xuất
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	)
}
