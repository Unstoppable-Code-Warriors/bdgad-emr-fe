import { useQuery } from "@tanstack/react-query"
import { GeneralFilesService } from "@/services/general-files.service"
import type { FilesByCategoriesResponse } from "@/types/general-files"

export function useFilesByCategories() {
	return useQuery<FilesByCategoriesResponse>({
		queryKey: ["general-files", "by-categories"],
		queryFn: () => GeneralFilesService.getFilesByCategories(),
		staleTime: 5 * 60 * 1000,
	})
}
