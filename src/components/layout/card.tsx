import type { PropsWithChildren } from "react";
import {
  BaseCard,
  BaseCardContent,
  BaseCardDescription,
  BaseCardFooter,
  BaseCardHeader,
  BaseCardTitle,
} from "@/components/ui/card";
import type { ICardComponent } from "@/models/interfaces/component";

type CardProps = Pick<ICardComponent, "title" | "description" | "footerText">;

export const Card: React.FC<PropsWithChildren<CardProps>> = ({
  title,
  description,
  footerText,
  children,
}) => {
  return (
    <BaseCard className="flex-1 h-fit">
      {(title || description) && (
        <BaseCardHeader>
          {title && <BaseCardTitle>{title}</BaseCardTitle>}
          {description && (
            <BaseCardDescription>{description}</BaseCardDescription>
          )}
        </BaseCardHeader>
      )}

      {children && (
        <BaseCardContent className="flex flex-col gap-2">
          {children}
        </BaseCardContent>
      )}

      {footerText && (
        <BaseCardFooter>
          <span>{footerText}</span>
        </BaseCardFooter>
      )}
    </BaseCard>
  );
};
