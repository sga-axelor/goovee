import {FC} from 'react';
import {TestimonialCard3} from '@/subapps/templates/common/components/reuseable/testimonial-cards';
// -------- custom hook -------- //
import useIsotope from '@/subapps/templates/common/hooks/useIsotope';
// -------- data -------- //
import {testimonialList} from '@/subapps/templates/common/data/demo-7';

const Testimonial10: FC = () => {
  // used for masonry layout
  useIsotope();

  return (
    <section className="wrapper bg-soft-primary">
      <div className="container py-14 py-md-17">
        <div className="row mt-md-n25">
          <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2 mx-auto text-center">
            <h2 className="fs-15 text-uppercase text-muted mb-3">
              Happy Clients
            </h2>
            <h3 className="display-4 mb-10 px-xl-10 px-xxl-15">
              Avoid just believing us. Discover what our clients have thought
              about us.
            </h3>
          </div>
        </div>

        <div className="grid">
          <div className="row isotope gy-6">
            {testimonialList.map(item => (
              <div className="item col-md-6 col-xl-4" key={item.id}>
                <TestimonialCard3 {...item} shadow />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial10;
