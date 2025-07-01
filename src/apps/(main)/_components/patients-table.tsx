import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { DataTable, type ColumnDef } from "@/components/ui/data-table"
import type { Patient } from "@/types/patient"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface PatientsTableProps {
	patients: Patient[]
	isLoading?: boolean
}

export function PatientsTable({
	patients,
	isLoading = false,
}: PatientsTableProps) {
	const navigate = useNavigate()

	// Create columns with navigate function
	const columns: ColumnDef<Patient>[] = [
		{
			accessorKey: "patientCode",
			header: "Mã BN",
		},
		{
			accessorKey: "fullName",
			header: "Họ và tên",
			cell: ({ row }) => {
				const patient = row.original
				return (
					<button
						onClick={() => navigate(`/${patient.id}`)}
						className="text-left hover:text-blue-600 hover:underline cursor-pointer"
					>
						{patient.fullName}
					</button>
				)
			},
		},
		{
			accessorKey: "dateOfBirth",
			header: "Ngày sinh",
			cell: ({ row }) => {
				const date = row.getValue("dateOfBirth") as string
				return format(new Date(date), "dd/MM/yyyy", { locale: vi })
			},
		},
		{
			accessorKey: "gender",
			header: "Giới tính",
			cell: ({ row }) => {
				const gender = row.getValue("gender") as string
				const genderMap = {
					male: "Nam",
					female: "Nữ",
					other: "Khác",
				}
				return genderMap[gender as keyof typeof genderMap] || gender
			},
		},
		{
			accessorKey: "phoneNumber",
			header: "Số điện thoại",
		},
		{
			accessorKey: "lastVisit",
			header: "Lần khám cuối",
			cell: ({ row }) => {
				const lastVisit = row.getValue("lastVisit") as string
				return lastVisit
					? format(new Date(lastVisit), "dd/MM/yyyy HH:mm", {
							locale: vi,
					  })
					: "Chưa có"
			},
		},
		{
			accessorKey: "status",
			header: "Trạng thái",
			cell: ({ row }) => {
				const status = row.getValue("status") as string
				return (
					<Badge
						variant={status === "active" ? "default" : "secondary"}
					>
						{status === "active"
							? "Đang điều trị"
							: "Ngưng điều trị"}
					</Badge>
				)
			},
		},
	]

	if (isLoading) {
		return (
			<div className="text-center py-8">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
				<p className="mt-2 text-muted-foreground">
					Đang tải dữ liệu...
				</p>
			</div>
		)
	}

	return (
		<DataTable
			columns={columns}
			data={patients}
			searchable={false}
			pagination={true}
		/>
	)
}
