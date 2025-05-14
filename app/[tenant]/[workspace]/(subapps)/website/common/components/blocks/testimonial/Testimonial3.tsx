import {FC, Fragment} from 'react';
import {Tiles3} from '@/subapps/website/common/components/elements/tiles';
import Carousel from '@/subapps/website/common/components/reuseable/Carousel';
import {TestimonialCard2} from '@/subapps/website/common/components/reuseable/testimonial-cards';
// -------- data -------- //
import {testimonialList2} from '@/subapps/website/common/data/testimonial-list';

const Testimonial3: FC = () => {
  return (
    <Fragment>
      <h3 className="display-4 mb-3 text-center">
        What Our Customers Think About Us
      </h3>
      <p className="lead fs-lg mb-10 text-center">
        Read our customer reviews to see what they are saying about our services
        and expertise.
      </p>

      <div className="row gx-lg-8 gx-xl-12 gy-6 mb-14 align-items-center">
        <div className="col-lg-7">
          <Tiles3 />
        </div>

        <div className="col-lg-5 mt-5">
          <div className="swiper-container dots-closer mb-6">
            <Carousel grabCursor slidesPerView={1} navigation={false}>
              {testimonialList2.map((item, i) => (
                <TestimonialCard2 key={i} {...item} />
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Testimonial3;
