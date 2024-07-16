'use client';

// ---- CORE IMPORTS ---- //
import {Banner} from '@/ui/components';

type HearoSerchTypes = {
  title: string;
  description: string;
  image: any;
  renderSearch: any;
};

export const HeroSearch = ({
  title,
  description,
  image,
  renderSearch,
}: HearoSerchTypes) => {
  return (
    <>
      <Banner
        title={title}
        description={description}
        image={image}
        renderSearch={renderSearch}
      />
    </>
  );
};

export default HeroSearch;
