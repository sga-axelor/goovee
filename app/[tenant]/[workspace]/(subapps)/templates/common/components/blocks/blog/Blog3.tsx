import {FC, Fragment} from 'react';
import Carousel from 'components/reuseable/Carousel';
import carouselBreakpoints from 'utils/carouselBreakpoints';
import {BlogCard1} from 'components/reuseable/blog-cards';
// -------- data -------- //
import {blogList2} from 'data/blog';

const Blog3: FC = () => {
  return (
    <Fragment>
      <div className="row text-center">
        <div className="col-xxl-9 mx-auto">
          <h2 className="fs-15 text-uppercase text-muted mb-3">Case Studies</h2>
          <h3 className="display-4 mb-9">
            Take a look at a few of our excellent works with excellent designs
            and innovative concepts.
          </h3>
        </div>
      </div>

      <div className="swiper-container blog grid-view mb-18">
        <Carousel
          grabCursor
          navigation={false}
          breakpoints={carouselBreakpoints}>
          {blogList2.map(item => (
            <BlogCard1 key={item.id} {...item} />
          ))}
        </Carousel>
      </div>
    </Fragment>
  );
};

export default Blog3;
