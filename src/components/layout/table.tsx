import { MoreHorizontalIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
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
import { BaseButton } from "../ui/button";

type TableProps = Pick<
  ITableComponent,
  "id" | "heads" | "data" | "dataSource" | "actions"
>;

export const Table: React.FC<TableProps> = ({
  id,
  heads,
  data,
  dataSource,
  actions,
}) => {
  const navigate = useNavigate();
  const [fieldData, setFieldData] = useState(data ?? []);

  const getData = () => {
    if (dataSource) {
      fetch(dataSource)
        .then((res) => res.json())
        .then((res) => {
          setFieldData(res.data);
        });
    }
  };

  const goTo = (path: string, id: string) => {
    navigate(`${path}/${id}`);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <BaseTable id={id}>
      <BaseTableHeader>
        <BaseTableRow>
          {heads?.map((field, i) => (
            <BaseTableHead key={i}>{field.label}</BaseTableHead>
          ))}
        </BaseTableRow>
      </BaseTableHeader>
      <BaseTableBody>
        {fieldData?.map((item, i) => (
          <BaseTableRow key={i}>
            {heads?.map((field, i) => (
              <BaseTableCell key={i}>{item[field.name]}</BaseTableCell>
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
