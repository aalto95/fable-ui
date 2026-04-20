import {
  BaseAccordion,
  BaseAccordionContent,
  BaseAccordionItem,
  BaseAccordionTrigger,
} from "@fable-ui/shared";
import type React from "react";
import type { IAccordionComponent } from "@/models/interfaces/component";

export type TAccordionProps = Exclude<IAccordionComponent, "type">;

export const Accordion: React.FC<TAccordionProps> = ({ items }) => {
  return (
    <BaseAccordion type="single" collapsible>
      {items?.map((item, i) => (
        <BaseAccordionItem value={item.name} key={i}>
          <BaseAccordionTrigger>{item.title}</BaseAccordionTrigger>
          <BaseAccordionContent>{item.text}</BaseAccordionContent>
        </BaseAccordionItem>
      ))}
    </BaseAccordion>
  );
};
