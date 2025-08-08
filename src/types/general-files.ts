export interface GeneralFile {
	id: number
	file_name: string
	file_type: string
	file_size: number
	uploaded_at: string
	send_emr_at: string
}

export interface FileCategory {
	category_id: number
	category_name: string
	category_description: string
	file_count: number
	files: GeneralFile[]
}

export interface FilesByCategoriesResponse {
	total_files: number
	total_categories: number
	categories: FileCategory[]
}
