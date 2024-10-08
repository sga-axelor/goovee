import {getAuthToken, getUsers, getUserStatus} from './api';
import {ChatView} from './components';

export default async function Chat({
  params,
}: {
  params: {tenant: string; workspace: string};
}) {
  const {data: user, token} = await getAuthToken(
    process.env.MATTERMOST_LOGIN,
    process.env.MATTERMOST_PASSWORD,
  );
  const teamId: any = process.env.MATTERMOST_TEAM_ID;

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
