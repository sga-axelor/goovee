import {FC} from 'react';
import Image from 'next/image';
import Carousel from '@/subapps/templates/common/components/reuseable/Carousel';
// -------- data -------- //
import {portfolioList1} from '@/subapps/templates/common/data/portfolio';

const Portfolio1: FC = () => {
  const carouselBreakpoints = {
    0: {slidesPerView: 1},
    768: {slidesPerView: 2},
    992: {slidesPerView: 3},
  };

  return (
    <div className="container-fluid px-md-6">
      <div className="swiper-container blog grid-view mb-17 mb-md-19">
        <Carousel grabCursor breakpoints={carouselBreakpoints}>
          {portfolioList1.map((item, i) => (
            <figure className="rounded" key={i}>
              <Image
                width={380}
                height={320}
                src={item}
                alt="project"
                style={{width: '100%', height: 'auto'}}
              />
            </figure>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Portfolio1;
