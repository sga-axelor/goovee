'use client';

// ---- CORE IMPORTS ---- //
import {IMAGE_URL} from '@/constants';
import {i18n} from '@/lib/i18n';
import {HeroSearch} from '@/ui/components';
import type {ID} from '@goovee/orm';

// ---- LOCAL IMPORTS ---- //
import Search from './search';

export const Hero = ({projectId}: {projectId?: ID}) => {
  const renderSearch = () => <Search projectId={projectId} />;

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
