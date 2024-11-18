import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {workspacePathname} from '@/utils/workspace';
import {findWorkspace} from '@/orm/workspace';
import {clone} from '@/utils';
import {DEFAULT_LIMIT} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import Content from './content';
import {
  findMetaModelRecords,
  findSurveys,
} from '@/subapps/survey/common/orm/survey';

export default async function Page({params}: {params: any}) {
  const session = await getSession();
  const user = session?.user;

  if (!user) return notFound();

  const {workspaceURL, tenant} = workspacePathname(params);

  const workspace: any = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  const surveys = await findSurveys({
    workspace,
    tenantId: tenant,
    limit: DEFAULT_LIMIT,
  });

  const responses =
    (await findMetaModelRecords({
      workspace,
      tenantId: tenant,
      limit: DEFAULT_LIMIT,
    })) ?? [];

  const enrichedResponses = await Promise.all(
    responses.map(async response => ({
      ...response,
      attrs: await response.attrs,
    })),
  );

  return (
    <Content
      surveys={surveys}
      responses={clone(enrichedResponses)}
      workspace={workspace}
    />
  );
}
