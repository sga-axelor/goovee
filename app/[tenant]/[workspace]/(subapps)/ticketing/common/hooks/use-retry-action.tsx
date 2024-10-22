import {i18n} from '@/lib/i18n';
import {ToastAction} from '@/ui/components';
import {useToast} from '@/ui/hooks';
import {useRouter} from 'next/navigation';
import {useCallback, useState} from 'react';

import type {ActionConfig, ActionResponse} from '../actions';
import {VERSION_MISMATCH_ERROR} from '../constants';

export function useRetryAction<
  T extends Record<string, unknown>,
  R extends ActionResponse,
>(
  action: (actionProps: T, config?: ActionConfig) => R,
  successMessage?: string,
): {
  action: (
    actionProps: T,
    onSuccess?: (
      res: Extract<Awaited<R>, {success: true}>['data'],
    ) => Promise<void>,
  ) => Promise<void>;
  loading: boolean;
} {
  const [loading, setLoading] = useState(false);
  const {toast} = useToast();
  const router = useRouter();
  const handleSuccess = useCallback(
    async (
      onSuccess?: (res: Extract<Awaited<R>, {success: true}>) => Promise<void>,
      data?: Extract<Awaited<R>, {success: true}>['data'],
    ) => {
      toast({
        variant: 'success',
        title: successMessage ?? i18n.get('Saved successfully'),
      });
      if (onSuccess && data) {
        await onSuccess(data);
      }
      router.refresh();
    },
    [toast, router, successMessage],
  );

  const handleError = useCallback(
    (
      message: string,
      retryProps: T,
      onSuccess?: (res: Extract<Awaited<R>, {success: true}>) => Promise<void>,
    ) => {
      if (message === VERSION_MISMATCH_ERROR) {
        const handleOverwrite = async () => {
          setLoading(true);
          try {
            const {error, message, data} = await action(retryProps, {
              force: true,
            });
            if (error) {
              handleError(message, retryProps, onSuccess);
              return;
            }
            await handleSuccess(onSuccess, data);
          } catch (e) {
            toast({
              variant: 'destructive',
              title: e instanceof Error ? e.message : i18n.get('Unknown Error'),
            });
            return;
          } finally {
            setLoading(false);
          }
        };
        const handleDiscard = () => {
          router.refresh();
        };
        return toast({
          variant: 'destructive',
          title: i18n.get('Record has been modified by someone else'),
          className: 'flex gap-4 flex-col',
          duration: 10000,
          action: (
            <div className="flex gap-4">
              <ToastAction altText="Overwrite" onClick={handleOverwrite}>
                {i18n.get('Overwrite')}
              </ToastAction>
              <ToastAction altText="Discard" onClick={handleDiscard}>
                {i18n.get('Discard')}
              </ToastAction>
            </div>
          ),
        });
      }
      return toast({
        variant: 'destructive',
        title: message,
      });
    },
    [toast, handleSuccess, router, action],
  );

  const actionHandler = useCallback(
    async (
      actionProps: T,
      onSuccess?: (res: Extract<Awaited<R>, {success: true}>) => Promise<void>,
    ): Promise<void> => {
      try {
        setLoading(true);
        const {error, message, data} = await action(actionProps);
        if (error) {
          handleError(message, actionProps, onSuccess);
          return;
        }
        await handleSuccess(onSuccess, data);
      } catch (e) {
        toast({
          variant: 'destructive',
          title: e instanceof Error ? e.message : i18n.get('Unknown Error'),
        });
        return;
      } finally {
        setLoading(false);
      }
    },
    [action, handleError, handleSuccess, toast],
  );

  return {
    action: actionHandler,
    loading,
  };
}
