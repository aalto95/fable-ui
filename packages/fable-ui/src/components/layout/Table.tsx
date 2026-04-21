import {
  BaseButton,
  BaseDropdownMenu,
  BaseDropdownMenuContent,
  BaseDropdownMenuItem,
  BaseDropdownMenuTrigger,
  BaseTable,
  BaseTableBody,
  BaseTableCell,
  BaseTableHead,
  BaseTableHeader,
  BaseTableRow,
  Spinner,
} from "@fable-ui/shared";
import { MoreHorizontalIcon } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { Pagination } from "@/components/layout/Pagination";
import { type DialogConfig, useDialog } from "@/contexts/dialog";
import { executeAction } from "@/lib/http-actions";
import { http } from "@/lib/http-client";
import type { ITableComponent } from "@/models/interfaces/component";

export type TTableProps = Omit<ITableComponent, "type">;

type PaginatedListResponse = {
  data: unknown[];
  total?: number;
  totalPages?: number;
};

/** Row objects from schema or API; keys are column names (see `heads`). */
type TableRow = Record<string, unknown>;

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
  const { setConfig } = useDialog();
  const [searchParams] = useSearchParams();
  const search = searchParams.toString();
  const [fieldData, setFieldData] = useState<TableRow[]>(() =>
    Array.isArray(data) ? (data as TableRow[]) : [],
  );
  const [totalPages, setTotalPages] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  function formatValue(value: unknown, type?: string): ReactNode {
    if (value == null) return "";

    if (type === "date" && typeof value === "string") {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return value;

      return date.toLocaleDateString();
    }

    if (typeof value === "string" || typeof value === "number") {
      return value;
    }

    return String(value);
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
        setFieldData((res.data ?? []) as TableRow[]);
        const limitNum = Number(searchParams.get(limitParam)) || defaultLimit || 10;
        const derived =
          res.totalPages ??
          (typeof res.total === "number" && limitNum > 0
            ? Math.ceil(res.total / limitNum)
            : undefined);
        setTotalPages(
          typeof derived === "number" && Number.isFinite(derived) ? derived : undefined,
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
    dataSource != null && totalPages != null && totalPages > 1 && Number.isFinite(totalPages);

  return (
    <div className="flex w-full flex-col gap-4">
      <BaseTable>
        <BaseTableHeader>
          <BaseTableRow>
            {heads?.map((head, i) => (
              <BaseTableHead key={i}>{head.label}</BaseTableHead>
            ))}
            {actions?.length && <BaseTableHead className="text-right">Actions</BaseTableHead>}
          </BaseTableRow>
        </BaseTableHeader>
        <BaseTableBody>
          {fieldData?.map((item, i) => (
            <BaseTableRow key={i}>
              {heads?.map((head, i) => (
                <BaseTableCell key={i}>{formatValue(item[head.name], head.type)}</BaseTableCell>
              ))}
              <BaseTableCell className="text-right">
                {actions?.length && (
                  <BaseDropdownMenu>
                    <BaseDropdownMenuTrigger asChild>
                      <BaseButton variant="ghost" size="icon" className="size-8">
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
                            const rowId = item.id == null ? undefined : String(item.id);
                            const runAction = async () => {
                              await executeAction(action, {
                                form: null,
                                id: rowId,
                                navigate: (to) => {
                                  if (typeof to === "number") {
                                    navigate(to);
                                    return;
                                  }
                                  navigate(`${to}/${rowId ?? ""}`);
                                },
                              });
                              if (action.type === "HTTP_DELETE") {
                                toast.success("Item deleted");
                                if (dataSource) {
                                  getData(dataSource);
                                }
                              }
                            };

                            if (!action.dialogConfig) {
                              void runAction().catch((err) => {
                                toast.error(err.message);
                              });
                              return;
                            }

                            const dialogConfig: Partial<Exclude<DialogConfig, null>> = {
                              title: "Confirm action",
                              description: "This action will be executed.",
                              cancelText: "Cancel",
                              confirmText: "Confirm",
                              ...action.dialogConfig,
                            };

                            setConfig({
                              ...dialogConfig,
                              onConfirm: async () => {
                                setConfig({
                                  ...dialogConfig,
                                  isPending: true,
                                });
                                try {
                                  await runAction();
                                } catch (err) {
                                  toast.error(String(err));
                                } finally {
                                  setConfig(null);
                                }
                              },
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
