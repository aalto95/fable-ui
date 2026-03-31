import { MoreHorizontalIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { Pagination } from "@/components/layout/Pagination";
import { BaseButton } from "@/components/ui/button";
import {
  BaseDropdownMenu,
  BaseDropdownMenuContent,
  BaseDropdownMenuItem,
  BaseDropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import {
  BaseTable,
  BaseTableBody,
  BaseTableCell,
  BaseTableHead,
  BaseTableHeader,
  BaseTableRow,
} from "@/components/ui/table";
import { executeAction } from "@/lib/http-actions";
import { http } from "@/lib/http-client";
import type { ITableComponent } from "@/models/interfaces/component";

export type TTableProps = Omit<ITableComponent, "type">;

type PaginatedListResponse = {
  data: unknown[];
  total?: number;
  totalPages?: number;
};

export const Table: React.FC<TTableProps> = ({
  heads,
  data,
  dataSource,
  pageParam = "page",
  limitParam = "limit",
  defaultLimit,
  actions,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const search = searchParams.toString();
  const [fieldData, setFieldData] = useState(data ?? []);
  const [totalPages, setTotalPages] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  function formatValue(value: any, type?: string) {
    if (value == null) return "";

    if (type === "date" && typeof value === "string") {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return value;

      return date.toLocaleDateString();
    }

    return value;
  }

  const getData = (url: string) => {
    setIsLoading(true);
    const endpoint = new URL(url, window.location.origin);
    const page = searchParams.get(pageParam);
    const limit = searchParams.get(limitParam);

    if (page) {
      endpoint.searchParams.set(pageParam, page);
    }
    if (limit) {
      endpoint.searchParams.set(limitParam, limit);
    } else if (defaultLimit != null) {
      endpoint.searchParams.set(limitParam, String(defaultLimit));
    }

    http
      .get<PaginatedListResponse>(endpoint.toString())
      .then((res) => {
        setFieldData(res.data ?? []);
        const limitNum =
          Number(searchParams.get(limitParam)) || defaultLimit || 10;
        const derived =
          res.totalPages ??
          (typeof res.total === "number" && limitNum > 0
            ? Math.ceil(res.total / limitNum)
            : undefined);
        setTotalPages(
          typeof derived === "number" && Number.isFinite(derived)
            ? derived
            : undefined,
        );
      })
      .catch((err: unknown) => {
        setTotalPages(undefined);
        toast.error(String(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (dataSource) {
      getData(dataSource);
    }
  }, [dataSource, search, pageParam, limitParam, defaultLimit]);

  if (isLoading) return <Spinner />;

  const showPagination =
    dataSource != null &&
    totalPages != null &&
    totalPages > 1 &&
    Number.isFinite(totalPages);

  return (
    <div className="flex w-full flex-col gap-4">
      <BaseTable>
        <BaseTableHeader>
          <BaseTableRow>
            {heads?.map((head, i) => (
              <BaseTableHead key={i}>{head.label}</BaseTableHead>
            ))}
            {actions?.length && (
              <BaseTableHead className="text-right">Actions</BaseTableHead>
            )}
          </BaseTableRow>
        </BaseTableHeader>
        <BaseTableBody>
          {fieldData?.map((item, i) => (
            <BaseTableRow key={i}>
              {heads?.map((head, i) => (
                <BaseTableCell key={i}>
                  {formatValue(item[head.name], head.type)}
                </BaseTableCell>
              ))}
              <BaseTableCell className="text-right">
                {actions?.length && (
                  <BaseDropdownMenu>
                    <BaseDropdownMenuTrigger asChild>
                      <BaseButton
                        variant="ghost"
                        size="icon"
                        className="size-8"
                      >
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open menu</span>
                      </BaseButton>
                    </BaseDropdownMenuTrigger>
                    <BaseDropdownMenuContent align="end">
                      {actions.map((action, i) => (
                        <BaseDropdownMenuItem
                          key={i}
                          variant={action?.variant as "default" | "destructive"}
                          onClick={() => {
                            executeAction(action, {
                              form: null,
                              id: item.id,
                              navigate: (to) => {
                                if (typeof to === "number") {
                                  navigate(to);
                                  return;
                                }
                                navigate(`${to}/${item.id}`);
                              },
                            })
                              .then(() => {
                                if (action.type === "HTTP_DELETE") {
                                  toast.success("Item deleted");
                                  if (dataSource) {
                                    getData(dataSource);
                                  }
                                }
                              })
                              .catch((err) => {
                                toast.error(err.message);
                              });
                          }}
                        >
                          {action.label}
                        </BaseDropdownMenuItem>
                      ))}
                    </BaseDropdownMenuContent>
                  </BaseDropdownMenu>
                )}
              </BaseTableCell>
            </BaseTableRow>
          ))}
        </BaseTableBody>
      </BaseTable>
      {showPagination && (
        <Pagination
          pages={totalPages}
          pageParam={pageParam}
          limitParam={limitParam}
          defaultLimit={defaultLimit}
        />
      )}
    </div>
  );
};
