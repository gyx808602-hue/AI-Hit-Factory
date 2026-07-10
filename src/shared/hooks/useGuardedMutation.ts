import { useCallback, useRef } from "react";
import type {
  MutationFunctionContext,
  MutateOptions,
  UseMutateAsyncFunction,
  UseMutateFunction,
  UseMutationResult,
} from "@tanstack/react-query";

export function useGuardedMutation<TData, TError, TVariables, TContext>(
  mutation: UseMutationResult<TData, TError, TVariables, TContext>,
): UseMutationResult<TData, TError, TVariables, TContext> {
  const activePromiseRef = useRef<Promise<TData> | null>(null);

  const runOnce = useCallback(
    (
      variables: TVariables,
      options?: MutateOptions<TData, TError, TVariables, TContext>,
    ) => {
      if (!activePromiseRef.current) {
        const fallbackContext = {
          client: undefined,
          meta: undefined,
          mutationKey: undefined,
        } as unknown as MutationFunctionContext;

        // 用同步 ref 锁住用户触发入口，避免 React pending 状态刷新前的连续点击打出多次 mutation。
        const mutationPromise =
          typeof mutation.mutateAsync === "function"
            ? mutation.mutateAsync(variables, options)
            : new Promise<TData>((resolve, reject) => {
                mutation.mutate(variables, {
                  ...options,
                  onError: (error, nextVariables, context) => {
                    options?.onError?.(error, nextVariables, context, fallbackContext);
                    reject(error);
                  },
                  onSuccess: (data, nextVariables, context) => {
                    options?.onSuccess?.(data, nextVariables, context, fallbackContext);
                    resolve(data);
                  },
                  onSettled: (data, error, nextVariables, context) => {
                    options?.onSettled?.(data, error, nextVariables, context, fallbackContext);
                  },
                });
              });

        activePromiseRef.current = mutationPromise.finally(() => {
          activePromiseRef.current = null;
        });
      }

      return activePromiseRef.current;
    },
    [mutation],
  );

  const mutate = useCallback<UseMutateFunction<TData, TError, TVariables, TContext>>(
    (variables, options) => {
      void runOnce(variables, options).catch(() => undefined);
    },
    [runOnce],
  );

  const mutateAsync = useCallback<
    UseMutateAsyncFunction<TData, TError, TVariables, TContext>
  >(
    (variables, options) => runOnce(variables, options),
    [runOnce],
  );

  return {
    ...mutation,
    mutate,
    mutateAsync,
  };
}
