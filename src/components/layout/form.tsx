import type { SubmitEventHandler } from "react";
import type React from "react";

type FormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  action?: string;
  method?: string;
};

export const Form: React.FC<FormProps> = ({
  action,
  method = "GET",
  onSubmit,
  children,
  ...rest
}) => {
  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    const targetAction = action ?? formElement.action;
    const targetMethod = (method ?? formElement.method ?? "GET").toUpperCase();

    const searchParams = new URLSearchParams();
    formData.forEach((value, key) => {
      searchParams.append(key, String(value));
    });

    const init: RequestInit = {
      method: targetMethod,
    };

    let requestUrl = targetAction;

    if (targetMethod === "GET") {
      const query = searchParams.toString();
      if (query) {
        requestUrl = targetAction.includes("?")
          ? `${targetAction}&${query}`
          : `${targetAction}?${query}`;
      }
    } else {
      init.body = formData;
    }

    if (requestUrl) {
      // Fire-and-forget; callers can extend this to handle responses.
      void fetch(requestUrl, init).catch((error) => {
        console.error("Form submission failed:", error);
      });
    }

    onSubmit?.(event);
  };

  return (
    <form action={action} method={method} onSubmit={handleSubmit} {...rest} className="flex flex-col gap-2">
      {children}
    </form>
  );
};
