'use client';

// ---- CORE IMPORTS ---- //
import {HeroSearch} from '@/ui/components';
import {IMAGE_URL} from '@/constants';
import {i18n} from '@/lib/i18n';
import type {PortalWorkspace} from '@/types';

// ---- LOCAL IMPORTS ---- //
import Search from './search';

export const Hero = ({workspace}: {workspace: PortalWorkspace}) => {
  const renderSearch = () => <Search workspace={workspace} />;

  return (
    <>
      <HeroSearch
        title={i18n.get('Ticketing')}
        description={i18n.get(
          'Mi eget leo viverra cras pharetra enim viverra. Ac at non pretium etiam viverra. Ac at non pretium etiam',
        )}
        image={IMAGE_URL}
        renderSearch={renderSearch}
      />
    </>
  );
};

export default Hero;
