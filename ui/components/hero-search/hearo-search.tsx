'use client';

// ---- CORE IMPORTS ---- //
import {Banner} from '@/ui/components';
import {VariantProps} from 'class-variance-authority';
import {BannerVariants} from '../banner';

type HearoSerchTypes = {
  groupImg?: string;
  title: string;
  description: string;
  image: any;
  renderSearch?: any;
} & VariantProps<BannerVariants>;

export const HeroSearch = ({
  groupImg,
  title,
  description,
  image,
  renderSearch,
  background,
  blendMode,
}: HearoSerchTypes) => {
  return (
    <>
      <Banner
        groupImg={groupImg}
        title={title}
        description={description}
        image={image}
        renderSearch={renderSearch}
        background={background}
        blendMode={blendMode}
      />
    </>
  );
};

export default HeroSearch;
