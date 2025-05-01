import {FC} from 'react';
import ListColumn from '@/subapps/templates/common/components/reuseable/ListColumn';
// -------- data -------- //
import {aboutList1} from '@/subapps/templates/common/data/about';

const Services2: FC = () => {
  return (
    <section className="wrapper bg-light">
      <div className="container">
        <div className="row gx-lg-8 gx-xl-12 gy-10 align-items-center">
          <div className="col-lg-7 order-lg-2">
            <figure className="text-center">
              <img
                className="w-auto"
                alt="our solutions"
                src="/img/illustrations/i8.png"
                srcSet="/img/illustrations/i8@2x.png 2x"
              />
            </figure>
          </div>

          <div className="col-lg-5">
            <h2 className="fs-16 text-uppercase text-muted mb-3">
              Our Solutions
            </h2>
            <h3 className="display-4 mb-5">
              We provide effortless spending control with complete peace of
              mind.
            </h3>

            <p className="mb-6">
              At our company, we understand that managing spending can be
              stressful and overwhelming, which is why we offer a range of
              services aimed at effortless for you to stay in control.
            </p>

            <ListColumn list={aboutList1} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services2;
