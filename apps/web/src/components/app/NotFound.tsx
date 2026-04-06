import {
  BaseButton,
  BaseEmpty,
  BaseEmptyContent,
  BaseEmptyDescription,
  BaseEmptyHeader,
  BaseEmptyTitle,
} from "manifest-ui";
import { Link } from "react-router";

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
