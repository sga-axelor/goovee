'use client';

// ---- CORE IMPORTS ---- //
import {IMAGE_URL} from '@/constants';
import {i18n} from '@/i18n';
import {HeroSearch} from '@/ui/components';
import type {ID} from '@goovee/orm';
import {VariantProps} from 'class-variance-authority';
import {BannerVariants} from '@/ui/components/banner';

// ---- LOCAL IMPORTS ---- //
import Search from './search';

export const Hero = ({
  tenantId,
  title,
  description,
  image,
  background,
}: {
  projectId?: ID;
  tenantId: string;
  title?: string;
  description?: string;
  image?: string;
  background?: VariantProps<BannerVariants>['background'];
}) => {
  const renderSearch = () => <Search />;

  return (
    <HeroSearch
      title={title || i18n.get('Directory')}
      description={
        description ||
        i18n.get(
          'Mi eget leo viverra cras pharetra enim viverra. Ac at non pretium etiam viverra. Ac at non pretium etiam',
        )
      }
      background={background || 'default'}
      blendMode={background ? 'overlay' : 'normal'}
      image={image ?? IMAGE_URL}
      tenantId={tenantId}
      renderSearch={renderSearch}
    />
  );
};

export default Hero;
