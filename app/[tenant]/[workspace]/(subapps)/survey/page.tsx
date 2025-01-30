import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {workspacePathname} from '@/utils/workspace';
import {findWorkspace} from '@/orm/workspace';
import {clone} from '@/utils';

// ---- LOCAL IMPORTS ---- //
import Content from './content';
import {
  findMetaModelRecords,
  findSurveys,
} from '@/subapps/survey/common/orm/survey';
import {DEFAULT_TABLE_LIMIT} from '@/subapps/survey/common/constants';

export default async function Page({
  params,
  searchParams,
}: {
  params: any;
  searchParams: {[key: string]: string | undefined};
}) {
  const session = await getSession();
  const user = session?.user;

  if (!user) return notFound();

  const {workspaceURL, tenant} = workspacePathname(params);
  const {page, responsePage, search} = searchParams;

  const workspace: any = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  const {surveys, pageInfo: surveysPageInfo}: any = await findSurveys({
    workspace,
    tenantId: tenant,
    limit: DEFAULT_TABLE_LIMIT,
    page,
    search,
  });

  const {responses, pageInfo: responsesPageInfo}: any =
    (await findMetaModelRecords({
      workspace,
      tenantId: tenant,
      limit: DEFAULT_TABLE_LIMIT,
      page: responsePage,
      search,
    })) ?? [];

  return (
    <Content
      surveys={surveys}
      surveysPageInfo={surveysPageInfo}
      responses={clone(responses)}
      responsesPageInfo={responsesPageInfo}
      workspace={workspace}
    />
  );
}
