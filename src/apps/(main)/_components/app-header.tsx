import { useNavigate } from "react-router-dom"
import { Menu, LogOut, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { useUserProfile } from "@/hooks/useUserQuery"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import useChatbotStore from "@/stores/chatbot.store"

export function AppHeader() {
	const navigate = useNavigate()
	const { clearAuth } = useAuthStore()
	const { data: user, isLoading } = useUserProfile()
	const { isChatbotOpen, setOpen } = useChatbotStore()

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
				</div>

				<div className="flex items-center space-x-4">
					{/* User Menu */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="flex items-center space-x-2"
								disabled={isLoading}
							>
								<Avatar className="h-8 w-8">
									<AvatarImage
										src={
											user?.metadata?.googlePicture || ""
										}
										alt={user?.name || "User avatar"}
										className="object-cover"
									/>
									<AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
										{isLoading
											? "..."
											: user?.name
													?.split(" ")
													.map((n: string) => n[0])
													.join("")
													.toUpperCase() || "U"}
									</AvatarFallback>
								</Avatar>
								<div className="hidden md:block text-left">
									<p className="text-sm font-medium">
										{isLoading
											? "Loading..."
											: user?.name || "User"}
									</p>
									<p className="text-xs text-muted-foreground">
										{isLoading
											? "Loading..."
											: user?.email || "No email"}
									</p>
								</div>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuLabel>
								Tài khoản của tôi
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{/* <DropdownMenuItem>
								<User className="mr-2 h-4 w-4" />
								Thông tin cá nhân
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings className="mr-2 h-4 w-4" />
								Cài đặt
							</DropdownMenuItem> */}
							{/* <DropdownMenuSeparator /> */}
							<DropdownMenuItem onClick={handleLogout}>
								<LogOut className="mr-2 h-4 w-4" />
								Đăng xuất
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{isChatbotOpen ? null : (
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="secondary"
									size="icon"
									className="size-8 cursor-pointer"
									onClick={() => setOpen(true)}
								>
									<MessageCircle />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Chatbot</TooltipContent>
						</Tooltip>
					)}
				</div>
			</div>
		</header>
	)
}
