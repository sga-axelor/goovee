import React from 'react';

// ---- LOCAL IMPORTS ---- //
import {getAuthToken, getUsers, getUserStatus} from './api';
import {ChatView} from './components';
import {getTeam} from './orm/orm';
import {clone} from '@/utils';
import {getSession} from '@/lib/core/auth';

export default async function Chat({params}: {params: {tenant: string}}) {
  const session = await getSession();
  const user = session?.user;
  const {data: mmuser, token} = await getAuthToken(user?.email, user?.email);

  if (!token) {
    return <div>Aucune discussion disponible</div>;
  }

  const team = await getTeam({tenant: params.tenant}).then(clone);

  if (!team || team?.teamId === '') {
    return <div>Erreur de configuration du chat.</div>;
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
