"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  User,
  FileText,
  Download,
  ExternalLink,
  TestTube,
  FileCheck,
  MessageSquare,
  FolderOpen,
  Microscope,
  Mail,
} from "lucide-react";
import { useBdgadTestById } from "@/hooks/use-patients";
import { getPresignedUrl } from "@/utils/api";
import { toast } from "sonner";
import { useState } from "react";

interface BdgadTestDetailProps {
  testRunKey: number;
  testNumber: number;
  onBack: () => void;
}

export function BdgadTestDetail({
  testRunKey,
  testNumber,
  onBack,
}: BdgadTestDetailProps) {
  const { data: testDetail, isLoading } = useBdgadTestById(testRunKey);
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(
    new Set()
  );

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };
  const extractFilenameFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filename = pathname.split("/").pop() || "download";
      return filename;
    } catch {
      return "download";
    }
  };

  const handleDownloadFile = async (fileUrl: string) => {
    if (downloadingFiles.has(fileUrl)) return;

    setDownloadingFiles((prev) => new Set(prev).add(fileUrl));

    try {
      // Get presigned URL
      const presignedUrl = await getPresignedUrl(fileUrl);

      // Open presigned URL in new tab for auto download
      window.open(presignedUrl, "_blank");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Lỗi tải file", {
        description:
          error instanceof Error
            ? error.message
            : "Không thể tải file. Vui lòng thử lại sau.",
      });
    } finally {
      setDownloadingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fileUrl);
        return newSet;
      });
    }
  };

  const handleViewReport = (htmlUrl: string) => {
    window.open(htmlUrl, "_blank", "noopener,noreferrer");
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!testDetail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <FileText className="h-16 w-16 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900">
          Không tìm thấy dữ liệu
        </h3>
        <p className="text-gray-500 text-center">
          Không thể tải thông tin chi tiết của lần khám này.
        </p>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              Chi tiết lần khám {testNumber}
            </h1>
            <div className="text-right">
              <p className="text-md text-muted-foreground">
                Ngày thực hiện: {formatDate(testDetail.date)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Information - Horizontal Layout */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Thông tin bệnh nhân
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">Họ và tên</p>
              <p className="text-sm font-semibold text-gray-900">
                {testDetail.patient.name}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">CCCD</p>
              <p className="text-sm font-mono text-gray-900">
                {testDetail.patient.citizenId}
              </p>
            </div>
            {testDetail.patient.dateOfBirth && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">Ngày sinh</p>
                <p className="text-sm text-gray-900">
                  {formatDate(testDetail.patient.dateOfBirth)}
                </p>
              </div>
            )}
            {testDetail.patient.gender && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">Giới tính</p>
                <Badge variant="secondary">{testDetail.patient.gender}</Badge>
              </div>
            )}
            {testDetail.patient.address && (
              <div className="space-y-1 md:col-span-2 lg:col-span-4">
                <p className="text-sm font-medium text-gray-700">Địa chỉ</p>
                <p className="text-sm text-gray-900">
                  {testDetail.patient.address}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lab Codes Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Microscope className="h-5 w-5 text-emerald-600" />
            <span className="text-gray-800 font-bold">
              Thông tin xét nghiệm
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {testDetail.labCodes && testDetail.labCodes.length > 0 ? (
            <div className="space-y-4">
              {testDetail.labCodes.map((code, index) => (
                <div
                  key={index}
                  className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Lab Code with specific labcode */}
                  {code.labcode ? (
                    <div className="space-y-4">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <TestTube className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 mb-1">
                              Lab Code
                            </h4>
                            <p className="text-sm font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-full inline-block">
                              {code.labcode}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <FileCheck className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 mb-1">
                              Loại xét nghiệm
                            </h4>
                            <p className="text-sm font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-full inline-block">
                              {code.type === "hereditary_cancer"
                                ? "Ung thư di truyền"
                                : code.type === "prenatal_screening"
                                ? "Tiền sinh không xâm lấn"
                                : code.type === "gene_mutation"
                                ? "Đột biến gen"
                                : code.type}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-200">
                        {code.file_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadFile(code.file_url)}
                            disabled={downloadingFiles.has(code.file_url)}
                            className="flex items-center gap-2 bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700 font-medium"
                          >
                            <Download className="h-4 w-4" />
                            {downloadingFiles.has(code.file_url)
                              ? "Đang tải..."
                              : "Tải File"}
                          </Button>
                        )}
                        {code.excelResult && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              window.open(code.excelResult, "_blank")
                            }
                            className="flex items-center gap-2 bg-green-50 border-green-200 hover:bg-green-100 text-green-700 font-medium"
                          >
                            <Download className="h-4 w-4" />
                            Tải Excel
                          </Button>
                        )}
                        {code.htmlResult && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewReport(code.htmlResult)}
                            className="flex items-center gap-2 bg-orange-50 border-orange-200 hover:bg-orange-100 text-orange-700 font-medium"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Xem kết quả ETL
                          </Button>
                        )}
                      </div>

                      {/* Comment section - full width below buttons */}
                      {code.validationInfo && (
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <MessageSquare className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-800 mb-2">
                                Nhận xét kỹ thuật viên Thẩm định
                              </h4>
                              <div className="flex flex-col gap-1 text-xs text-gray-600 px-3 rounded mb-2">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-blue-600" />
                                  <span className="font-medium text-gray-800">
                                    {code.validationInfo.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-green-600" />
                                  <span className="text-gray-600">
                                    {code.validationInfo.email}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm font-medium text-gray-800 bg-gray-50 px-3 py-2 rounded-lg border border-gray-300">
                                {code.validationInfo.commentResult}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* General type with multiple file_urls */
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <FolderOpen className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 mb-1">
                            Loại tài liệu
                          </h4>
                          <p className="text-sm font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-full inline-block">
                            {code.type === "general"
                              ? "Tài liệu chung"
                              : code.type}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons for file_urls */}
                      {code.file_urls && code.file_urls.length > 0 && (
                        <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-200">
                          {code.file_urls.map(
                            (fileUrl: string, fileIndex: number) => {
                              const fileName = extractFilenameFromUrl(fileUrl);
                              return (
                                <Button
                                  key={fileIndex}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDownloadFile(fileUrl)}
                                  disabled={downloadingFiles.has(fileUrl)}
                                  className="flex items-center gap-2 bg-indigo-50 border-indigo-200 hover:bg-indigo-100 text-indigo-700 font-medium"
                                >
                                  <Download className="h-4 w-4" />
                                  {downloadingFiles.has(fileUrl)
                                    ? "Đang tải..."
                                    : `Tải ${fileName}`}
                                </Button>
                              );
                            }
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-4">
                <Microscope className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-500">
                Chưa có thông tin xét nghiệm
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
