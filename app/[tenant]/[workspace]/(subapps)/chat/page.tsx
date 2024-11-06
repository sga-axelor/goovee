import React from 'react';

// ---- LOCAL IMPORTS ---- //
import {getAuthToken, getUsers, getUserStatus} from './api';
import {ChatView} from './components';
import {getTeamId} from './orm/team';

export default async function Chat({params}: {params: {tenant: string}}) {
  const {data: user, token} = await getAuthToken(
    process.env.MATTERMOST_LOGIN,
    process.env.MATTERMOST_PASSWORD,
  );

  const teamId = await getTeamId({tenant: params.tenant});

  if (!teamId || teamId === '') {
    return <div>Erreur de configuration du chat.</div>;
  }

  const userStatus = await getUserStatus(user.id, token);
  const users = await getUsers(token);

  return (
    <ChatView
      token={token}
      user={user}
      userStatus={userStatus}
      users={users}
      teamId={teamId}
    />
  );
}
