import {SUBAPP_CODES} from '@/constants';
import type {MountType} from '../types';

export function getMetaFileURL(props: {
  metaFile: {id: string | number} | undefined;
  websiteSlug: string;
  websitePageSlug?: string;
  path: string;
  workspaceURI: string;
  contentId?: string | number;
  mountType: MountType;
}) {
  const {workspaceURI, metaFile} = props;
  if (!metaFile?.id || !props.contentId) return '';

  const contentId = encodeURIComponent(props.contentId);
  const path = encodeURIComponent(props.path);
  const websiteSlug = encodeURIComponent(props.websiteSlug);
  const websitePageSlug = encodeURIComponent(
    props.mountType === 'page' ? props.websitePageSlug! : props.mountType,
  );
  const mountType = encodeURIComponent(props.mountType);

  return `${workspaceURI}/${SUBAPP_CODES.website}/api/templates/${mountType}/${websiteSlug}/${websitePageSlug}/${contentId}/${path}/${metaFile.id}`;
}
