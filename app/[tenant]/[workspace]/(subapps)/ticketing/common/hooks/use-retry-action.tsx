import {i18n} from '@/lib/i18n';
import {useToast} from '@/ui/hooks';
import {useRouter} from 'next/navigation';
import {useCallback, useState} from 'react';
import {VERSION_MISMATCH_ERROR} from '../constants';
import {ActionResponse} from '../actions';
import {ToastAction} from '@/ui/components';

export function useRetryAction<T extends Record<string, any>>(
  action: (actionProps: T, force?: boolean) => ActionResponse,
  successMessage?: string,
) {
  const [loading, setLoading] = useState(false);
  const {toast} = useToast();
  const router = useRouter();
  const handleSuccess = useCallback(() => {
    router.refresh();
    toast({
      variant: 'success',
      title: successMessage ?? i18n.get('Saved successfully'),
    });
  }, [toast, router, successMessage]);

  const handleError = useCallback(
    (message: string, retryProps: T) => {
      if (message === VERSION_MISMATCH_ERROR) {
        const handleOverwrite = async () => {
          setLoading(true);
          try {
            const {error, message, data} = await action(retryProps, true);
            if (error) {
              handleError(message, retryProps);
              return;
            }
            handleSuccess();
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
    async (actionProps: T) => {
      try {
        setLoading(true);
        const {error, message, data} = await action(actionProps);
        if (error) {
          handleError(message, actionProps);
          return;
        }
        handleSuccess();
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
