import React from 'react';
import {getAuthToken, getUsers, getUserStatus} from './api';
import {ChatView} from './components';
import {getTeamId} from './orm/orm';

export default async function Chat({
  params,
}: {
  params: {tenant: string; workspace: string};
}) {
  //A CHANGER
  const {data: user, token} = await getAuthToken(
    process.env.MATTERMOST_LOGIN,
    process.env.MATTERMOST_PASSWORD,
  );

  const tenant = await getTeamId();
  const teamId = tenant?.teamId;

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
