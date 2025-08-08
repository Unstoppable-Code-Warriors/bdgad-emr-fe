import { useNavigate, useLocation, Link } from "react-router-dom"
import { Users, FileText, LayoutDashboard } from "lucide-react"
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from "@/components/ui/sidebar"

const navigation = [
	{
		name: "Dashboard",
		href: "/dashboard",
		icon: LayoutDashboard,
		current: false,
	},
	{
		name: "Bệnh nhân",
		href: "/patients",
		icon: Users,
		current: false,
	},
	{
		name: "Tệp chung",
		href: "/general-files",
		icon: FileText,
		current: false,
	},
	// {
	// 	name: "Cài đặt",
	// 	href: "/settings",
	// 	icon: Settings,
	// 	current: false,
	// },
]

export function AppSidebar() {
	const navigate = useNavigate()
	const location = useLocation()

	const currentPath = location.pathname
	const isPatientDetail = /^\/patients\/\d+$/.test(currentPath)

	return (
		<Sidebar className="w-64 flex-shrink-0">
			<SidebarHeader className="p-4 border-b">
				<div className="flex items-center space-x-2">
					<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
						<FileText className="h-5 w-5 text-white" />
					</div>
					<Link to="/dashboard">
						<h1 className="text-lg font-bold">
							BDGAD{" "}
							<span className="border-b border-black">EMR</span>
						</h1>
						<p className="text-sm text-muted-foreground">
							Hệ thống quản lý hồ sơ y tế
						</p>
					</Link>
				</div>
			</SidebarHeader>

			<SidebarContent className="p-4">
				<SidebarMenu>
					{navigation.map((item) => {
						const isActive =
							item.href === "/patients"
								? currentPath === "/patients" || isPatientDetail
								: currentPath === item.href

						return (
							<SidebarMenuItem key={item.name}>
								<SidebarMenuButton
									asChild
									isActive={isActive}
									className="w-full justify-start"
								>
									<button
										onClick={() => navigate(item.href)}
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
	)
}
