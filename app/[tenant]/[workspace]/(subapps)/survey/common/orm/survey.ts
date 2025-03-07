// ---- CORE IMPORTS ---- //
import {clone, getPageInfo, getSkipInfo} from '@/utils';
import {manager, type Tenant} from '@/tenant';
import {PortalWorkspace} from '@/types';
import {getSession} from '@/auth';
import {DEFAULT_PAGE} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {SURVEY_STATUS} from '@/subapps/survey/common/constants';
import {Response, Survey} from '@/subapps/survey/common/types';
import {filterPrivate} from '@/orm/filter';

export async function findSurveys({
  workspace,
  tenantId,
  limit,
  page = DEFAULT_PAGE,
  search,
}: {
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
  limit?: number;
  page?: string | number;
  search?: string;
}) {
  if (!(workspace && tenantId)) return [];
  const client = await manager.getClient(tenantId);
  const session = await getSession();
  const user = session?.user;

  const skip = getSkipInfo(limit, page);

  let surveys = await client.aOSSurveyConfig
    .find({
      where: {
        statusSelect: SURVEY_STATUS.PUBLISHED,
        slug: {ne: null},
        ...(search ? {name: {like: `%${search}%`}} : {}),
        isHidden: false,
        ...(user
          ? await filterPrivate({user, tenantId})
          : {isPrivate: false, isLoginNotNeeded: true}),
      },
      take: limit,
      ...(skip ? {skip} : {}),
      select: {
        name: true,
        slug: true,
        statusSelect: true,
        category: {name: true},
        publicationDatetime: true,
        isPublic: true,
        isHidden: true,
        isLoginNotNeeded: true,
      },
    })
    .then(clone)
    .catch((error: any) => console.log('error >>>', error));

  if (Array.isArray(surveys) && user) {
    let result = [];
    for (const _survey of surveys) {
      const responses = await client.aOSMetaJsonRecord
        .find({
          where: {
            AND: [
              {attrs: {path: 'partner.id', eq: user.id}},
              {attrs: {path: 'surveyConfig.id', eq: _survey.id}},
            ],
          },
        })
        .catch((error: any) => console.log('error >>>', error));

      result.push({..._survey, nbResponses: responses?.length ?? 0});
    }

    surveys = result;
  }

  const pageInfo = getPageInfo({
    count: surveys?.[0]?._count,
    page,
    limit,
  });

  return {surveys, pageInfo};
}

export async function findMetaModelRecords({
  workspace,
  tenantId,
  limit,
  page = DEFAULT_PAGE,
  search,
}: {
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
  limit?: number;
  page?: string | number;
  search?: string;
}) {
  if (!(workspace && tenantId)) return [];

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return [];
  }
  const client = await manager.getClient(tenantId);
  const skip = getSkipInfo(limit, page);
  const responses: any = await client.aOSMetaJsonRecord
    .find({
      where: {
        AND: [
          {attrs: {path: 'partner.id', eq: user.id}},
          {attrs: {path: 'surveyConfig', ne: null}},
        ],
        ...(search
          ? {attrs: {path: 'surveyConfig.name', like: `%${search}%`}}
          : {}),
      },
      take: limit,
      ...(skip ? {skip} : {}),
      select: {
        attrs: true,
        createdOn: true,
        updatedOn: true,
      },
    })
    .catch((error: any) => console.log('error >>>', error));

  const enrichedResponses = await Promise.all(
    responses.map(async (response: any) => ({
      ...response,
      attrs: await response.attrs,
    })),
  );

  const finalResponses = await Promise.all(
    enrichedResponses.map(async response => ({
      ...response,
      attrs: {
        ...response.attrs,
        surveyConfig: await findSurveyById({
          workspace,
          tenantId,
          id: response.attrs.surveyConfig.id,
        }),
      },
    })),
  );

  const pageInfo = getPageInfo({
    count: responses?.[0]?._count,
    page,
    limit,
  });

  return {responses: finalResponses, pageInfo};
}

export async function findSurveyById({
  workspace,
  tenantId,
  id,
  slug,
}: {
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
  id?: Survey['id'];
  slug?: Survey['slug'];
}) {
  if (!id && !slug) return undefined;
  if (!(workspace && tenantId)) return undefined;
  const session = await getSession();
  const user = session?.user;

  const client = await manager.getClient(tenantId);
  const survey = await client.aOSSurveyConfig
    .findOne({
      where: {
        ...(id ? {id} : {}),
        ...(slug ? {slug} : {}),
        ...(user
          ? await filterPrivate({user, tenantId})
          : {isPrivate: false, isLoginNotNeeded: true}),
      },
      select: {
        name: true,
        slug: true,
        statusSelect: true,
        category: {name: true},
        canAnswerBeModified: true,
        publicationDatetime: true,
        config: true,
        themeConfig: true,
        customModel: {name: true},
      },
    })
    .then(async res =>
      !res
        ? undefined
        : {
            ...res,
            config: await res?.config,
            themeConfig: await res?.themeConfig,
          },
    )
    .then(clone)
    .catch((error: any) => console.log('error >>>', error));

  return survey;
}

export async function findMetaModelRecordById({
  workspace,
  tenantId,
  id,
  surveyId,
}: {
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
  id: Response['id'];
  surveyId?: Survey['id'];
}) {
  if (!(workspace && tenantId)) return undefined;

  const session = await getSession();
  const user = session?.user;

  const client = await manager.getClient(tenantId);
  const response = await client.aOSMetaJsonRecord.findOne({
    where: {
      id,
      AND: [
        user
          ? {attrs: {path: 'partner.id', eq: user?.id}}
          : {attrs: {path: 'partner', eq: null}},
        {attrs: {path: 'surveyConfig.id', eq: surveyId}},
      ],
    },
    select: {attrs: true},
  });

  const enrichedResponse = response
    ? {...response, attrs: await response.attrs}
    : undefined;

  return enrichedResponse as any;
}
