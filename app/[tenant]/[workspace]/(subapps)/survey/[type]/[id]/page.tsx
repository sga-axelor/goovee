import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {workspacePathname} from '@/utils/workspace';
import {findWorkspace} from '@/orm/workspace';
import {clone} from '@/utils';

// ---- LOCAL IMPORTS ---- //
import Content from './content';
import {
  findMetaModelRecordById,
  findSurveyById,
} from '@/subapps/survey/common/orm/survey';
import {Response, Survey} from '@/subapps/survey/common/types';

export default async function Page({
  params,
}: {
  params: {tenant: string; workspace: string; id: string; type: string};
}) {
  const session = await getSession();
  const user = session?.user;

  if (!user) return notFound();

  const partnerId =
    typeof user.id === 'number' ? user.id : parseInt(user.id, 10);

  const {workspaceURL} = workspacePathname(params);
  const {id, tenant, type} = params;

  const workspace: any = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  if (type == 'response') {
    const response = await findMetaModelRecordById({
      id: parseInt(id, 10) as Response['id'],
      workspace,
      tenantId: tenant,
    }).then(clone);

    return (
      <Content
        survey={response.attrs?.surveyConfig}
        response={response}
        partnerId={partnerId}
      />
    );
  } else if (type === 'open') {
    const survey = await findSurveyById({
      id: parseInt(id, 10) as Survey['id'],
      workspace,
      tenantId: tenant,
    });

    return <Content survey={clone(survey)} partnerId={partnerId} />;
  }

  return notFound();
}
