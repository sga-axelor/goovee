'use client';

// ---- CORE IMPORTS ---- //
import {IMAGE_URL} from '@/constants';
import {i18n} from '@/lib/i18n';
import type {PortalWorkspace} from '@/types';
import {HeroSearch} from '@/ui/components';
import type {ID} from '@goovee/orm';

// ---- LOCAL IMPORTS ---- //
import Search from './search';

export const Hero = ({
  workspace,
  projectId,
}: {
  workspace: PortalWorkspace;
  projectId: ID;
}) => {
  const renderSearch = () => (
    <Search workspace={workspace} projectId={projectId} />
  );

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
