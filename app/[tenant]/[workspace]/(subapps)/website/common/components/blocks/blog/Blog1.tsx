import {FC} from 'react';
import Carousel from '@/subapps/website/common/components/reuseable/Carousel';
import {BlogCard1} from '@/subapps/website/common/components/reuseable/blog-cards';
// -------- carousel breakpoint obj -------- //
import carouselBreakpoints from '@/subapps/website/common/utils/carouselBreakpoints';
// -------- data -------- //
import {blogList1} from '@/subapps/website/common/data/blog';

const Blog1: FC = () => {
  return (
    <section className="wrapper bg-light angled upper-end">
      <div className="container py-14 py-md-16">
        <div className="row">
          <div className="col-lg-9 col-xl-8">
            <h2 className="fs-16 text-uppercase text-line text-primary mb-3">
              Case Studies
            </h2>
            <h3 className="display-5 mb-9">
              Explore our impressive portfolio of projects, <br /> featuring
              innovative concepts and exceptional design.
            </h3>
          </div>
        </div>

        <div className="swiper-container blog grid-view mb-10">
          <Carousel
            grabCursor
            navigation={false}
            breakpoints={carouselBreakpoints}>
            {blogList1.map(item => (
              <BlogCard1 key={item.id} {...item} />
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Blog1;
