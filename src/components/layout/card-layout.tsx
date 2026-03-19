import type React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";

type CardLayoutProps = React.ComponentProps<typeof Card> & {
  title?: string;
  description?: string;
  footerText?: string;
};

export const CardLayout: React.FC<CardLayoutProps> = ({
  title,
  description,
  footerText,
  children,
  ...rest
}) => {
  return (
    <Card {...rest} className="flex-1 h-fit">
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}

      {children && <CardContent className="flex flex-col gap-2">{children}</CardContent>}

      {footerText && (
        <CardFooter>
          <span>{footerText}</span>
        </CardFooter>
      )}
    </Card>
  );
};
