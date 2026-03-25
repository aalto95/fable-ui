import { ArrowUpRightIcon } from "lucide-react";
import { Link } from "react-router";
import { BaseButton } from "@/components/ui/button";
import {
  BaseEmpty,
  BaseEmptyContent,
  BaseEmptyDescription,
  BaseEmptyHeader,
  BaseEmptyTitle,
} from "@/components/ui/empty";

export const NotFound = () => {
  return (
    <BaseEmpty>
      <BaseEmptyHeader>
        <BaseEmptyTitle>Page not found</BaseEmptyTitle>
        <BaseEmptyDescription>Try going to root page</BaseEmptyDescription>
      </BaseEmptyHeader>
      <BaseEmptyContent className="flex-row justify-center gap-2">
        <Link to={"/"}>
          <BaseButton>Go to root page</BaseButton>
        </Link>
      </BaseEmptyContent>
    </BaseEmpty>
  );
};
