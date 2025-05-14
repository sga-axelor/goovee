import {FC, Fragment} from 'react';
import Carousel from '@/subapps/website/common/components/reuseable/Carousel';
import carouselBreakpoints from '@/subapps/website/common/utils/carouselBreakpoints';
import {ProjectCard3} from '@/subapps/website/common/components/reuseable/project-cards';
// -------- data -------- //
import {portfolioList6} from '@/subapps/website/common/data/portfolio';

const Portfolio12: FC = () => {
  return (
    <Fragment>
      <div className="row">
        <div className="col-lg-10 col-xl-8 mx-auto text-center">
          <h2 className="fs-16 text-uppercase text-muted mb-3">
            Latest Projects
          </h2>
          <h3 className="display-4 mb-10 px-xxl-10">
            Check out some of our awesome projects with creative ideas and great
            design.
          </h3>
        </div>
      </div>

      <div className="swiper-container grid-view mb-19">
        <Carousel
          navigation={false}
          grabCursor
          breakpoints={carouselBreakpoints}>
          {portfolioList6.map(item => (
            <ProjectCard3 key={item.id} {...item} />
          ))}
        </Carousel>
      </div>
    </Fragment>
  );
};

export default Portfolio12;
