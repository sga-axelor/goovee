'use client';

import Link from 'next/link';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {MdDeleteOutline, MdKeyboardArrowDown} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/i18n';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/ui/components/accordion';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/ui/components/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/components/select';
import {Avatar, AvatarImage, AvatarFallback} from '@/ui/components/avatar';
import {Button} from '@/ui/components/button';
import {cn} from '@/utils/css';
import {useWorkspace} from '../../workspace-context';
import {getInitials} from '@/utils/names';
import {getDownloadURL} from '@/utils/files';
import {SUBAPP_WITH_ROLES} from '@/constants';
import {useToast} from '@/ui/hooks';

// ---- LOCAL IMPORTS ---- //
import {Authorization, Role} from '../common/types';
import {deleteInvite} from './invite/action';
import {RoleLabel} from '../common/constants';
import {
  deleteMember,
  updateInviteApplication,
  updateInviteAuthentication,
  updateMemberApplication,
  updateMemberAuthentication,
} from './action';

function Members({members, availableApps}: any) {
  const {workspaceURL, tenant} = useWorkspace();
  const {toast} = useToast();
  const router = useRouter();

  const [confirmationDialog, setConfirmationDialog] = useState<any>(null);

  const openConfirmation = (member: any) => () => {
    setConfirmationDialog(member);
  };

  const closeConfirmation = () => {
    setConfirmationDialog(null);
  };

  const handleUpdateApplication =
    (member: any, app: any) => async (value: 'yes' | 'no') => {
      const result = await updateMemberApplication({
        member,
        app,
        value,
        workspaceURL,
      });

      if (result) {
        if ('error' in result) {
          toast({
            title: i18n.get('Error updating invite'),
            variant: 'destructive',
          });
        } else {
          router.refresh();
        }
      }
    };

  const handleUpdateAuthentication =
    (member: any, app: any) => async (value: Authorization) => {
      const result = await updateMemberAuthentication({
        member,
        app,
        value,
        workspaceURL,
      });

      if (result) {
        if ('error' in result) {
          toast({
            title: i18n.get('Error updating invite'),
            variant: 'destructive',
          });
        } else {
          router.refresh();
        }
      }
    };

  const handleDeleteMember = async () => {
    const {id, email} = confirmationDialog;
    closeConfirmation();

    const result =
      (await deleteMember({
        member: {id, email},
        workspaceURL,
      })) || ({error: true} as any);

    if ('error' in result) {
      toast({
        title: result.message || i18n.get('Error deleting member'),
        variant: 'destructive',
      });
    } else {
      toast({
        title: i18n.get('Member deleted.'),
        variant: 'success',
      });

      router.refresh();
    }
  };

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-xl font-medium">{i18n.get('Members')}</h2>
        <Accordion type="single" collapsible>
          {members.map((member: any) => {
            const {
              id,
              picture,
              fullName,
              emailAddress,
              contactWorkspaceConfig,
            } = member;
            const isAdminContact = contactWorkspaceConfig?.isAdmin;

            const isPartner = !member.isContact;
            const isOwner = isPartner;

            const roleLabel =
              RoleLabel[
                isOwner ? Role.owner : isAdminContact ? Role.admin : Role.user
              ];

            return (
              <AccordionItem value={id} key={id} className="border-b">
                <div className="flex flex-col gap-2 py-2 px-4">
                  <div className="grid grid-cols-4 items-center gap-6">
                    <div className="flex items-center gap-[7.5rem]">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-8">
                          <AvatarImage
                            src={getDownloadURL(picture?.id, tenant, {
                              isMeta: true,
                              noimage: true,
                              noimageSrc: '/images/profile.png',
                            })}
                          />
                          <AvatarFallback>
                            {getInitials(fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm">{fullName}</p>
                      </div>
                    </div>
                    <p className="text-sm">{emailAddress?.address}</p>
                    <p className="text-sm">{roleLabel}</p>
                    <div className="flex items-center gap-6 justify-self-end">
                      <MdDeleteOutline
                        className={cn(
                          'size-6 text-destructive cursor-pointer',
                          {hidden: isOwner},
                        )}
                        onClick={openConfirmation(member)}
                      />
                      <AccordionTrigger
                        className={cn({hidden: isAdminContact || isOwner})}>
                        <MdKeyboardArrowDown className="size-6 cursor-pointer" />
                      </AccordionTrigger>
                    </div>
                  </div>
                  <AccordionContent
                    className={cn({hidden: isAdminContact || isOwner})}>
                    <div className="space-y-[1px]">
                      {availableApps?.map((app: any) => {
                        const {name, code} = app;

                        const permission =
                          contactWorkspaceConfig?.contactAppPermissionList.find(
                            (a: any) => a.app.code === code,
                          );

                        return (
                          <div className="px-2 border-b" key={code}>
                            <div className="grid grid-cols-[20%_20%_20%] items-center px-4 py-2 gap-6">
                              <p className="text-xs font-bold">{name}</p>
                              <Select
                                value={permission ? 'yes' : 'no'}
                                onValueChange={handleUpdateApplication(
                                  member,
                                  app,
                                )}>
                                <SelectTrigger className="text-xs w-16">
                                  <SelectValue
                                    placeholder={i18n.get('Select access')}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {[
                                    {label: 'Yes', value: 'yes'},
                                    {label: 'No', value: 'no'},
                                  ].map((option: any) => (
                                    <SelectItem
                                      className="text-xs"
                                      value={option.value}
                                      key={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {SUBAPP_WITH_ROLES.includes(code) && (
                                <Select
                                  defaultValue={
                                    permission?.roleSelect ||
                                    Authorization.restricted
                                  }
                                  onValueChange={handleUpdateAuthentication(
                                    member,
                                    app,
                                  )}
                                  disabled={!permission}>
                                  <SelectTrigger className="text-xs w-28">
                                    <SelectValue
                                      placeholder={i18n.get(
                                        'Select authorization',
                                      )}
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {[
                                      {
                                        label: 'Restricted',
                                        value: Authorization.restricted,
                                      },
                                      {
                                        label: 'Total',
                                        value: Authorization.total,
                                      },
                                    ].map((option: any) => (
                                      <SelectItem
                                        className="text-xs"
                                        value={option.value}
                                        key={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </div>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
      <AlertDialog open={Boolean(confirmationDialog)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {i18n.get('Do you want to delete member?')}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeConfirmation}>
              {i18n.get('Cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMember}>
              {i18n.get('Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function Invited({invites, availableApps}: any) {
  const {workspaceURI, workspaceURL} = useWorkspace();
  const {toast} = useToast();
  const router = useRouter();

  const [confirmationDialog, setConfirmationDialog] = useState<any>(null);

  const openConfirmation = (invite: any) => () => {
    setConfirmationDialog(invite);
  };

  const closeConfirmation = () => {
    setConfirmationDialog(null);
  };

  const handleUpdateApplication =
    (invite: any, app: any) => async (value: 'yes' | 'no') => {
      const result = await updateInviteApplication({
        invite,
        app,
        value,
        workspaceURL,
      });

      if (result) {
        if ('error' in result) {
          toast({
            title: i18n.get('Error updating invite'),
            variant: 'destructive',
          });
        } else {
          router.refresh();
        }
      }
    };

  const handleUpdateAuthentication =
    (invite: any, app: any) => async (value: Authorization) => {
      const result = await updateInviteAuthentication({
        invite,
        app,
        value,
        workspaceURL,
      });

      if (result) {
        if ('error' in result) {
          toast({
            title: i18n.get('Error updating invite'),
            variant: 'destructive',
          });
        } else {
          router.refresh();
        }
      }
    };

  const handleDeleteInvite = async () => {
    const id = confirmationDialog?.id;
    closeConfirmation();

    const result =
      (await deleteInvite({
        id,
        workspaceURL,
      })) || ({error: true} as any);

    if ('error' in result) {
      toast({
        title: result.message || i18n.get('Error deleting invite'),
        variant: 'destructive',
      });
    } else {
      toast({
        title: i18n.get('Invite deleted.'),
        variant: 'success',
      });

      router.refresh();
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">{i18n.get('Invited')}</h2>
          <Link href={`${workspaceURI}/account/members/invite`}>
            <Button variant="success">{i18n.get('Invite new members')}</Button>
          </Link>
        </div>
        <Accordion type="single" collapsible>
          {invites.map((invite: any) => {
            const {emailAddress, id, ...rest} = invite;

            const contactWorkspaceConfig = rest.contactAppPermissionList?.[0];

            const isAdminContact = contactWorkspaceConfig?.isAdmin;
            return (
              <AccordionItem value={id} key={id}>
                <div className="flex flex-col gap-2 py-2 px-4">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex justify-between basis-[40%]">
                      <p className="text-sm">{emailAddress?.address}</p>
                      <p className="text-sm">
                        {RoleLabel[isAdminContact ? Role.admin : Role.user]}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <MdDeleteOutline
                        className="size-6 text-destructive cursor-pointer"
                        onClick={openConfirmation(invite)}
                      />
                      <AccordionTrigger
                        className={cn({hidden: isAdminContact})}>
                        <MdKeyboardArrowDown className="size-6 cursor-pointer" />
                      </AccordionTrigger>
                    </div>
                  </div>
                  <AccordionContent className={cn({hidden: isAdminContact})}>
                    <div className="space-y-[1px]">
                      {availableApps?.map((app: any) => {
                        const {code, name} = app;
                        const permission =
                          contactWorkspaceConfig?.contactAppPermissionList.find(
                            (a: any) => a?.app?.code === code,
                          );

                        return (
                          <div className="px-2 border-b" key={code}>
                            <div className="grid grid-cols-[20%_20%_20%] items-center px-4 py-2 gap-6">
                              <p className="text-xs font-bold">{name}</p>
                              <Select
                                value={permission ? 'yes' : 'no'}
                                onValueChange={handleUpdateApplication(
                                  invite,
                                  app,
                                )}>
                                <SelectTrigger className="text-xs w-16">
                                  <SelectValue
                                    placeholder={i18n.get('Select access')}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {[
                                    {label: 'Yes', value: 'yes'},
                                    {label: 'No', value: 'no'},
                                  ].map((option: any) => (
                                    <SelectItem
                                      className="text-xs"
                                      value={option.value}
                                      key={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {SUBAPP_WITH_ROLES.includes(code) && (
                                <Select
                                  defaultValue={
                                    permission?.roleSelect ||
                                    Authorization.restricted
                                  }
                                  disabled={!permission}
                                  onValueChange={handleUpdateAuthentication(
                                    invite,
                                    app,
                                  )}>
                                  <SelectTrigger className="text-xs w-28">
                                    <SelectValue
                                      placeholder={i18n.get(
                                        'Select authorization',
                                      )}
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {[
                                      {
                                        label: 'Restricted',
                                        value: Authorization.restricted,
                                      },
                                      {
                                        label: 'Total',
                                        value: Authorization.total,
                                      },
                                    ].map((option: any) => (
                                      <SelectItem
                                        className="text-xs"
                                        value={option.value}
                                        key={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </div>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
      <AlertDialog open={Boolean(confirmationDialog)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {i18n.get('Do you want to delete invite?')}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeConfirmation}>
              {i18n.get('Cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteInvite}>
              {i18n.get('Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function Content({members, invites, availableApps}: any) {
  return (
    <div className="space-y-10">
      <Members members={members} availableApps={availableApps} />
      <Invited invites={invites} availableApps={availableApps} />
    </div>
  );
}
