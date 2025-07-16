import {SUBAPP_CODES} from '@/constants';
import {getSession} from '@/lib/core/auth';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import {workspacePathname} from '@/utils/workspace';
import {NextRequest, NextResponse} from 'next/server';
import {findWebsitePageBySlug} from '@/subapps/website/common/orm/website';
import {get} from 'lodash';
import {findFile, streamFile} from '@/utils/download';
import {formatComponentCode} from '@/app/[tenant]/[workspace]/(subapps)/website/common/utils/templates';

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      tenant: string;
      workspace: string;
      websiteSlug: string;
      websitePageSlug: string;
      code: string;
      path: string;
      'file-id': string;
    };
  },
) {
  const {workspaceURL, tenant: tenantId} = workspacePathname(params);
  const {code, 'file-id': fileId, websitePageSlug, websiteSlug, path} = params;
  const session = await getSession();
  const user = session?.user;

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!workspace) {
    return new NextResponse('Invalid workspace', {status: 401});
  }

  const app = await findSubappAccess({
    code: SUBAPP_CODES.website,
    user,
    url: workspaceURL,
    tenantId,
  });
  if (!app?.installed) {
    return new NextResponse('Unauthorized', {status: 401});
  }

  const websitePage = await findWebsitePageBySlug({
    websiteSlug: websiteSlug,
    websitePageSlug: websitePageSlug,
    workspaceURL: workspaceURL,
    user,
    tenantId,
  });

  if (!websitePage) {
    return new NextResponse('Page not found', {status: 404});
  }

  const attrs = websitePage.contentLines.find(
    line => line?.content?.component?.code === formatComponentCode(code),
  )?.content?.attrs;

  const metaFile = get(attrs, path);

  if (!isMetaFile(metaFile)) {
    return new NextResponse(`Path: ${path} doesn't have a metaFile`, {
      status: 404,
    });
  }

  if (String(metaFile.id) !== String(fileId)) {
    return new NextResponse(`file Id : ${fileId} doesn't match`, {status: 404});
  }

  const file = await findFile({
    id: metaFile.id,
    meta: true,
    tenant: tenantId,
  });

  if (!file) {
    return new NextResponse('File not found', {status: 404});
  }

  return streamFile(file);
}

const isMetaFile = (file: any): boolean => {
  return !!(file?.filePath && file?.fileName && file?.id);
};
