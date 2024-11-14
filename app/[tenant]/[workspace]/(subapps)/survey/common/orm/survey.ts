// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {manager, type Tenant} from '@/tenant';
import {PortalWorkspace} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {SURVEY_STATUS, SURVEY_TYPE} from '@/subapps/survey/common/constants';

export async function findSurveys({
  workspace,
  tenantId,
  limit,
}: {
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
  limit?: number;
}) {
  if (!(workspace && tenantId)) return [];
  const client = await manager.getClient(tenantId);

  const surveys = await client.aOSSurveyConfig
    .find({
      where: {
        typeSelect: SURVEY_TYPE.PUBLIC,
        statusSelect: SURVEY_STATUS.PUBLISHED,
      },
      take: limit,
      select: {
        name: true,
        statusSelect: true,
        typeSelect: true,
        category: {
          name: true,
        },
        target: {
          name: true,
        },
        publicationDatetime: true,
      },
    })
    .then(clone)
    .catch((error: any) => console.log('error >>>', error));

  return surveys;
}
