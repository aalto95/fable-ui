import type { RefObject } from "react";
import { useEffect, useState } from "react";

import { mergePrefillIntoDescendants, unwrapRecordPayload } from "@/lib/form-utils";
import { http } from "@/lib/http-client";
import type { TComponentUnion } from "@/models/interfaces/component";

type UseFormPrefillArgs = {
  dataSource?: string;
  id?: string;
  descendants?: TComponentUnion[];
  formRef: RefObject<HTMLFormElement | null>;
};

export function useFormPrefill({
  dataSource,
  id,
  descendants,
  formRef,
}: UseFormPrefillArgs) {
  const [innerDescendants, setInnerDescendants] = useState(descendants);
  const [isLoading, setIsLoading] = useState(false);

  const baseUrl = dataSource;

  useEffect(() => {
    if (!baseUrl || !id || !descendants) {
      setInnerDescendants(descendants);
      formRef.current?.reset();
    }
  }, [baseUrl, id, descendants]);

  useEffect(() => {
    if (!baseUrl || !id || !descendants) {
      return;
    }

    const ac = new AbortController();
    setIsLoading(true);

    http
      .get<unknown>(`${baseUrl}/${id}`, { signal: ac.signal })
      .then((raw) => {
        const data = unwrapRecordPayload(raw);
        setInnerDescendants((prev) => {
          const base = prev ?? descendants;
          return mergePrefillIntoDescendants(base, data) ?? base;
        });
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
  }, [baseUrl, id, descendants]);

  return { innerDescendants, isLoading };
}
