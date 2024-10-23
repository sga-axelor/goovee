'use client';

// ---- CORE IMPORTS ---- //
import {HeroSearch} from '@/ui/components';
import {i18n} from '@/lib/i18n';
import {BANNER_DESCRIPTION, BANNER_TITLES, IMAGE_URL} from '@/constants';
import type {PortalWorkspace} from '@/types';
import {getImageURL} from '@/utils/image';

// ---- LOCAL IMPORTS ---- //
import Search from './search';

export const Hero = ({workspace}: {workspace: PortalWorkspace}) => {
  const renderSearch = () => <Search workspace={workspace} />;

  const imageURL = workspace?.config?.resourcesHeroBgImage?.id
    ? `url(${getImageURL(workspace.config.resourcesHeroBgImage.id)})`
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
      />
    </>
  );
};

export default Hero;
