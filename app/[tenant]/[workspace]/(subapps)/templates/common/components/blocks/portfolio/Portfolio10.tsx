import {FC, Fragment} from 'react';
import Carousel from 'components/reuseable/Carousel';
import carouselBreakpoints from 'utils/carouselBreakpoints';
import {ProjectCard3} from 'components/reuseable/project-cards';
// -------- data -------- //
import {portfolioList6} from 'data/portfolio';

const Portfolio10: FC = () => {
  return (
    <Fragment>
      <div className="row mt-17">
        <div className="col-lg-10 col-xl-10 col-xxl-9 mx-auto text-center">
          <h2 className="fs-16 text-uppercase text-muted mb-3">
            Latest Projects
          </h2>
          <h3 className="display-3 mb-10">
            Look out for a few of our fantastic works with{' '}
            <span className="underline-3 style-2 yellow">outstanding</span>{' '}
            designs and innovative concepts.
          </h3>
        </div>
      </div>

      <div className="swiper-container grid-view">
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

export default Portfolio10;
