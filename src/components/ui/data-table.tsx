import React from "react"
import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table"
import type {
	ColumnDef,
	SortingState,
	ColumnFiltersState,
	VisibilityState,
} from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
	ChevronDown,
	ArrowUpDown,
	ChevronLeft,
	ChevronRight,
} from "lucide-react"

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	searchable?: boolean
	searchColumn?: string
	pagination?: boolean
	className?: string
}

export function DataTable<TData, TValue>({
	columns,
	data,
	searchable = true,
	searchColumn,
	pagination = true,
	className,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({})
	const [globalFilter, setGlobalFilter] = React.useState("")

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onGlobalFilterChange: setGlobalFilter,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			globalFilter,
		},
	})

	return (
		<div className={cn("w-full space-y-4", className)}>
			{/* Toolbar */}
			<div className="flex items-center justify-between">
				{searchable && (
					<div className="flex items-center py-4">
						<Input
							placeholder={
								searchColumn
									? `Tìm kiếm theo ${searchColumn}...`
									: "Tìm kiếm..."
							}
							value={globalFilter ?? ""}
							onChange={(event) =>
								setGlobalFilter(String(event.target.value))
							}
							className="max-w-sm"
						/>
					</div>
				)}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto">
							Cột <ChevronDown className="ml-2 h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={(value) =>
											column.toggleVisibility(!!value)
										}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								)
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Table */}
			<div className="rounded-md border w-full">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											className="text-left"
										>
											{header.isPlaceholder ? null : (
												<div
													{...{
														className:
															header.column.getCanSort()
																? "cursor-pointer select-none flex items-center gap-2"
																: "",
														onClick:
															header.column.getToggleSortingHandler(),
													}}
												>
													{flexRender(
														header.column.columnDef
															.header,
														header.getContext()
													)}
													{header.column.getCanSort() && (
														<ArrowUpDown className="h-4 w-4" />
													)}
													{{
														asc: " 🔼",
														desc: " 🔽",
													}[
														header.column.getIsSorted() as string
													] ?? null}
												</div>
											)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={
										row.getIsSelected() && "selected"
									}
									className="hover:bg-muted/50"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									Không có dữ liệu.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			{pagination && (
				<div className="flex items-center justify-between space-x-2 py-4">
					<div className="flex-1 text-sm text-muted-foreground">
						{table.getFilteredSelectedRowModel().rows.length > 0 ? (
							<>
								{
									table.getFilteredSelectedRowModel().rows
										.length
								}{" "}
								trong {table.getFilteredRowModel().rows.length}{" "}
								hàng được chọn.
							</>
						) : (
							<>
								Hiển thị {table.getRowModel().rows.length} trong{" "}
								{table.getFilteredRowModel().rows.length} kết
								quả.
							</>
						)}
					</div>
					<div className="flex items-center space-x-6 lg:space-x-8">
						<div className="flex items-center space-x-2">
							<p className="text-sm font-medium">
								Số hàng mỗi trang
							</p>
							<select
								value={table.getState().pagination.pageSize}
								onChange={(e) => {
									table.setPageSize(Number(e.target.value))
								}}
								className="h-8 w-[70px] rounded border border-input bg-background px-3 py-1 text-sm"
							>
								{[10, 20, 30, 40, 50].map((pageSize) => (
									<option key={pageSize} value={pageSize}>
										{pageSize}
									</option>
								))}
							</select>
						</div>
						<div className="flex w-[100px] items-center justify-center text-sm font-medium">
							Trang {table.getState().pagination.pageIndex + 1}{" "}
							trong {table.getPageCount()}
						</div>
						<div className="flex items-center space-x-2">
							<Button
								variant="outline"
								className="h-8 w-8 p-0"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
							>
								<span className="sr-only">Trang trước</span>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								className="h-8 w-8 p-0"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
							>
								<span className="sr-only">Trang sau</span>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

// Export column helper for easier column definitions
export { type ColumnDef } from "@tanstack/react-table"
