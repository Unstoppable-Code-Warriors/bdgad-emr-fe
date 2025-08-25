import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useFilesByCategories } from "@/hooks/use-general-files";
import type { GeneralFile, FileCategory } from "@/types/general-files";
import { FileText, Folder, Download, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {  getPresignedUrlGeneralFiles } from "@/utils/api";

export default function GeneralFilesPage() {
  const { data, isLoading, isError } = useFilesByCategories();
  const [search, setSearch] = useState("");
  const [currentFolder, setCurrentFolder] = useState<FileCategory | null>(null);
  const [downloadingFileId, setDownloadingFileId] = useState<number | null>(
    null
  );

  console.log("data", data);  

  const filteredFolders = useMemo(() => {
    if (!data?.categories) return [];
    const term = search.trim().toLowerCase();
    if (!term) return data.categories;
    return data.categories.filter((category) =>
      category.category_name.toLowerCase().includes(term)
    );
  }, [data, search]);

  const filteredFiles = useMemo(() => {
    if (!currentFolder) return [];
    const term = search.trim().toLowerCase();
    if (!term) return currentFolder.files;
    return currentFolder.files.filter((file) =>
      file.file_name.toLowerCase().includes(term)
    );
  }, [currentFolder, search]);

  const handleDownloadFile = async (file: GeneralFile) => {
    setDownloadingFileId(file.id);
    try {
      console.log("file.file_path", file.file_path);

      const presignedUrl = await getPresignedUrlGeneralFiles(file.file_path);
      window.open(presignedUrl, "_blank");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Không thể tải xuống file. Vui lòng thử lại.");
    } finally {
      setDownloadingFileId(null);
    }
  };

  const handleFolderClick = (folder: FileCategory) => {
    setCurrentFolder(folder);
    setSearch(""); // Reset search when entering folder
  };

  const handleBackClick = () => {
    setCurrentFolder(null);
    setSearch(""); // Reset search when going back
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card
              key={i}
              className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl"
            >
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <Skeleton className="h-16 w-16 rounded-2xl mx-auto" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24 mx-auto" />
                    <Skeleton className="h-3 w-16 mx-auto" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <FileText className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Không thể tải danh sách files
            </h3>
            <p className="text-slate-600">Vui lòng thử lại sau.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
        {/* Header with breadcrumb */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3 text-slate-800">
                  {currentFolder ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBackClick}
                        className="mr-0 hover:bg-blue-100 rounded-xl transition-all duration-200"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                          <Folder className="h-5 w-5 text-white" />
                        </div>
                        {currentFolder.category_name}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      Tệp chung
                    </>
                  )}
                </h1>
                <p className="text-slate-600 mt-2 flex items-center gap-2 pl-12">
                  {currentFolder ? (
                    <>
                      Tổng số{" "}
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {currentFolder.file_count} files
                      </span>
                      trong thư mục này
                    </>
                  ) : (
                    <>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {data.total_categories} thư mục
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {currentFolder ? (
          // Show files in current folder
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFiles.length === 0 ? (
              <div className="col-span-full">
                <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-lg">
                  <CardContent className="p-8 text-center text-slate-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                    <p className="text-lg font-medium mb-2">
                      {search ? "Không tìm thấy file nào" : "Thư mục trống"}
                    </p>
                    <p className="text-sm">
                      {search
                        ? "Thử tìm kiếm với từ khóa khác."
                        : "Thư mục này chưa có file nào."}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              filteredFiles.map((file, index) => (
                <Card
                  key={file.id}
                  className="group border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden transform hover:-translate-y-1 animate-fadeInUp"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200">
                            <FileText className="h-4 w-4 text-white" />
                          </div>
                          <h3 className="font-semibold text-slate-800 truncate group-hover:text-blue-700 transition-colors">
                            {file.file_name}
                          </h3>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded-lg font-medium">
                              {file.file_type.toUpperCase()}
                            </span>
                            <span className="text-xs text-slate-500">
                              {(file.file_size / 1024).toFixed(1)} KB
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Tải lên:{" "}
                            {new Date(file.uploaded_at).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadFile(file)}
                        disabled={downloadingFileId === file.id}
                        className="ml-3 h-9 w-9 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group-hover:scale-110"
                      >
                        {downloadingFileId === file.id ? (
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        ) : (
          // Show folders
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFolders.length === 0 ? (
              <div className="col-span-full">
                <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-lg">
                  <CardContent className="p-8 text-center text-slate-500">
                    <Folder className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                    <p className="text-lg font-medium mb-2">
                      Không tìm thấy thư mục
                    </p>
                    <p className="text-sm">Thử tìm kiếm với từ khóa khác.</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              filteredFolders.map((folder, index) => (
                <Card
                  key={folder.category_id}
                  className="group border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden transform hover:-translate-y-2 animate-fadeInUp"
                  onClick={() => handleFolderClick(folder)}
                  style={{
                    animationDelay: `${index * 80}ms`,
                  }}
                >
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="relative">
                        <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg mx-auto w-16 h-16 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                          <Folder className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors text-lg">
                          {folder.category_name}
                        </h3>
                        {folder.category_description && (
                          <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                            {folder.category_description}
                          </p>
                        )}
                        <div className="mt-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700">
                            {folder.file_count} files
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
