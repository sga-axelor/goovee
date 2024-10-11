import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {i18n} from '@/lib/i18n';
import {useToast} from '@/ui/hooks';
import type {ID} from '@goovee/orm';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {deleteChildLink, deleteRelatedLink} from '../../../actions';
import {Button} from '../delete-button';

export function RemoveLinkButton({
  ticketId,
  linkId,
  relatedTicketId,
}: {
  ticketId: ID;
  linkId: ID;
  relatedTicketId: ID;
}) {
  const {workspaceURL} = useWorkspace();
  const router = useRouter();
  const {toast} = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!loading) {
      try {
        const {error, message} = await deleteRelatedLink({
          workspaceURL,
          data: {
            currentTicketId: ticketId,
            linkTicketId: relatedTicketId,
            linkId,
          },
        });

        if (error) {
          return toast({
            variant: 'destructive',
            title: message,
          });
        }

        toast({
          variant: 'success',
          title: i18n.get('Link removed'),
        });

        router.refresh();
      } catch (e) {
        if (e instanceof Error) {
          return toast({
            variant: 'destructive',
            title: e.message,
          });
        }
        toast({
          variant: 'destructive',
          title: i18n.get('An error occurred'),
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return <Button onClick={handleDelete} disabled={loading} />;
}

export function RemoveChildButton({
  ticketId,
  relatedTicketId,
}: {
  ticketId: ID;
  relatedTicketId: ID;
}) {
  const {workspaceURL} = useWorkspace();
  const router = useRouter();
  const {toast} = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!loading) {
      try {
        const {error, message} = await deleteChildLink({
          workspaceURL,
          data: {
            currentTicketId: ticketId,
            linkTicketId: relatedTicketId,
          },
        });

        if (error) {
          return toast({
            variant: 'destructive',
            title: message,
          });
        }

        toast({
          variant: 'success',
          title: i18n.get('Link removed'),
        });

        router.refresh();
      } catch (e) {
        if (e instanceof Error) {
          return toast({
            variant: 'destructive',
            title: e.message,
          });
        }
        toast({
          variant: 'destructive',
          title: i18n.get('An error occurred'),
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return <Button onClick={handleDelete} disabled={loading} />;
}
