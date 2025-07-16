import {SUBAPP_CODES} from '@/constants';

export function getMetaFileURL(props: {
  metaFile: {id: string | number} | undefined;
  websiteSlug: string;
  websitePageSlug: string;
  path: string;
  workspaceURI: string;
  code?: string;
}) {
  const {workspaceURI, metaFile} = props;
  if (!metaFile?.id || !props.code) return '';

  const code = encodeURIComponent(props.code);
  const path = encodeURIComponent(props.path);
  const websiteSlug = encodeURIComponent(props.websiteSlug);
  const websitePageSlug = encodeURIComponent(props.websitePageSlug);

  return `${workspaceURI}/${SUBAPP_CODES.website}/api/templates/${websiteSlug}/${websitePageSlug}/${code}/${path}/${metaFile.id}`;
}
