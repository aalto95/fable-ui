import {
  BaseTable,
  BaseTableBody,
  BaseTableCell,
  BaseTableHead,
  BaseTableHeader,
  BaseTableRow,
} from "@/components/ui/table";
import type { ITableComponent } from "@/models/interfaces/component";

type TableProps = Pick<ITableComponent, "fields" | "data">;

export const Table: React.FC<TableProps> = ({ fields, data }) => {
  return (
    <BaseTable>
      <BaseTableHeader>
        <BaseTableRow>
          {fields.map((field, i) => (
            <BaseTableHead key={i}>{field.label}</BaseTableHead>
          ))}
        </BaseTableRow>
      </BaseTableHeader>
      <BaseTableBody>
        {data.map((item, i) => (
          <BaseTableRow key={i}>
            {fields.map((field, i) => (
              <BaseTableCell key={i}>{item[field.name]}</BaseTableCell>
            ))}
          </BaseTableRow>
        ))}
      </BaseTableBody>
    </BaseTable>
  );
};
