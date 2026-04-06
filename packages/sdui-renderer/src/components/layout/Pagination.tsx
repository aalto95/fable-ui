import { useMemo } from "react";
import { useSearchParams } from "react-router";
import {
  BasePagination,
  BasePaginationContent,
  BasePaginationEllipsis,
  BasePaginationItem,
  BasePaginationLink,
  BasePaginationNext,
  BasePaginationPrevious,
} from "@/components/ui/pagination";
import type { IPaginationComponent } from "@/models/interfaces/component";

/** Shared props for pagination UI (standalone leaf or embedded in `table`). */
export type TPaginationProps = Omit<IPaginationComponent, "type">;

export const Pagination: React.FC<TPaginationProps> = ({
  pages,
  pageParam = "page",
  limitParam = "limit",
  defaultLimit,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const parsedPage = Number(searchParams.get(pageParam));
  const active = Number.isFinite(parsedPage)
    ? Math.min(Math.max(parsedPage, 1), pages)
    : 1;

  const getVisiblePages = useMemo(() => {
    const visiblePages: (number | "ellipsis")[] = [];

    if (pages <= 7) {
      // Show all pages if total pages is 7 or less
      return Array.from({ length: pages }, (_, i) => i + 1);
    }

    // Always show first page
    visiblePages.push(1);

    // Logic for showing pages around the active page
    if (active <= 3) {
      // Active page is near the start
      for (let i = 2; i <= 5; i++) {
        visiblePages.push(i);
      }
      visiblePages.push("ellipsis");
      visiblePages.push(pages);
    } else if (active >= pages - 2) {
      // Active page is near the end
      visiblePages.push("ellipsis");
      for (let i = pages - 4; i <= pages - 1; i++) {
        visiblePages.push(i);
      }
      visiblePages.push(pages);
    } else {
      // Active page is in the middle
      visiblePages.push("ellipsis");
      for (let i = active - 1; i <= active + 1; i++) {
        visiblePages.push(i);
      }
      visiblePages.push("ellipsis");
      visiblePages.push(pages);
    }

    return visiblePages;
  }, [pages, active]);

  const handlePageChange = (page: number) => {
    const next = new URLSearchParams(searchParams);
    next.set(pageParam, String(page));
    if (defaultLimit != null && !next.get(limitParam)) {
      next.set(limitParam, String(defaultLimit));
    }
    setSearchParams(next);
  };

  const handlePrevious = () => {
    if (active > 1) {
      handlePageChange(active - 1);
    }
  };

  const handleNext = () => {
    if (active < pages) {
      handlePageChange(active + 1);
    }
  };

  return (
    <BasePagination>
      <BasePaginationContent>
        <BasePaginationItem>
          <BasePaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePrevious();
            }}
            aria-disabled={active === 1}
            className={active === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </BasePaginationItem>

        {getVisiblePages.map((page, i) => (
          <BasePaginationItem key={i}>
            {page === "ellipsis" ? (
              <BasePaginationEllipsis />
            ) : (
              <BasePaginationLink
                href="#"
                isActive={active === page}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page);
                }}
              >
                {page}
              </BasePaginationLink>
            )}
          </BasePaginationItem>
        ))}

        <BasePaginationItem>
          <BasePaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNext();
            }}
            aria-disabled={active === pages}
            className={active === pages ? "pointer-events-none opacity-50" : ""}
          />
        </BasePaginationItem>
      </BasePaginationContent>
    </BasePagination>
  );
};
