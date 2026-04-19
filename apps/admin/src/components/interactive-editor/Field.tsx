import type { ReactNode } from "react";
import { fieldBlockClass, fieldLabelClass } from "@/lib/fieldClasses";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={fieldBlockClass}>
      <span className={fieldLabelClass}>{label}</span>
      {children}
    </div>
  );
}
