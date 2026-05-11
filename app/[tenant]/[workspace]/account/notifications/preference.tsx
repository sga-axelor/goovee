'use client';

// ---- CORE IMPORTS ---- //
import {Separator} from '@/ui/components/separator';
import {useWorkspace} from '../../workspace-context';
import {Checkbox} from '@/ui/components/checkbox';
import {useToast} from '@/ui/hooks';
import type {NotificationAppCode} from '@/utils/validators';

// ---- LOCAL IMPORTS ---- //
import {updatePreference} from './action';
import type {PreferenceResponse} from '@/orm/notification';
import {CheckedState} from '@radix-ui/react-checkbox';
import type {UpdateNotificationPreference} from '../common/utils/validators';
import {i18n} from '@/lib/core/locale';
import {useState} from 'react';

export function Preference({
  preference,
  title,
  code,
  hideSubscription,
}: {
  preference: PreferenceResponse | null;
  title: string;
  code: NotificationAppCode;
  hideSubscription?: boolean;
}) {
  const {tenant, workspaceURI, workspaceURL} = useWorkspace();
  const {toast} = useToast();

  const changePreference =
    (root?: boolean) =>
    async (activateNotification: CheckedState, subscriptionId?: string) => {
      if (activateNotification === 'indeterminate') return;
      const data: UpdateNotificationPreference['data'] | undefined = root
        ? {activateNotification}
        : subscriptionId
          ? {
              activateNotification,
              record: {
                id: subscriptionId,
                activateNotification,
              },
            }
          : undefined;

      if (!data) return;

      try {
        const result = await updatePreference({
          workspaceURL,
          workspaceURI,
          tenant,
          code,
          data,
        });
        if ('error' in result) {
          toast({
            title: result.message,
            variant: 'destructive',
          });
        }
      } catch (err) {
        toast({
          title:
            err instanceof Error ? err.message : i18n.t('Something went wrong'),
          variant: 'destructive',
        });
      }
    };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 items-center gap-2 p-1">
        <h5 className="font-medium">{title}</h5>
        <Checkbox
          defaultChecked={preference?.activateNotification || false}
          name="activateNotification"
          onCheckedChange={changePreference(true)}
          variant="success"
        />
      </div>
      {!hideSubscription && preference?.activateNotification && (
        <div className="space-y-2">
          {preference?.subscriptions?.map((subscription, i: number) => (
            <div
              className="grid grid-cols-2 items-center gap-2 p-1"
              key={subscription?.id}>
              <p className="text-sm">{subscription?.name}</p>
              <Checkbox
                defaultChecked={subscription.activateNotification}
                name="activateNotification"
                onCheckedChange={e =>
                  changePreference(false)(e, subscription.id)
                }
                variant="success"
              />
            </div>
          ))}
        </div>
      )}
      <Separator />
    </div>
  );
}
