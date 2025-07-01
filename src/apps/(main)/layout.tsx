import { useState } from "react"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import {
	Users,
	Settings,
	LogOut,
	Menu,
	Search,
	User,
	FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar"
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

const navigation = [
	{
		name: "Bệnh nhân",
		href: "/",
		icon: Users,
		current: true,
	},
	{
		name: "Cài đặt",
		href: "/settings",
		icon: Settings,
		current: false,
	},
]

export default function MainLayout() {
	const navigate = useNavigate()
	const location = useLocation()
	const { user, clearAuth } = useAuthStore()
	const [searchQuery, setSearchQuery] = useState("")

	const handleLogout = () => {
		clearAuth()
		navigate("/auth/login")
	}

	const currentPath = location.pathname
	const isPatientDetail = /^\/\d+$/.test(currentPath)
	const isHomePage = currentPath === "/"

	return (
		<SidebarProvider>
			<div className="min-h-screen w-full flex">
				<Sidebar className="w-64 flex-shrink-0">
					<SidebarHeader className="p-4 border-b">
						<div className="flex items-center space-x-2">
							<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
								<FileText className="h-5 w-5 text-white" />
							</div>
							<div>
								<h1 className="text-lg font-bold">
									BDGAD{" "}
									<span className="border-b border-black">
										EMR
									</span>
								</h1>
								<p className="text-sm text-muted-foreground">
									Hệ thống quản lý hồ sơ y tế
								</p>
							</div>
						</div>
					</SidebarHeader>

					<SidebarContent className="p-4">
						<SidebarMenu>
							{navigation.map((item) => {
								const isActive =
									item.href === "/"
										? isHomePage || isPatientDetail
										: currentPath.startsWith(item.href)

								return (
									<SidebarMenuItem key={item.name}>
										<SidebarMenuButton
											asChild
											isActive={isActive}
											className="w-full justify-start"
										>
											<button
												onClick={() =>
													navigate(item.href)
												}
												className="flex items-center space-x-3 w-full"
											>
												<item.icon className="h-5 w-5" />
												<span>{item.name}</span>
											</button>
										</SidebarMenuButton>
									</SidebarMenuItem>
								)
							})}
						</SidebarMenu>
					</SidebarContent>
				</Sidebar>

				<div className="flex-1 flex flex-col min-w-0 w-full">
					{/* Header */}
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
										onChange={(e) =>
											setSearchQuery(e.target.value)
										}
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
												<AvatarImage
													src=""
													alt={user?.name}
												/>
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
									<DropdownMenuContent
										align="end"
										className="w-56"
									>
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
										<DropdownMenuItem
											onClick={handleLogout}
										>
											<LogOut className="mr-2 h-4 w-4" />
											Đăng xuất
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
					</header>

					{/* Main Content */}
					<main className="flex-1 overflow-auto bg-gray-50 w-full">
						<Outlet />
					</main>
				</div>
			</div>
		</SidebarProvider>
	)
}
