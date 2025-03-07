import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {workspacePathname} from '@/utils/workspace';
import {findWorkspace} from '@/orm/workspace';
import {clone} from '@/utils';

// ---- LOCAL IMPORTS ---- //
import {findSurveyById} from '@/subapps/survey/common/orm/survey';
import {SurveyViewer} from '@/subapps/survey/common/ui/components';

export default async function Page({
  params,
}: {
  params: {tenant: string; workspace: string; slug: string};
}) {
  const session = await getSession();
  const user = session?.user;

  const {workspaceURL} = workspacePathname(params);
  const {tenant, slug} = params;

  const workspace: any = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  const survey = await findSurveyById({
    slug,
    workspace,
    tenantId: tenant,
  });

  if (!survey) return notFound();

  return (
    <SurveyViewer
      survey={clone(survey)}
      partnerId={user?.id as number}
      workspace={workspace}
    />
  );
}
