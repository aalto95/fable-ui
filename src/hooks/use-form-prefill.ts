import type { RefObject } from "react";
import { useEffect, useState } from "react";

import { hasNameField } from "@/lib/form-utils";
import type { TComponentUnion } from "@/models/interfaces/component";

type UseFormPrefillArgs = {
  path?: string;
  id?: string;
  fields?: TComponentUnion[];
  formRef: RefObject<HTMLFormElement | null>;
};

export function useFormPrefill({
  path,
  id,
  fields,
  formRef,
}: UseFormPrefillArgs) {
  const [innerFields, setInnerFields] = useState(fields);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!path || !id || !fields) {
      setInnerFields(fields);
      formRef.current?.reset();
    }
  }, [path, id, fields]);

  useEffect(() => {
    if (!path || !id || !fields) {
      return;
    }

    const ac = new AbortController();
    setIsLoading(true);

    fetch(`${path}/${id}`, { signal: ac.signal })
      .then((r) => r.json())
      .then((data: Record<string, unknown>) => {
        setInnerFields((prev) =>
          prev?.map((f) =>
            hasNameField(f) && data[f.name] !== undefined
              ? { ...f, defaultValue: data[f.name] as string }
              : f,
          ),
        );
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;
        throw err;
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      ac.abort();
    };
  }, [path, id]);

  return { innerFields, isLoading };
}
