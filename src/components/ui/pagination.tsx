"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export interface PaginationProps {
  total: number;
  currentPage: number;
  pageSize: number;

  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;

  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  showTotal?: (total: number, range: [number, number]) => string;
}

export const Pagination = ({
  total,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  showSizeChanger = true,
  pageSizeOptions = [10, 20, 50, 100],
  showTotal,
}: PaginationProps) => {
  if (total === 0) return null;

  const totalPages = Math.ceil(total / pageSize);
  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, total);

  return (
    <div className="flex z-50 justify-between items-center p-6 border-t">
      {/* LEFT */}
      <div className="flex gap-4 items-center">
        {showSizeChanger && (
          <div className="flex gap-3 items-center">
            <span className="text-base text-muted-foreground">
              Show
            </span>

            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                const size = Number(value);
                onPageSizeChange?.(size);
                onPageChange(1); // size o‘zgarsa 1-sahifa
              }}
            >
              <SelectTrigger className="w-28 h-10">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem
                    key={size}
                    value={size.toString()}
                    className="text-base"
                  >
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="text-base text-muted-foreground">
              per page
            </span>
          </div>
        )}

        {showTotal && (
          <span className="text-base text-muted-foreground">
            {showTotal(total, [from, to])}
          </span>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex gap-3 items-center">
        <Button
          variant="outline"
          size="default"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="w-5 h-5" />
        </Button>

        <Button
          variant="outline"
          size="default"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <span className="px-3 text-base font-medium">
          {currentPage} / {totalPages}
        </span>

        <Button
          variant="outline"
          size="default"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>

        <Button
          variant="outline"
          size="default"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
        >
          <ChevronsRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
