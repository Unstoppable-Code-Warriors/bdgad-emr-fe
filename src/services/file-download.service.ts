import { apiCall } from "@/utils/api"

export interface DownloadFileRequest {
	s3Url: string
	expiresIn?: number // Default 1 hour
}

export interface DownloadFileResponse {
	downloadUrl: string
	expiresIn: number
	expiresAt: string
}

export interface FileExistsResponse {
	exists: boolean
}

export class FileDownloadService {
	/**
	 * Generate a pre-signed download URL for a file stored in S3/R2
	 */
	static async generateDownloadUrl(
		request: DownloadFileRequest
	): Promise<DownloadFileResponse> {
		return await apiCall<DownloadFileResponse>(
			"post",
			"/files/download",
			request
		)
	}

	/**
	 * Check if a file exists in S3/R2
	 */
	static async checkFileExists(s3Url: string): Promise<boolean> {
		try {
			const response = await apiCall<FileExistsResponse>(
				"post",
				"/files/check",
				{
					s3Url,
				}
			)
			return response.exists
		} catch (error) {
			console.error("Error checking file existence:", error)
			return false
		}
	}

	/**
	 * Download file by opening in new tab/window
	 */
	static async downloadFile(
		s3Url: string,
		filename?: string,
		expiresIn?: number
	): Promise<void> {
		try {
			const { downloadUrl } = await this.generateDownloadUrl({
				s3Url,
				expiresIn,
			})

			// Create a temporary link element to trigger download
			const link = document.createElement("a")
			link.href = downloadUrl
			link.target = "_blank"
			if (filename) {
				link.download = filename
			}

			// Append to body, click, and remove
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		} catch (error) {
			console.error("Error downloading file:", error)
			throw new Error("Không thể tải file. Vui lòng thử lại sau.")
		}
	}

	/**
	 * Generate filename from S3 URL
	 */
	static extractFilenameFromUrl(s3Url: string): string {
		try {
			const url = new URL(s3Url)
			const pathParts = url.pathname
				.split("/")
				.filter((part) => part.length > 0)
			const filename = pathParts[pathParts.length - 1]
			return filename || "downloaded-file"
		} catch {
			return "downloaded-file"
		}
	}
}
