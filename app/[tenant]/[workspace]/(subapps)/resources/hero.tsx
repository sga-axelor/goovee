'use client';

// ---- CORE IMPORTS ---- //
import {HeroSearch} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import {
  BANNER_DESCRIPTION,
  BANNER_TITLE,
} from '@/subapps/resources/common/constants';
import Search from './search';
import {IMAGE_URL} from '@/constants';
import type {PortalWorkspace} from '@/types';

export const Hero = ({workspace}: {workspace: PortalWorkspace}) => {
  const renderSearch = () => <Search workspace={workspace} />;

  return (
    <>
      <HeroSearch
        title={BANNER_TITLE}
        description={BANNER_DESCRIPTION}
        image={IMAGE_URL}
        renderSearch={renderSearch}
      />
    </>
  );
};

export default Hero;
