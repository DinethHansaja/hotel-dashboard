import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={`/buffet?page=${currentPage - 1}`}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-[#c79a45] hover:text-[#9a742e]"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-slate-300">
          <ChevronLeft className="h-4 w-4" />
        </div>
      )}

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;

        return (
          <Link
            key={page}
            href={`/buffet?page=${page}`}
            className={`flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-medium transition ${
              page === currentPage
                ? "bg-[#c79a45] text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:border-[#c79a45] hover:text-[#9a742e]"
            }`}
          >
            {page}
          </Link>
        );
      })}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={`/buffet?page=${currentPage + 1}`}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-[#c79a45] hover:text-[#9a742e]"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-slate-300">
          <ChevronRight className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}