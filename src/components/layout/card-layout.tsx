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
    <Card {...rest}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}

      {children && <CardContent>{children}</CardContent>}

      {footerText && (
        <CardFooter>
          <span>{footerText}</span>
        </CardFooter>
      )}
    </Card>
  );
};

