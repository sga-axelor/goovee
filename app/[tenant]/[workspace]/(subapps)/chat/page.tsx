import {getAuthToken} from './api/api';
import ChatView from './components/chatView';

export default async function Chat({
  params,
}: {
  params: {tenant: string; workspace: string};
}) {
  const {data: user, token} = await getAuthToken(
    'r.paux@kp1.fr',
    'R.paux@kp1.fr',
  );

  console.log('user', user);
  return <ChatView token={token} user={user} />;
}
