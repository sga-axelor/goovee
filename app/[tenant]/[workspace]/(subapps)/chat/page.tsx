import React from 'react';

// ---- LOCAL IMPORTS ---- //
import {getAuthToken, getUsers, getUserStatus} from './api';
import {ChatView} from './components';
import {getTeam} from './orm/orm';
import {clone} from '@/utils';
import {getSession} from '@/lib/core/auth';
import {t} from '@/locale/server';

export default async function Chat({params}: {params: {tenant: string}}) {
  const session = await getSession();
  const user = session?.user;
  const {data: mmuser, token} = await getAuthToken(user?.email, user?.email);

  if (!token) {
    return <div>{await t('No discussions available')}</div>;
  }

  const team = await getTeam({tenant: params.tenant}).then(clone);

  if (!team || team?.teamId === '') {
    return <div>{await t('Chat configuration error.')}</div>;
  }

  const userStatus = await getUserStatus(mmuser.id, token);
  const users = await getUsers(token);

  return (
    <ChatView
      token={token}
      user={mmuser}
      userStatus={userStatus}
      users={users}
      teamId={team?.teamId}
    />
  );
}
