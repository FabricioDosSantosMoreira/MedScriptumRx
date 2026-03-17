import { Dispatch, SetStateAction, useCallback } from 'react';

type SetState<T> = Dispatch<SetStateAction<T>>;

export function useArrayField<T>(form: T, setForm: SetState<T>) {
  
  const updateArrayField = useCallback(
    <K extends keyof T>(
      field: K,
      index: number,
      value: T[K] extends Array<infer U> ? U : never
    ) => {
      setForm(prev => {
        const arr = [...(prev[field] as any[])];
        arr[index] = value;

        return {
          ...prev,
          [field]: arr,
        };
      });
    },
    [setForm]
  );

  const addArrayField = useCallback(
    <K extends keyof T>(
      field: K,
      emptyValue: T[K] extends Array<infer U> ? U : never
    ) => {
      setForm(prev => {
        const arr = [...(prev[field] as any[])];

        return {
          ...prev,
          [field]: [...arr, emptyValue],
        };
      });
    },
    [setForm]
  );

  const removeArrayField = useCallback(
    <K extends keyof T>(
      field: K,
      index: number,
      fallback: T[K]
    ) => {
      setForm(prev => {
        const arr = (prev[field] as any[]).filter(
          (_, i) => i !== index
        );

        return {
          ...prev,
          [field]: arr.length ? arr : fallback,
        };
      });
    },
    [setForm]
  );

  return {
    addArrayField, updateArrayField, removeArrayField,
  };
}
