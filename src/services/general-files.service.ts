import { api } from "@/utils/api"
import type { FilesByCategoriesResponse } from "@/types/general-files"

export class GeneralFilesService {
	static async getFilesByCategories(): Promise<FilesByCategoriesResponse> {
		const response = await api.get("general-files/by-categories")
		return (await response.json()) as FilesByCategoriesResponse
	}

	static async downloadFile(fileId: number): Promise<Blob> {
		const response = await api.get(`general-files/${fileId}`)
		return await response.blob()
	}
}
