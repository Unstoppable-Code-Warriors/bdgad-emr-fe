"use client";

import { useState, useCallback, useMemo } from "react";
import * as React from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Eye,
  ChevronDown,
  ArrowLeft,
  FilterX,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePatients } from "@/hooks/use-patients";
import type { PatientSearchParams, PatientSummary } from "@/types/patient";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import { MonthYearStats } from "@/components/ui/month-year-stats";

interface PatientSearchProps {
  onPatientSelect?: (patient: PatientSummary) => void;
}

export function PatientSearch({ onPatientSelect }: PatientSearchProps) {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"folders" | "patients">("folders");
  const [selectedMonth, setSelectedMonth] = useState<{
    year: number;
    month: number;
  } | null>(null);
  const [searchParams, setSearchParams] = useState<PatientSearchParams>({
    page: 1,
    limit: 10,
    sortBy: "lastTestDate",
    sortOrder: "DESC",
  });

  const [localSearch, setLocalSearch] = useState({
    keyword: "",
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
  });

  const [errors, setErrors] = useState<{ dateRange?: string }>({});
  const [hasActiveSearch, setHasActiveSearch] = useState(false);

  const shouldCallAPI = Boolean(
    viewMode === "patients" && (hasActiveSearch || selectedMonth)
  );
  const finalSearchParams = useMemo(() => {
    if (selectedMonth && !hasActiveSearch) {
      // Use the new folderMonth and folderYear parameters for folder clicks
      const params = {
        ...searchParams,
        folderMonth: selectedMonth.month,
        folderYear: selectedMonth.year,
      };
      console.log("Month folder search params:", params);
      console.log("Selected month object:", selectedMonth);
      return params;
    }
    console.log("Manual search params:", searchParams);
    return searchParams;
  }, [searchParams, selectedMonth, hasActiveSearch]);

  const {
    data: patientsData,
    isLoading,
    error,
  } = usePatients(finalSearchParams, shouldCallAPI);

  const handleSearch = useCallback(() => {
    // Simple validation: end date must be on/after start date
    if (
      localSearch.dateFrom &&
      localSearch.dateTo &&
      localSearch.dateTo < localSearch.dateFrom
    ) {
      setErrors({
        dateRange: "Ngày kết thúc không thể trước ngày bắt đầu",
      });
      return;
    }
    setErrors({});
    setHasActiveSearch(true);
    setViewMode("patients");
    setSelectedMonth(null); // Clear month selection when doing manual search
    setSearchParams((prev) => ({
      ...prev,
      keyword: localSearch.keyword,
      name: undefined, // Clear old name parameter
      barcode: undefined, // Clear old barcode parameter
      dateFrom: localSearch.dateFrom
        ? format(localSearch.dateFrom, "yyyy-MM-dd")
        : undefined,
      dateTo: localSearch.dateTo
        ? format(localSearch.dateTo, "yyyy-MM-dd")
        : undefined,
      month: undefined, // Clear month parameter for manual search
      folderMonth: undefined, // Clear folder parameters for manual search
      folderYear: undefined,
      page: 1, // Reset to first page when searching
    }));
  }, [localSearch]);

  const handleClearSearch = useCallback(() => {
    setLocalSearch({
      keyword: "",
      dateFrom: undefined,
      dateTo: undefined,
    });
    setErrors({});
    setHasActiveSearch(false);
    setSelectedMonth(null);
    setViewMode("folders");
    setSearchParams({
      page: 1,
      limit: 10,
      sortBy: "lastTestDate",
      sortOrder: "DESC",
      keyword: undefined,
      name: undefined,
      barcode: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      month: undefined, // Clear month parameter
      folderMonth: undefined, // Clear folder parameters
      folderYear: undefined,
    });
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setSearchParams((prev) => ({ ...prev, page: newPage }));
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("vi-VN");
    } catch {
      return dateString;
    }
  };

  const getGenderBadgeColor = (gender: string | null) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "bg-blue-100 text-blue-800";
      case "female":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };


  const handleMonthClick = useCallback((year: number, month: number) => {
    console.log("handleMonthClick called with:", { year, month });
    setSelectedMonth({ year, month });
    setViewMode("patients");
    setHasActiveSearch(false);
    // Reset pagination to page 1 when selecting a new month
    setSearchParams((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleBackToFolders = useCallback(() => {
    setViewMode("folders");
    setSelectedMonth(null);
    setHasActiveSearch(false);
    // Clear all search parameters when going back to folders
    setSearchParams({
      page: 1,
      limit: 10,
      sortBy: "lastTestDate",
      sortOrder: "DESC",
      folderMonth: undefined,
      folderYear: undefined,
    });
  }, []);

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-red-600">
            Lỗi khi tải danh sách bệnh nhân. Vui lòng thử lại.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Date picker component
  const DatePicker = ({
    date,
    onSelect,
    placeholder = "Chọn ngày...",
    minDate,
    maxDate,
  }: {
    date: Date | undefined;
    onSelect: (date: Date | undefined) => void;
    placeholder?: string;
    minDate?: Date;
    maxDate?: Date;
  }) => {
    const [open, setOpen] = React.useState(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "dd/MM/yyyy") : placeholder}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            startMonth={new Date(1900, 0)}
            endMonth={new Date(new Date().getFullYear(), 11)}
            disabled={[
              ...(minDate ? [{ before: minDate }] : []),
              ...(maxDate ? [{ after: maxDate }] : []),
            ]}
            onSelect={(selectedDate) => {
              onSelect(selectedDate);
              setOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 ">
            <Search className="h-5 w-5" />
            Tìm Kiếm Bệnh Nhân
          </CardTitle>
          <CardDescription>
            Tìm kiếm bệnh nhân theo tên, CCCD hoặc khoảng thời gian lần khám
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2 flex-1 min-w-[200px]">
              <label className="text-sm font-medium">Tìm kiếm</label>
              <Input
                placeholder="Nhập tên bệnh nhân, CCCD..."
                value={localSearch.keyword}
                onChange={(e) =>
                  setLocalSearch((prev) => ({
                    ...prev,
                    keyword: e.target.value,
                  }))
                }
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            <div className="space-y-2 flex-1 min-w-[150px]">
              <label className="text-sm font-medium">Từ ngày</label>
              <DatePicker
                date={localSearch.dateFrom}
                onSelect={(date) =>
                  setLocalSearch((prev) => {
                    // If selecting a start date after the current end date, clear the end date
                    const shouldClearEnd =
                      date && prev.dateTo && date > prev.dateTo;
                    // Clear any date range error after picking a date
                    setErrors({});
                    return {
                      ...prev,
                      dateFrom: date,
                      dateTo: shouldClearEnd ? undefined : prev.dateTo,
                    };
                  })
                }
                maxDate={localSearch.dateTo}
                placeholder="Chọn ngày bắt đầu..."
              />
            </div>

            <div className="space-y-2 flex-1 min-w-[150px]">
              <label className="text-sm font-medium">Đến ngày</label>
              <DatePicker
                date={localSearch.dateTo}
                onSelect={(date) => {
                  setLocalSearch((prev) => ({
                    ...prev,
                    dateTo: date,
                  }));
                  setErrors({});
                }}
                minDate={localSearch.dateFrom}
                placeholder="Chọn ngày kết thúc..."
              />
            </div>

            <div className="flex items-end gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleSearch}
                      disabled={Boolean(errors.dateRange)}
                      size="icon"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tìm kiếm bệnh nhân</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={handleClearSearch}
                      size="icon"
                    >
                      <FilterX className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Xóa bộ lọc</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {errors.dateRange && (
            <p className="text-sm text-red-600 mt-2">{errors.dateRange}</p>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {viewMode === "folders" ? (
        <MonthYearStats onMonthClick={handleMonthClick} />
      ) : (
        <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {(selectedMonth || hasActiveSearch) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToFolders}
                    className="mr-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                {selectedMonth && !hasActiveSearch
                  ? `Bệnh Nhân - ${selectedMonth.month}/${selectedMonth.year}`
                  : "Danh Sách Bệnh Nhân"}
              </CardTitle>
              <CardDescription>
                {patientsData
                  ? `Tìm thấy ${patientsData.pagination.total} bệnh nhân`
                  : "Đang tải..."}
              </CardDescription>
            </div>


          </div>
        </CardHeader>
        <CardContent>
          {shouldCallAPI && isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 p-4 border rounded-lg"
                >
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-60" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : shouldCallAPI &&
            patientsData?.data &&
            patientsData.data.length > 0 ? (
            <div className="space-y-4">
              {patientsData.data.map((patient) => (
                <div
                  key={patient.patientKey}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => {
                    if (onPatientSelect) {
                      onPatientSelect(patient);
                    } else {
                      navigate(`/patients/${patient.patientKey}`);
                    }
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback
                        className={cn(
                          "font-semibold",
                          getGenderBadgeColor(patient.gender)
                        )}
                      >
                        {getInitials(patient.fullName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                      <h4 className="font-semibold">{patient.fullName}</h4>

                      <div className="text-xs text-muted-foreground">
                        CCCD: {patient.citizenID || "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <CalendarIcon className="h-3 w-3" />
                      {formatDate(patient.lastTestDate)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Lần khám gần nhất
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onPatientSelect) {
                          onPatientSelect(patient);
                        } else {
                          navigate(`/patients/${patient.patientKey}`);
                        }
                      }}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Chi tiết
                    </Button>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
                {/* Info and Limit Selector */}
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    Hiển thị {((patientsData.pagination.page - 1) * patientsData.pagination.limit) + 1} - {Math.min(patientsData.pagination.page * patientsData.pagination.limit, patientsData.pagination.total)} trong tổng số {patientsData.pagination.total} bệnh nhân
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Hiển thị:</span>
                    <Select
                      value={searchParams.limit?.toString() || "10"}
                      onValueChange={(value) =>
                        setSearchParams((prev) => ({
                          ...prev,
                          limit: parseInt(value),
                          page: 1, // Reset to first page when changing limit
                        }))
                      }
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Page Numbers */}
                {patientsData.pagination.totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    {/* Previous Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handlePageChange(patientsData.pagination.page - 1)
                      }
                      disabled={!patientsData.pagination.hasPrev}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* Page Numbers */}
                    {(() => {
                      const currentPage = patientsData.pagination.page;
                      const totalPages = patientsData.pagination.totalPages;
                      const pages = [];

                      // Always show first page
                      if (currentPage > 3) {
                        pages.push(
                          <Button
                            key={1}
                            variant={1 === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(1)}
                          >
                            1
                          </Button>
                        );
                        if (currentPage > 4) {
                          pages.push(
                            <span key="ellipsis1" className="px-2 text-muted-foreground">
                              ...
                            </span>
                          );
                        }
                      }

                      // Show pages around current page
                      const startPage = Math.max(1, currentPage - 2);
                      const endPage = Math.min(totalPages, currentPage + 2);

                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <Button
                            key={i}
                            variant={i === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(i)}
                          >
                            {i}
                          </Button>
                        );
                      }

                      // Always show last page
                      if (currentPage < totalPages - 2) {
                        if (currentPage < totalPages - 3) {
                          pages.push(
                            <span key="ellipsis2" className="px-2 text-muted-foreground">
                              ...
                            </span>
                          );
                        }
                        pages.push(
                          <Button
                            key={totalPages}
                            variant={totalPages === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(totalPages)}
                          >
                            {totalPages}
                          </Button>
                        );
                      }

                      return pages;
                    })()}

                    {/* Next Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handlePageChange(patientsData.pagination.page + 1)
                      }
                      disabled={!patientsData.pagination.hasNext}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : shouldCallAPI ? (
            <EmptyState
              icon={<Search className="h-12 w-12" />}
              title="Không tìm thấy bệnh nhân"
              description="Thử điều chỉnh bộ lọc tìm kiếm hoặc xóa bộ lọc để xem tất cả bệnh nhân."
              action={{
                label: "Xóa bộ lọc",
                onClick: handleClearSearch,
              }}
            />
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Chọn tháng hoặc tìm kiếm để xem danh sách bệnh nhân
            </div>
          )}
        </CardContent>
      </Card>
      )}
    </div>
  );
}
