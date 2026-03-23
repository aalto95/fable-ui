import type React from "react";
import {
  BaseCard,
  BaseCardHeader,
  BaseCardTitle,
  BaseCardDescription,
  BaseCardContent,
  BaseCardFooter,
} from "@/components/ui/card";

type Card = React.ComponentProps<typeof BaseCard> & {
  title?: string;
  description?: string;
  footerText?: string;
};

export const Card: React.FC<Card> = ({
  title,
  description,
  footerText,
  children,
  ...rest
}) => {
  return (
    <BaseCard {...rest} className="flex-1 h-fit">
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
