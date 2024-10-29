'use client';

// ---- CORE IMPORTS ---- //
import {HeroSearch} from '@/ui/components';
import {i18n} from '@/i18n';
import {BANNER_DESCRIPTION, BANNER_TITLES, IMAGE_URL} from '@/constants';
import {type Tenant} from '@/tenant';
import type {PortalWorkspace} from '@/types';
import {getImageURL} from '@/utils/files';

// ---- LOCAL IMPORTS ---- //
import Search from './search';

export const Hero = ({
  workspace,
  tenantId,
}: {
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
}) => {
  const renderSearch = () => <Search workspace={workspace} />;

  const imageURL = workspace?.config?.resourcesHeroBgImage?.id
    ? `url(${getImageURL(workspace.config.resourcesHeroBgImage.id, tenantId)})`
    : IMAGE_URL;

  return (
    <>
      <HeroSearch
        title={
          workspace?.config?.resourcesHeroTitle ||
          i18n.get(BANNER_TITLES.resources)
        }
        description={
          workspace?.config?.resourcesHeroDescription ||
          i18n.get(BANNER_DESCRIPTION)
        }
        image={imageURL}
        background={
          workspace?.config?.resourcesHeroOverlayColorSelect || 'default'
        }
        blendMode={
          workspace?.config?.resourcesHeroOverlayColorSelect
            ? 'overlay'
            : 'normal'
        }
        renderSearch={renderSearch}
        tenantId={tenantId}
      />
    </>
  );
};

export default Hero;
