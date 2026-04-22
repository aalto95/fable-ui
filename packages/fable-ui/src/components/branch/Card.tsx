import {
  BaseCard,
  BaseCardContent,
  BaseCardDescription,
  BaseCardFooter,
  BaseCardHeader,
  BaseCardTitle,
} from "fable-shared";
import type { PropsWithChildren } from "react";
import type { ICardComponent } from "@/models/interfaces/component";

export type TCardProps = Exclude<ICardComponent, "type">;

export const Card: React.FC<PropsWithChildren<TCardProps>> = ({
  title,
  description,
  footerText,
  children,
}) => {
  return (
    <BaseCard className="flex-1">
      {(title || description) && (
        <BaseCardHeader>
          {title && <BaseCardTitle>{title}</BaseCardTitle>}
          {description && <BaseCardDescription>{description}</BaseCardDescription>}
        </BaseCardHeader>
      )}

      {children && <BaseCardContent className="flex flex-col gap-2">{children}</BaseCardContent>}

      {footerText && (
        <BaseCardFooter>
          <span>{footerText}</span>
        </BaseCardFooter>
      )}
    </BaseCard>
  );
};
