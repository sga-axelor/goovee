'use client';

// ---- CORE IMPORTS ---- //
import {HeroSearch} from '@/ui/components';
import {i18n} from '@/locale';
import {
  BANNER_DESCRIPTION,
  BANNER_TITLES,
  IMAGE_URL,
  SUBAPP_CODES,
} from '@/constants';
import type {PortalWorkspace} from '@/types';

// ---- LOCAL IMPORTS ---- //
import Search from './search';

export const Hero = ({
  workspace,
  workspaceURL,
}: {
  workspace: PortalWorkspace;
  workspaceURL: string;
}) => {
  const renderSearch = () => <Search workspace={workspace} />;

  const imageURL = workspace?.config?.resourcesHeroBgImage?.id
    ? `${workspaceURL}/${SUBAPP_CODES.resources}/api/hero/background`
    : IMAGE_URL;

  return (
    <>
      <HeroSearch
        title={
          workspace?.config?.resourcesHeroTitle ||
          i18n.t(BANNER_TITLES.resources)
        }
        description={
          workspace?.config?.resourcesHeroDescription ||
          i18n.t(BANNER_DESCRIPTION)
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
      />
    </>
  );
};

export default Hero;
