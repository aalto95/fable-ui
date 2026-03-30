import { MoreHorizontalIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { BaseButton } from "@/components/ui/button";
import {
  BaseDropdownMenu,
  BaseDropdownMenuContent,
  BaseDropdownMenuItem,
  BaseDropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BaseTable,
  BaseTableBody,
  BaseTableCell,
  BaseTableHead,
  BaseTableHeader,
  BaseTableRow,
} from "@/components/ui/table";
import type { ITableComponent } from "@/models/interfaces/component";
import { Spinner } from "@/components/ui/spinner";

export type TTableProps = Exclude<ITableComponent, "type">;

export const Table: React.FC<TTableProps> = ({
  heads,
  data,
  dataSource,
  actions,
}) => {
  const navigate = useNavigate();
  const [fieldData, setFieldData] = useState(data ?? []);
  const [isLoading, setIsLoading] = useState(false);

  function formatValue(value: any, type?: string) {
    if (value == null) return "";

    if (type === "date" && typeof value === "string") {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return value;

      return date.toLocaleDateString(); // локаль пользователя
    }

    return value;
  }

  const getData = (url: string) => {
    setIsLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        setFieldData(res.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const goTo = (path: string, id: string) => {
    navigate(`${path}/${id}`);
  };

  useEffect(() => {
    if (dataSource) {
      getData(dataSource);
    }
  }, []);

  if (isLoading) return <Spinner></Spinner>;

  return (
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
                    <BaseButton variant="ghost" size="icon" className="size-8">
                      <MoreHorizontalIcon />
                      <span className="sr-only">Open menu</span>
                    </BaseButton>
                  </BaseDropdownMenuTrigger>
                  <BaseDropdownMenuContent align="end">
                    {actions.map((action, i) => (
                      <BaseDropdownMenuItem
                        key={i}
                        onClick={() => goTo(action.path, item.id)}
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
  );
};
