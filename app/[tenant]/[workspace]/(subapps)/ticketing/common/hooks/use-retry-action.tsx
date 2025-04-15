import {useCallback, useState} from 'react';

import {i18n} from '@/locale';
import type {ActionResponse} from '@/types/action';
import {ToastAction} from '@/ui/components';
import {useToast} from '@/ui/hooks';

import type {ActionConfig} from '../actions';
import {VERSION_MISMATCH_ERROR} from '../constants';

export function useRetryAction<
  T extends Record<string, unknown>,
  R extends ActionResponse,
>(
  action: (actionProps: T, config?: ActionConfig) => R,
): {
  action: (
    actionProps: T,
    config?: {
      onSuccess?: (res: Extract<Awaited<R>, {success: true}>['data']) => void;
      onDiscard?: () => void;
    },
  ) => Promise<void>;
  loading: boolean;
} {
  const [loading, setLoading] = useState(false);
  const {toast} = useToast();

  const handleError = useCallback(
    (
      message: string,
      retryProps: T,
      config?: {
        onSuccess?: (res: Extract<Awaited<R>, {success: true}>['data']) => void;
        onDiscard?: () => void;
      },
    ) => {
      if (message === VERSION_MISMATCH_ERROR) {
        const handleOverwrite = async () => {
          setLoading(true);
          try {
            const {error, message, data} = await action(retryProps, {
              force: true,
            });
            if (error) {
              handleError(message, retryProps, config);
              return;
            }
            config?.onSuccess?.(data);
          } catch (e) {
            toast({
              variant: 'destructive',
              title: e instanceof Error ? e.message : i18n.t('Unknown Error'),
            });
            return;
          } finally {
            setLoading(false);
          }
        };
        const handleDiscard = () => {
          config?.onDiscard?.();
        };
        return toast({
          variant: 'destructive',
          title: i18n.t('Record has been modified by someone else'),
          className: 'flex gap-4 flex-col',
          duration: 10000,
          action: (
            <div className="flex gap-4">
              <ToastAction altText="Overwrite" onClick={handleOverwrite}>
                {i18n.t('Overwrite')}
              </ToastAction>
              <ToastAction altText="Discard" onClick={handleDiscard}>
                {i18n.t('Discard')}
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
    [toast, action],
  );

  const actionHandler = useCallback(
    async (
      actionProps: T,
      config?: {
        onSuccess?: (res: Extract<Awaited<R>, {success: true}>['data']) => void;
        onDiscard?: () => void;
      },
    ): Promise<void> => {
      try {
        setLoading(true);
        const {error, message, data} = await action(actionProps);
        if (error) {
          handleError(message, actionProps, config);
          return;
        }
        config?.onSuccess?.(data);
      } catch (e) {
        toast({
          variant: 'destructive',
          title: e instanceof Error ? e.message : i18n.t('Unknown Error'),
        });
        return;
      } finally {
        setLoading(false);
      }
    },
    [action, handleError, toast],
  );

  return {
    action: actionHandler,
    loading,
  };
}
