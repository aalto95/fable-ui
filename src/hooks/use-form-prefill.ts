import type { RefObject } from "react";
import { useEffect, useState } from "react";

import { hasNameField, unwrapRecordPayload } from "@/lib/form-utils";
import { http } from "@/lib/http-client";
import type { TComponentUnion } from "@/models/interfaces/component";

type UseFormPrefillArgs = {
  dataSource?: string;
  id?: string;
  fields?: TComponentUnion[];
  formRef: RefObject<HTMLFormElement | null>;
};

export function useFormPrefill({
  dataSource,
  id,
  fields,
  formRef,
}: UseFormPrefillArgs) {
  const [innerFields, setInnerFields] = useState(fields);
  const [isLoading, setIsLoading] = useState(false);

  const baseUrl = dataSource;

  useEffect(() => {
    if (!baseUrl || !id || !fields) {
      setInnerFields(fields);
      formRef.current?.reset();
    }
  }, [baseUrl, id, fields]);

  useEffect(() => {
    if (!baseUrl || !id || !fields) {
      return;
    }

    const ac = new AbortController();
    setIsLoading(true);

    http
      .get<unknown>(`${baseUrl}/${id}`, { signal: ac.signal })
      .then((raw) => {
        const data = unwrapRecordPayload(raw);
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
  }, [baseUrl, id]);

  return { innerFields, isLoading };
}
